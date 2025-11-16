"""
Banking operations routes - auto-login and session management
"""

from flask import Blueprint, request, jsonify, session, current_app
from ..models import User, BankingSite, BankingSession, AuditLog, db
from ..services.infisical import InfisicalClient
from ..services.kasm import KasmClient
from ..services.playwright_automation import BankingAutomation
import logging

bp = Blueprint('banking', __name__, url_prefix='/api/banking')
logger = logging.getLogger(__name__)


def require_auth(f):
    """Decorator to require authentication"""
    from functools import wraps
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function


@bp.route('/sites', methods=['GET'])
@require_auth
def list_banking_sites():
    """List all available banking sites"""
    sites = BankingSite.query.filter_by(is_active=True).all()
    return jsonify([{
        'id': site.id,
        'code': site.code,
        'name': site.name,
        'url': site.url
    } for site in sites])


@bp.route('/sessions', methods=['GET'])
@require_auth
def list_sessions():
    """List user's active banking sessions"""
    user_id = session['user_id']
    sessions = BankingSession.query.filter_by(
        user_id=user_id,
        status='active'
    ).all()
    
    return jsonify([{
        'id': sess.id,
        'banking_site': sess.banking_site.name,
        'status': sess.status,
        'started_at': sess.started_at.isoformat(),
        'kasm_session_id': sess.kasm_session_id
    } for sess in sessions])


@bp.route('/sessions/<int:session_id>', methods=['DELETE'])
@require_auth
def end_session(session_id):
    """End a banking session"""
    user_id = session['user_id']
    banking_session = BankingSession.query.filter_by(
        id=session_id,
        user_id=user_id
    ).first()
    
    if not banking_session:
        return jsonify({'error': 'Session not found'}), 404
    
    try:
        # Terminate Kasm session
        kasm = KasmClient(
            current_app.config['KASM_URL'],
            current_app.config['KASM_API_KEY'],
            current_app.config['KASM_API_SECRET']
        )
        kasm.terminate_session(banking_session.kasm_session_id)
        
        # Update database
        banking_session.status = 'completed'
        banking_session.ended_at = db.func.now()
        db.session.commit()
        
        # Audit log
        audit = AuditLog(
            user_id=user_id,
            action='end_session',
            resource_type='banking_session',
            resource_id=str(session_id),
            ip_address=request.remote_addr,
            status='success'
        )
        db.session.add(audit)
        db.session.commit()
        
        return jsonify({'message': 'Session ended successfully'})
    
    except Exception as e:
        logger.error(f"Error ending session: {str(e)}")
        return jsonify({'error': 'Failed to end session'}), 500


@bp.route('/launch', methods=['POST'])
@require_auth
def launch_banking_session():
    """Launch a new banking session with auto-login"""
    user_id = session['user_id']
    data = request.json
    
    # Validate input
    banking_site_id = data.get('banking_site_id')
    credential_id = data.get('credential_id')
    
    if not banking_site_id or not credential_id:
        return jsonify({'error': 'Missing required parameters'}), 400
    
    # Check session limit
    active_sessions = BankingSession.query.filter_by(
        user_id=user_id,
        status='active'
    ).count()
    
    max_sessions = current_app.config['MAX_SESSIONS_PER_USER']
    if active_sessions >= max_sessions:
        return jsonify({
            'error': f'Maximum concurrent sessions ({max_sessions}) reached'
        }), 429
    
    try:
        # Get banking site
        site = BankingSite.query.get(banking_site_id)
        if not site or not site.is_active:
            return jsonify({'error': 'Banking site not found'}), 404
        
        # Get credentials from Infisical
        infisical = InfisicalClient(
            current_app.config['INFISICAL_URL'],
            current_app.config['INFISICAL_TOKEN']
        )
        credentials = infisical.get_secret(credential_id)
        
        # Create Kasm workspace session
        kasm = KasmClient(
            current_app.config['KASM_URL'],
            current_app.config['KASM_API_KEY'],
            current_app.config['KASM_API_SECRET']
        )
        
        user = User.query.get(user_id)
        kasm_session = kasm.create_session(
            user_email=user.email,
            image_id=site.code.lower(),
            enable_recording=True
        )
        
        # Create banking session record
        banking_session = BankingSession(
            user_id=user_id,
            banking_site_id=banking_site_id,
            kasm_session_id=kasm_session['session_id'],
            kasm_workspace_id=kasm_session['workspace_id'],
            status='pending'
        )
        db.session.add(banking_session)
        db.session.commit()
        
        # Perform auto-login using Playwright
        automation = BankingAutomation(site, credentials)
        login_result = automation.perform_login(kasm_session['url'])
        
        # Update session status
        banking_session.status = 'active' if login_result['success'] else 'failed'
        banking_session.recording_path = kasm_session.get('recording_path')
        db.session.commit()
        
        # Audit log
        audit = AuditLog(
            user_id=user_id,
            action='launch_session',
            resource_type='banking_session',
            resource_id=str(banking_session.id),
            ip_address=request.remote_addr,
            status='success' if login_result['success'] else 'failure',
            details={
                'banking_site': site.code,
                'credential_id': credential_id
            }
        )
        db.session.add(audit)
        db.session.commit()
        
        return jsonify({
            'session_id': banking_session.id,
            'kasm_url': kasm_session['url'],
            'status': banking_session.status,
            'message': login_result.get('message')
        })
    
    except Exception as e:
        logger.error(f"Error launching banking session: {str(e)}")
        
        # Audit log for failure
        audit = AuditLog(
            user_id=user_id,
            action='launch_session',
            resource_type='banking_session',
            ip_address=request.remote_addr,
            status='failure',
            details={'error': str(e)}
        )
        db.session.add(audit)
        db.session.commit()
        
        return jsonify({'error': 'Failed to launch banking session'}), 500

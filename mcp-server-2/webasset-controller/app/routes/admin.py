"""
Admin routes for managing banking sites and monitoring
"""

from flask import Blueprint, request, jsonify, session
from ..models import User, BankingSite, BankingSession, AuditLog, db
import logging

bp = Blueprint('admin', __name__, url_prefix='/api/admin')
logger = logging.getLogger(__name__)


def require_admin(f):
    """Decorator to require admin access"""
    from functools import wraps
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        # In production, check if user has admin role from Authentik
        # For now, we'll allow all authenticated users
        return f(*args, **kwargs)
    return decorated_function


@bp.route('/sites', methods=['GET'])
@require_admin
def get_all_sites():
    """Get all banking sites (including inactive)"""
    sites = BankingSite.query.all()
    return jsonify([{
        'id': site.id,
        'code': site.code,
        'name': site.name,
        'url': site.url,
        'is_active': site.is_active,
        'created_at': site.created_at.isoformat()
    } for site in sites])


@bp.route('/sites', methods=['POST'])
@require_admin
def create_site():
    """Create a new banking site"""
    data = request.json
    
    required_fields = ['code', 'name', 'url']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if site already exists
    existing = BankingSite.query.filter_by(code=data['code']).first()
    if existing:
        return jsonify({'error': 'Site with this code already exists'}), 409
    
    site = BankingSite(
        code=data['code'],
        name=data['name'],
        url=data['url'],
        login_url=data.get('login_url'),
        username_selector=data.get('username_selector'),
        password_selector=data.get('password_selector'),
        submit_selector=data.get('submit_selector'),
        two_factor_selector=data.get('two_factor_selector'),
        success_indicator=data.get('success_indicator')
    )
    
    db.session.add(site)
    db.session.commit()
    
    # Audit log
    audit = AuditLog(
        user_id=session['user_id'],
        action='create_site',
        resource_type='banking_site',
        resource_id=str(site.id),
        ip_address=request.remote_addr,
        status='success'
    )
    db.session.add(audit)
    db.session.commit()
    
    return jsonify({
        'id': site.id,
        'code': site.code,
        'name': site.name
    }), 201


@bp.route('/sites/<int:site_id>', methods=['PUT'])
@require_admin
def update_site(site_id):
    """Update banking site"""
    site = BankingSite.query.get(site_id)
    if not site:
        return jsonify({'error': 'Site not found'}), 404
    
    data = request.json
    
    # Update fields
    if 'name' in data:
        site.name = data['name']
    if 'url' in data:
        site.url = data['url']
    if 'login_url' in data:
        site.login_url = data['login_url']
    if 'is_active' in data:
        site.is_active = data['is_active']
    if 'username_selector' in data:
        site.username_selector = data['username_selector']
    if 'password_selector' in data:
        site.password_selector = data['password_selector']
    if 'submit_selector' in data:
        site.submit_selector = data['submit_selector']
    
    db.session.commit()
    
    # Audit log
    audit = AuditLog(
        user_id=session['user_id'],
        action='update_site',
        resource_type='banking_site',
        resource_id=str(site_id),
        ip_address=request.remote_addr,
        status='success'
    )
    db.session.add(audit)
    db.session.commit()
    
    return jsonify({'message': 'Site updated successfully'})


@bp.route('/sessions', methods=['GET'])
@require_admin
def get_all_sessions():
    """Get all banking sessions with filters"""
    status = request.args.get('status')
    user_id = request.args.get('user_id')
    
    query = BankingSession.query
    
    if status:
        query = query.filter_by(status=status)
    if user_id:
        query = query.filter_by(user_id=user_id)
    
    sessions = query.order_by(BankingSession.started_at.desc()).limit(100).all()
    
    return jsonify([{
        'id': sess.id,
        'user': sess.user.username,
        'banking_site': sess.banking_site.name,
        'status': sess.status,
        'started_at': sess.started_at.isoformat(),
        'ended_at': sess.ended_at.isoformat() if sess.ended_at else None,
        'recording_path': sess.recording_path
    } for sess in sessions])


@bp.route('/audit-logs', methods=['GET'])
@require_admin
def get_audit_logs():
    """Get audit logs with pagination"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 50, type=int)
    action = request.args.get('action')
    
    query = AuditLog.query
    
    if action:
        query = query.filter_by(action=action)
    
    logs = query.order_by(AuditLog.created_at.desc()).paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )
    
    return jsonify({
        'logs': [{
            'id': log.id,
            'user': log.user.username if log.user else 'System',
            'action': log.action,
            'resource_type': log.resource_type,
            'resource_id': log.resource_id,
            'status': log.status,
            'ip_address': log.ip_address,
            'created_at': log.created_at.isoformat()
        } for log in logs.items],
        'total': logs.total,
        'pages': logs.pages,
        'current_page': page
    })


@bp.route('/stats', methods=['GET'])
@require_admin
def get_statistics():
    """Get system statistics"""
    active_sessions = BankingSession.query.filter_by(status='active').count()
    total_users = User.query.filter_by(is_active=True).count()
    total_sites = BankingSite.query.filter_by(is_active=True).count()
    
    # Sessions by status
    session_stats = db.session.query(
        BankingSession.status,
        db.func.count(BankingSession.id)
    ).group_by(BankingSession.status).all()
    
    return jsonify({
        'active_sessions': active_sessions,
        'total_users': total_users,
        'total_sites': total_sites,
        'sessions_by_status': {status: count for status, count in session_stats}
    })

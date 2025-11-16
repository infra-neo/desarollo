"""
Authentication routes using Authentik OAuth
"""

from flask import Blueprint, request, redirect, session, jsonify, current_app
from authlib.integrations.flask_client import OAuth
from ..models import User, AuditLog, db
import logging

bp = Blueprint('auth', __name__, url_prefix='/auth')
logger = logging.getLogger(__name__)


@bp.route('/login')
def login():
    """Initiate OAuth login with Authentik"""
    redirect_uri = request.url_root + 'auth/callback'
    return current_app.extensions['authlib.integrations.flask_client'].authentik.authorize_redirect(redirect_uri)


@bp.route('/callback')
def callback():
    """OAuth callback handler"""
    try:
        token = current_app.extensions['authlib.integrations.flask_client'].authentik.authorize_access_token()
        user_info = token.get('userinfo')
        
        if not user_info:
            return jsonify({'error': 'Failed to get user info'}), 400
        
        # Create or update user
        user = User.query.filter_by(authentik_id=user_info['sub']).first()
        if not user:
            user = User(
                authentik_id=user_info['sub'],
                username=user_info.get('preferred_username', user_info['email']),
                email=user_info['email'],
                full_name=user_info.get('name', '')
            )
            db.session.add(user)
        else:
            user.email = user_info['email']
            user.full_name = user_info.get('name', '')
            user.is_active = True
        
        db.session.commit()
        
        # Store in session
        session['user_id'] = user.id
        session['username'] = user.username
        session['email'] = user.email
        
        # Log successful login
        audit = AuditLog(
            user_id=user.id,
            action='login',
            resource_type='auth',
            ip_address=request.remote_addr,
            user_agent=request.user_agent.string,
            status='success'
        )
        db.session.add(audit)
        db.session.commit()
        
        logger.info(f"User {user.username} logged in successfully")
        
        return redirect('/dashboard')
    
    except Exception as e:
        logger.error(f"Login callback error: {str(e)}")
        return jsonify({'error': 'Authentication failed'}), 500


@bp.route('/logout')
def logout():
    """Logout user"""
    user_id = session.get('user_id')
    if user_id:
        audit = AuditLog(
            user_id=user_id,
            action='logout',
            resource_type='auth',
            ip_address=request.remote_addr,
            user_agent=request.user_agent.string,
            status='success'
        )
        db.session.add(audit)
        db.session.commit()
    
    session.clear()
    return redirect(current_app.config['AUTHENTIK_URL'] + '/application/o/webasset-controller/end-session/')


@bp.route('/user')
def get_user():
    """Get current user information"""
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'full_name': user.full_name
    })

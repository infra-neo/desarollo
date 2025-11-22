"""
Health check endpoint
"""

from flask import Blueprint, jsonify
from .. import db

bp = Blueprint('health', __name__)


@bp.route('/health')
def health():
    """Health check endpoint"""
    try:
        # Check database connection
        db.session.execute(db.text('SELECT 1'))
        return jsonify({
            'status': 'healthy',
            'service': 'webasset-controller',
            'database': 'connected'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'service': 'webasset-controller',
            'database': 'disconnected',
            'error': str(e)
        }), 503


@bp.route('/ready')
def ready():
    """Readiness check endpoint"""
    return jsonify({'status': 'ready'}), 200

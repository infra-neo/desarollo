"""
WebAsset Controller - Main Application
Banking site auto-login controller with Authentik SSO and Infisical secret management
"""

import os
from flask import Flask, request, jsonify, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from authlib.integrations.flask_client import OAuth
import logging

# Initialize extensions
db = SQLAlchemy()
oauth = OAuth()

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Authentik OAuth configuration
    app.config['AUTHENTIK_URL'] = os.getenv('AUTHENTIK_URL')
    app.config['AUTHENTIK_CLIENT_ID'] = os.getenv('AUTHENTIK_CLIENT_ID')
    app.config['AUTHENTIK_CLIENT_SECRET'] = os.getenv('AUTHENTIK_CLIENT_SECRET')
    
    # Infisical configuration
    app.config['INFISICAL_URL'] = os.getenv('INFISICAL_URL')
    app.config['INFISICAL_TOKEN'] = os.getenv('INFISICAL_TOKEN')
    
    # KasmWeb configuration
    app.config['KASM_URL'] = os.getenv('KASM_URL')
    app.config['KASM_API_KEY'] = os.getenv('KASM_API_KEY')
    app.config['KASM_API_SECRET'] = os.getenv('KASM_API_SECRET')
    
    # Session limits
    app.config['MAX_SESSIONS_PER_USER'] = int(os.getenv('MAX_SESSIONS_PER_USER', 5))
    
    # Initialize extensions
    db.init_app(app)
    CORS(app)
    oauth.init_app(app)
    
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('/app/logs/webasset.log'),
            logging.StreamHandler()
        ]
    )
    
    # Register OAuth provider (Authentik)
    oauth.register(
        name='authentik',
        client_id=app.config['AUTHENTIK_CLIENT_ID'],
        client_secret=app.config['AUTHENTIK_CLIENT_SECRET'],
        server_metadata_url=f"{app.config['AUTHENTIK_URL']}/.well-known/openid-configuration",
        client_kwargs={'scope': 'openid email profile'}
    )
    
    # Import and register blueprints
    from .routes import auth, banking, admin, health
    app.register_blueprint(auth.bp)
    app.register_blueprint(banking.bp)
    app.register_blueprint(admin.bp)
    app.register_blueprint(health.bp)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=False)

"""
Database models for WebAsset Controller
"""

from datetime import datetime
from . import db


class User(db.Model):
    """User model synced with Authentik"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    authentik_id = db.Column(db.String(255), unique=True, nullable=False)
    username = db.Column(db.String(255), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    full_name = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    sessions = db.relationship('BankingSession', backref='user', lazy=True)
    audit_logs = db.relationship('AuditLog', backref='user', lazy=True)


class BankingSite(db.Model):
    """Banking site definitions"""
    __tablename__ = 'banking_sites'
    
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False)  # e.g., 'BMG', 'FACTA'
    name = db.Column(db.String(255), nullable=False)
    url = db.Column(db.String(500), nullable=False)
    login_url = db.Column(db.String(500))
    username_selector = db.Column(db.String(255))
    password_selector = db.Column(db.String(255))
    submit_selector = db.Column(db.String(255))
    two_factor_selector = db.Column(db.String(255))
    success_indicator = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    sessions = db.relationship('BankingSession', backref='banking_site', lazy=True)


class BankingCredential(db.Model):
    """Banking credentials stored in Infisical (metadata only)"""
    __tablename__ = 'banking_credentials'
    
    id = db.Column(db.Integer, primary_key=True)
    banking_site_id = db.Column(db.Integer, db.ForeignKey('banking_sites.id'), nullable=False)
    infisical_secret_id = db.Column(db.String(255), nullable=False)  # Reference to Infisical
    credential_name = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    last_used = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class BankingSession(db.Model):
    """Active banking sessions"""
    __tablename__ = 'banking_sessions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    banking_site_id = db.Column(db.Integer, db.ForeignKey('banking_sites.id'), nullable=False)
    kasm_session_id = db.Column(db.String(255))
    kasm_workspace_id = db.Column(db.String(255))
    status = db.Column(db.String(50), default='pending')  # pending, active, completed, failed
    recording_path = db.Column(db.String(500))
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    ended_at = db.Column(db.DateTime)
    metadata = db.Column(db.JSON)


class AuditLog(db.Model):
    """Audit log for all actions"""
    __tablename__ = 'audit_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    action = db.Column(db.String(100), nullable=False)
    resource_type = db.Column(db.String(50))
    resource_id = db.Column(db.String(255))
    ip_address = db.Column(db.String(45))
    user_agent = db.Column(db.String(500))
    status = db.Column(db.String(50))  # success, failure
    details = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<AuditLog {self.action} by User {self.user_id}>'

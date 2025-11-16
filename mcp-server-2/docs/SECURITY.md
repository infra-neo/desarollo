# Security Guidelines - MCP Server 2

## Overview

MCP Server 2 implements a defense-in-depth security strategy with multiple layers of protection for banking operations.

## Security Architecture

### Zero Trust Model
- **Principle**: Never trust, always verify
- **Implementation**: All services require authentication via Authentik SSO
- **Network**: Tailscale VPN for administrative access
- **Isolation**: Banking workspaces in separate network segment

### Network Security

#### Firewall Rules
```
Allowed Inbound:
- Port 80/TCP: HTTP (for Let's Encrypt only)
- Port 443/TCP: HTTPS (all services via Traefik)
- Port 22/TCP: SSH (restricted to admin IPs - optional)
- Port 41641/UDP: Tailscale VPN

Denied:
- All other ports (explicit deny-all rule)
```

#### Network Segmentation
- **mcp-internal** (172.20.0.0/16): Service mesh
- **kasm-isolated** (172.21.0.0/16): Banking workspaces (no internet access)

### Authentication & Authorization

#### Multi-Factor Authentication (MFA)
- **Required**: All users must enable MFA
- **Methods**: TOTP, WebAuthn, SMS (configured in Authentik)
- **Enforcement**: Policies in Authentik prevent login without MFA

#### Single Sign-On (SSO)
- **Provider**: Authentik (OIDC/OAuth2)
- **Applications**: All services integrated
- **Session Management**: Centralized session control
- **Logout**: Single logout terminates all sessions

#### Role-Based Access Control (RBAC)
```yaml
Roles:
  Admin:
    - Full system access
    - User management
    - Configuration changes
    - Audit log access
  
  User:
    - Launch banking sessions
    - View own sessions
    - Access recordings of own sessions
  
  Auditor:
    - Read-only access
    - View all audit logs
    - Access all session recordings
```

### Data Protection

#### Encryption in Transit
- **TLS 1.3**: All HTTPS connections
- **Certificate Management**: Automatic via Let's Encrypt
- **HSTS**: Enabled with 1-year max-age
- **Perfect Forward Secrecy**: Enforced

#### Encryption at Rest
- **Secrets**: Infisical with AES-256 encryption
- **Database**: PostgreSQL with encrypted volumes
- **Recordings**: Encrypted storage volumes
- **Backups**: Encrypted before storage

#### Secret Management
- **Storage**: Infisical (never in code or config files)
- **Access**: API token-based with rotation
- **Rotation**: Manual rotation supported, automated rotation planned
- **Audit**: All secret access logged

### Container Security

#### Image Security
```dockerfile
# Non-root user
USER 1000

# Minimal base images
FROM python:3.11-slim

# No unnecessary packages
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Read-only filesystem where possible
volumes:
  - ./config:/app/config:ro
```

#### Runtime Security
- **Capabilities**: Minimal Linux capabilities
- **Privileged**: No privileged containers (except Tailscale)
- **Resource Limits**: CPU and memory limits enforced
- **Network Policies**: Restricted inter-container communication

### Application Security

#### Input Validation
- All user inputs sanitized
- SQL injection prevention via parameterized queries
- XSS prevention via output encoding
- CSRF protection enabled

#### Session Security
```python
# Session configuration
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_TIMEOUT = 30  # minutes
MAX_SESSIONS_PER_USER = 5
```

#### API Security
- Rate limiting enabled
- Request size limits
- Authentication required for all endpoints
- Input validation on all parameters

### Audit & Logging

#### What We Log
```yaml
Authentication:
  - Login attempts (success/failure)
  - Logout events
  - MFA challenges
  - Session creation/termination

Banking Operations:
  - Session launches
  - Site access
  - Credential retrieval
  - Auto-login attempts

Administrative:
  - Configuration changes
  - User management
  - Secret access
  - System changes
```

#### Log Retention
- **Audit Logs**: 90 days (configurable)
- **Session Recordings**: 90 days (configurable)
- **Access Logs**: 30 days
- **System Logs**: 7 days

#### Log Protection
- Immutable logs (append-only)
- Encrypted storage
- Access restricted to admins
- Regular backups

### Compliance

#### Banking Regulations
- ✅ Session recording for audit trails
- ✅ Multi-factor authentication
- ✅ Credential isolation
- ✅ Access logging
- ✅ Data encryption

#### Best Practices
- ✅ OWASP Top 10 protection
- ✅ CIS Docker Benchmark compliance
- ✅ Cloud security best practices
- ✅ Zero Trust principles

## Security Procedures

### Password Policy
```
Minimum Requirements:
- Length: 12 characters
- Complexity: Mixed case, numbers, symbols
- Expiration: 90 days
- History: Last 5 passwords
- Lockout: 5 failed attempts
```

### Secret Rotation
```bash
# Rotate database passwords
1. Generate new password
2. Update Infisical
3. Update .env file
4. Restart services
5. Verify connectivity
6. Update backups

# Rotate API keys
1. Generate new keys in respective services
2. Update .env file
3. Restart dependent services
4. Revoke old keys
5. Verify functionality
```

### Incident Response

#### Security Incident Procedure
1. **Detection**: Alert triggered or manual discovery
2. **Containment**: Isolate affected systems
3. **Investigation**: Analyze logs and recordings
4. **Remediation**: Fix vulnerability
5. **Recovery**: Restore normal operations
6. **Review**: Post-incident analysis

#### Emergency Contacts
```yaml
Security Team:
  - Email: security@yourdomain.com
  - Phone: +XX-XXX-XXX-XXXX
  - On-call: Rotation schedule

Escalation:
  Level 1: System Administrator
  Level 2: Security Officer
  Level 3: CTO/CISO
```

### Vulnerability Management

#### Scanning Schedule
- **Daily**: Automated vulnerability scans
- **Weekly**: Dependency updates
- **Monthly**: Security audit
- **Quarterly**: Penetration testing

#### Patch Management
```bash
# Critical patches: Within 24 hours
# High severity: Within 7 days
# Medium severity: Within 30 days
# Low severity: Next maintenance window

# Process:
1. Identify vulnerabilities
2. Test patches in staging
3. Schedule maintenance window
4. Apply patches
5. Verify system health
6. Update documentation
```

## Security Hardening Checklist

### Infrastructure
- [ ] Firewall rules configured correctly
- [ ] SSH key-based authentication only
- [ ] Automatic security updates enabled
- [ ] Fail2ban installed and configured
- [ ] OS hardening applied (CIS benchmarks)
- [ ] Unused services disabled
- [ ] File integrity monitoring enabled

### Application
- [ ] All secrets in Infisical
- [ ] HTTPS enforced everywhere
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak info

### Database
- [ ] Strong passwords
- [ ] Network access restricted
- [ ] Encryption at rest enabled
- [ ] Regular backups
- [ ] Backup encryption enabled
- [ ] Connection pooling configured
- [ ] Query logging enabled

### Monitoring
- [ ] Failed login alerts
- [ ] Unusual access patterns
- [ ] Resource exhaustion
- [ ] Certificate expiration
- [ ] Backup failures
- [ ] Service health checks

## Security Testing

### Regular Tests
```bash
# Port scan
nmap -sV -sC your-domain.com

# SSL test
testssl.sh your-domain.com

# Web application scan
nikto -h https://your-domain.com

# Dependency check
safety check -r requirements.txt

# Container scan
trivy image mcp-server-2-webasset:latest
```

### Penetration Testing
- **Frequency**: Quarterly
- **Scope**: All external-facing services
- **Type**: Black box and gray box
- **Report**: Detailed findings with remediation steps

## Security Contacts

### Reporting Security Issues
- **Email**: security@yourdomain.com
- **PGP Key**: [Link to public key]
- **Response Time**: 24 hours for critical issues

### Security Updates
- **Mailing List**: security-updates@yourdomain.com
- **RSS Feed**: https://yourdomain.com/security/rss
- **Status Page**: https://status.yourdomain.com

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CIS Docker Benchmark](https://www.cisecurity.org/benchmark/docker)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [Cloud Security Alliance](https://cloudsecurityalliance.org/)

## Revision History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-01-16 | Initial security guidelines | DevOps Team |

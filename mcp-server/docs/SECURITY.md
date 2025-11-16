# MCP Server Security Hardening Guide

## Overview

This guide provides security hardening steps for production deployment of the MCP Server.

## Pre-Deployment Security Checklist

### 1. Strong Credentials

- [ ] Generate unique passwords for all services (50+ characters)
- [ ] Use `openssl rand -base64` for secret keys
- [ ] Change default passwords immediately after deployment
- [ ] Store credentials in a secure password manager

### 2. Environment Configuration

```bash
# Generate strong secrets
POSTGRES_PASSWORD=$(openssl rand -base64 40)
AUTHENTIK_SECRET_KEY=$(openssl rand -base64 60)
JUMPSERVER_SECRET_KEY=$(openssl rand -base64 40)
INFISICAL_ENCRYPTION_KEY=$(openssl rand -base64 32 | cut -c1-32)

# Add to .env
echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD" >> .env
echo "AUTHENTIK_SECRET_KEY=$AUTHENTIK_SECRET_KEY" >> .env
echo "JUMPSERVER_SECRET_KEY=$JUMPSERVER_SECRET_KEY" >> .env
echo "INFISICAL_ENCRYPTION_KEY=$INFISICAL_ENCRYPTION_KEY" >> .env
```

### 3. File Permissions

```bash
# Protect sensitive files
chmod 600 docker-compose/.env
chmod 600 terraform-gcp/terraform.tfvars

# Scripts should be executable by owner only
chmod 700 scripts/*.sh
chmod 700 jumpserver/scripts/*.py
```

## Network Security

### 1. Firewall Configuration (GCP)

Restrict access to specific IP ranges:

```hcl
# In terraform-gcp/variables.tf
variable "ssh_allowed_ips" {
  default = ["YOUR_OFFICE_IP/32"]  # Change from 0.0.0.0/0
}
```

### 2. Tailscale ACLs

Configure Tailscale ACLs to restrict access:

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["tag:admin"],
      "dst": ["tag:mcp:*"]
    },
    {
      "action": "accept",
      "src": ["group:authorized-users"],
      "dst": ["tag:mcp:80,443"]
    }
  ],
  "tagOwners": {
    "tag:mcp": ["admin@yourdomain.com"]
  }
}
```

### 3. Internal Network Isolation

Services communicate only through Docker networks:

```yaml
# Verify in docker-compose.yml
networks:
  mcp-network:
    driver: bridge
    internal: false  # Set to true for complete isolation
```

## Authentication & Authorization

### 1. Authentik MFA Enforcement

1. Access Authentik Admin Panel
2. Navigate to **Policies** → **Create**
3. Create **MFA Policy**:
   - Name: `Mandatory MFA`
   - Enforcement: `Required`
   - Methods: TOTP + WebAuthn

4. Bind to all applications

### 2. Session Security

Configure session timeouts:

```yaml
# In docker-compose.yml for each service
environment:
  SESSION_COOKIE_AGE: 3600  # 1 hour
  SESSION_EXPIRE_AT_BROWSER_CLOSE: "true"
  SESSION_COOKIE_SECURE: "true"
  SESSION_COOKIE_HTTPONLY: "true"
  SESSION_COOKIE_SAMESITE: "Lax"
```

### 3. Password Policies

In Authentik:
1. Navigate to **Policies** → **Create** → **Password Policy**
2. Configure:
   - Minimum length: 12
   - Require uppercase: Yes
   - Require lowercase: Yes
   - Require numbers: Yes
   - Require symbols: Yes
   - Password history: 5

## Data Security

### 1. Database Encryption at Rest

Enable encryption for PostgreSQL volumes:

```bash
# For GCP persistent disks
resource "google_compute_disk" "postgres_disk" {
  name                      = "mcp-postgres-disk"
  type                      = "pd-ssd"
  zone                      = var.zone
  size                      = 100
  physical_block_size_bytes = 4096
  
  disk_encryption_key {
    kms_key_self_link = google_kms_crypto_key.postgres_key.self_link
  }
}
```

### 2. Secrets Management

Store all secrets in Infisical:

```bash
# Never commit secrets to git
echo "*.env" >> .gitignore
echo "*.tfvars" >> .gitignore
echo "*.key" >> .gitignore
echo "*.pem" >> .gitignore
```

### 3. Backup Encryption

Encrypt backups:

```bash
#!/bin/bash
# backup-encrypted.sh

BACKUP_FILE="postgres-$(date +%Y%m%d-%H%M%S).sql"
ENCRYPTION_KEY="your-encryption-key"

# Backup and encrypt
docker exec mcp-postgresql pg_dumpall -U postgres | \
  gzip | \
  openssl enc -aes-256-cbc -salt -pbkdf2 -pass pass:$ENCRYPTION_KEY > \
  "$BACKUP_FILE.gz.enc"
```

## SSL/TLS Configuration

### 1. Strong TLS Settings

Already configured in `traefik/dynamic/middlewares.yml`:

```yaml
tls:
  options:
    default:
      minVersion: VersionTLS12
      cipherSuites:
        - TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
        - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
        - TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
        - TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
```

### 2. HSTS Headers

Configured in Traefik middleware:

```yaml
security-headers:
  headers:
    forceSTSHeader: true
    stsIncludeSubdomains: true
    stsSeconds: 63072000  # 2 years
    stsPreload: true
```

## Container Security

### 1. Run as Non-Root

Verify in Dockerfile:

```dockerfile
# Example: WebAsset Controller
RUN useradd -m -u 1001 nodeuser
USER nodeuser
```

### 2. Resource Limits

Prevent resource exhaustion:

```yaml
services:
  service-name:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 4G
        reservations:
          cpus: '1.0'
          memory: 2G
```

### 3. Read-Only Root Filesystem

Where possible:

```yaml
services:
  service-name:
    read_only: true
    tmpfs:
      - /tmp
      - /var/run
```

## Monitoring & Alerting

### 1. Log Aggregation

Forward logs to centralized system:

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### 2. Security Scanning

Regular vulnerability scanning:

```bash
# Run Trivy on all images
trivy image --severity HIGH,CRITICAL jumpserver/core:v3.10.0
trivy image --severity HIGH,CRITICAL ghcr.io/goauthentik/server:latest
```

### 3. Audit Logging

Enable audit logs in all services:

```yaml
environment:
  AUDIT_LOG_ENABLED: "true"
  AUDIT_LOG_LEVEL: "INFO"
  AUDIT_LOG_PATH: "/var/log/audit"
```

## Access Control

### 1. Role-Based Access Control (RBAC)

Define roles in JumpServer:

- **Administrators**: Full access to all systems
- **Operators**: Access to specific banking sites
- **Auditors**: Read-only access to logs and recordings
- **Users**: Access to assigned assets only

### 2. Principle of Least Privilege

Grant minimum required permissions:

```python
# In link_policies.py
policies = [
    {
        'name': 'Operations - Limited Access',
        'groups': ['Operations'],
        'assets': asset_ids[:10],  # Only first 10 sites
        'actions': ['connect']  # No upload/download
    }
]
```

## Incident Response

### 1. Monitoring

Set up alerts for:
- Failed authentication attempts (>5 in 5 minutes)
- Unusual access patterns
- Service downtime
- Resource exhaustion
- Certificate expiration

### 2. Backup Strategy

Implement 3-2-1 backup rule:
- 3 copies of data
- 2 different media types
- 1 copy offsite

```bash
# Automated backup script
0 2 * * * /opt/mcp-server/scripts/manage.sh backup
0 3 * * 0 rsync -avz /opt/mcp-server/backups/ remote-server:/backups/
```

### 3. Disaster Recovery

Document recovery procedures:

1. **Service Failure**: Restart with `manage.sh restart`
2. **Data Corruption**: Restore from backup with `manage.sh restore`
3. **Complete Failure**: Redeploy from Terraform
4. **Security Breach**: Isolate, investigate, rotate credentials

## Compliance

### 1. Data Retention

Configure retention policies:

```bash
# Session recordings: 90 days
# Audit logs: 1 year
# Backups: 30 days
```

### 2. Access Logs

Maintain comprehensive logs:

```yaml
environment:
  LOG_LEVEL: "INFO"
  ACCESS_LOG_ENABLED: "true"
  ACCESS_LOG_FORMAT: "json"
```

### 3. Periodic Reviews

Schedule regular reviews:

- [ ] Weekly: Review failed authentication attempts
- [ ] Monthly: Review user access and permissions
- [ ] Quarterly: Security audit and vulnerability scan
- [ ] Annually: Full security assessment

## Post-Deployment Hardening

### Immediate Actions (Day 1)

1. Change all default passwords
2. Configure MFA for all admin accounts
3. Restrict SSH access to specific IPs
4. Enable audit logging
5. Set up automated backups

### Week 1

1. Review all user permissions
2. Test disaster recovery procedures
3. Configure monitoring and alerting
4. Document security procedures
5. Train administrators

### Ongoing

1. Monthly vulnerability scans
2. Quarterly access reviews
3. Regular backup testing
4. Security patch management
5. Incident response drills

## Security Contacts

- **Security Team**: security@yourdomain.com
- **Infrastructure**: infrastructure@yourdomain.com
- **On-Call**: +1-xxx-xxx-xxxx

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CIS Docker Benchmark](https://www.cisecurity.org/benchmark/docker)
- [Tailscale Security](https://tailscale.com/security/)
- [Authentik Security](https://goauthentik.io/docs/security)

---

**Review this guide regularly and update as threats evolve.**

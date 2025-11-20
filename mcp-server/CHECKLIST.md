# MCP Server - Deployment Verification Checklist

Use this checklist to verify your MCP Server deployment is complete and functional.

---

## Pre-Deployment Checklist

### Prerequisites
- [ ] Docker 24.0+ installed
- [ ] Docker Compose installed  
- [ ] 16GB+ RAM available
- [ ] 100GB+ disk space available
- [ ] Domain name registered (for production)
- [ ] DNS configured (for production)
- [ ] Tailscale account created
- [ ] Tailscale auth key obtained

### Configuration Files
- [ ] Copied `.env.example` to `.env`
- [ ] Set `DOMAIN` in `.env`
- [ ] Set `ACME_EMAIL` in `.env`
- [ ] Generated `POSTGRES_PASSWORD` (40+ chars)
- [ ] Generated `AUTHENTIK_SECRET_KEY` (50+ chars)
- [ ] Generated `JUMPSERVER_SECRET_KEY` (40+ chars)
- [ ] Generated `INFISICAL_ENCRYPTION_KEY` (32 chars)
- [ ] Set `TS_AUTHKEY` from Tailscale
- [ ] File permissions set (`chmod 600 .env`)

---

## Deployment Checklist

### Service Startup
- [ ] Run `docker-compose up -d`
- [ ] Wait 2-3 minutes for services to start
- [ ] Run `docker-compose ps` - all services "Up"
- [ ] No services in "Restarting" state
- [ ] No error messages in `docker-compose logs`

### Service Health
- [ ] PostgreSQL responding: `docker exec mcp-postgresql pg_isready`
- [ ] Redis responding: `docker exec mcp-redis redis-cli ping`
- [ ] Authentik accessible: `curl -I http://localhost:9000`
- [ ] JumpServer accessible: `curl -I http://localhost:8080`
- [ ] Traefik dashboard accessible: `http://localhost:8081`

### Database Verification
- [ ] List databases: `docker exec mcp-postgresql psql -U postgres -c "\l"`
- [ ] Verify `authentik` database exists
- [ ] Verify `jumpserver` database exists
- [ ] Verify `infisical` database exists
- [ ] Verify `panel` database exists
- [ ] Verify `webasset` database exists

---

## Configuration Checklist

### Authentik Setup
- [ ] Access Authentik: `https://auth.yourdomain.com`
- [ ] Get bootstrap password from logs
- [ ] Login successful with `akadmin`
- [ ] Changed default password
- [ ] Created OIDC provider for JumpServer
- [ ] Created OIDC provider for Infisical
- [ ] Created OIDC provider for WebAsset Controller
- [ ] Created OIDC provider for 1Panel
- [ ] Created application for each provider
- [ ] Configured MFA policy
- [ ] Set MFA as mandatory
- [ ] Created user groups (6 groups)
- [ ] Tested SSO login

### JumpServer Setup
- [ ] Access JumpServer: `https://jump.yourdomain.com`
- [ ] Login with `admin/admin`
- [ ] Changed default password
- [ ] Configured OIDC authentication
- [ ] Tested SSO login
- [ ] Generated API key
- [ ] Added `JUMPSERVER_API_KEY` to `.env`
- [ ] Restarted services after .env update
- [ ] Enabled session recording
- [ ] Set video quality to High
- [ ] Configured retention policy

### Infisical Setup
- [ ] Access Infisical: `https://vault.yourdomain.com`
- [ ] Created admin account
- [ ] Created organization
- [ ] Created project: "Banking Credentials"
- [ ] Configured OIDC authentication
- [ ] Tested SSO login
- [ ] Added secret: `banking_bmg`
- [ ] Added secret: `banking_icred`
- [ ] Added remaining 23 banking secrets
- [ ] Generated service token
- [ ] Added `INFISICAL_SERVICE_TOKEN` to `.env`
- [ ] Restarted services after .env update

### WebAsset Controller
- [ ] Access WebAsset: `https://web.yourdomain.com`
- [ ] SSO redirect works
- [ ] Login successful
- [ ] MFA challenge presented
- [ ] Banking sites list displayed
- [ ] Selected test banking site
- [ ] Browser opened successfully
- [ ] Credentials auto-filled
- [ ] Site displayed in kiosk mode
- [ ] Session recorded in JumpServer

---

## Data Import Checklist

### User Import
- [ ] Set `JUMPSERVER_URL` environment variable
- [ ] Set `JUMPSERVER_API_KEY` environment variable
- [ ] Run `python3 jumpserver/scripts/import_users.py`
- [ ] Script completed successfully
- [ ] 50 users created (user01-user50)
- [ ] 2 admin users created
- [ ] 6 user groups created
- [ ] Users assigned to groups
- [ ] Verify in JumpServer UI: Users list

### Asset Import
- [ ] Run `python3 jumpserver/scripts/import_assets.py`
- [ ] Script completed successfully
- [ ] Domain "Banking Web Assets" created
- [ ] 25 banking sites created
- [ ] Assets have correct URLs
- [ ] Assets have correct protocols
- [ ] Verify in JumpServer UI: Assets list

### Policy Linking
- [ ] Run `python3 jumpserver/scripts/link_policies.py`
- [ ] Script completed successfully
- [ ] 6 permission policies created
- [ ] Operations group linked to 15 sites
- [ ] Finance group linked to 20 sites
- [ ] IT group linked to all sites
- [ ] Management group linked to all sites
- [ ] Support group linked to 10 sites
- [ ] Administrators linked to all sites
- [ ] Verify in JumpServer UI: Permissions list

---

## Security Checklist

### Credentials
- [ ] All default passwords changed
- [ ] Strong passwords used (12+ chars, mixed case, numbers, symbols)
- [ ] Passwords stored in secure password manager
- [ ] `.env` file has restricted permissions (600)
- [ ] No credentials committed to git

### Network Security
- [ ] Firewall configured (if applicable)
- [ ] Only ports 80/443 exposed publicly
- [ ] SSH restricted to specific IPs (production)
- [ ] Tailscale connected successfully
- [ ] Internal services not publicly accessible

### SSL/TLS
- [ ] HTTPS working for all services
- [ ] Certificates auto-generated
- [ ] No certificate errors in browser
- [ ] HSTS headers present
- [ ] Security headers configured

### Authentication
- [ ] SSO working for all services
- [ ] MFA enforced for all users
- [ ] Session timeouts configured
- [ ] Password policy enforced
- [ ] Account lockout after failed attempts

---

## Functional Testing Checklist

### End-to-End Test
- [ ] Open `https://web.yourdomain.com` in incognito
- [ ] Redirected to Authentik login
- [ ] Login with test user credentials
- [ ] MFA challenge presented
- [ ] Completed MFA successfully
- [ ] Redirected to WebAsset Controller
- [ ] Banking sites list displayed (25 sites)
- [ ] Click on test banking site
- [ ] New browser session opened
- [ ] Navigate to banking URL
- [ ] Credentials auto-filled from Infisical
- [ ] Login successful on banking site
- [ ] Site displayed in kiosk mode
- [ ] Work normally on site
- [ ] Close browser tab
- [ ] Session ended properly

### Session Recording Test
- [ ] Access JumpServer
- [ ] Navigate to Sessions
- [ ] Find test session in list
- [ ] Session has correct user
- [ ] Session has correct asset
- [ ] Session has start/end time
- [ ] Video recording available
- [ ] Play recording successfully
- [ ] Recording shows credential injection
- [ ] Recording shows banking site interaction

### Multi-User Test
- [ ] Login as User 1
- [ ] Access Banking Site A
- [ ] (In another browser) Login as User 2
- [ ] User 2 accesses Banking Site A
- [ ] Both users working simultaneously
- [ ] Sessions isolated from each other
- [ ] Both sessions recorded separately

---

## Operational Checklist

### Management Script
- [ ] Run `./scripts/manage.sh status` - all green
- [ ] Run `./scripts/manage.sh health` - all pass
- [ ] Run `./scripts/manage.sh logs` - no errors
- [ ] Run `./scripts/manage.sh backup` - backup created
- [ ] Verify backup file exists
- [ ] Run `./scripts/manage.sh urls` - shows all URLs
- [ ] Test stop: `./scripts/manage.sh stop`
- [ ] Test start: `./scripts/manage.sh start`
- [ ] Test restart: `./scripts/manage.sh restart`

### Monitoring
- [ ] Access Traefik dashboard
- [ ] All routes visible
- [ ] All services healthy
- [ ] Certificates valid
- [ ] Metrics available

### Logging
- [ ] Logs accessible via Docker
- [ ] Log rotation configured
- [ ] No error/warning spam
- [ ] Audit events being logged
- [ ] Session recordings being saved

---

## Production Readiness Checklist

### Performance
- [ ] Load test performed
- [ ] Response times acceptable (<2s)
- [ ] Resource usage monitored
- [ ] No memory leaks detected
- [ ] CPU usage normal (<80%)
- [ ] Disk space adequate (>50% free)

### Backup & Recovery
- [ ] Automated backup script configured
- [ ] Backup cron job scheduled
- [ ] Backup restoration tested
- [ ] Backup stored off-site
- [ ] Recovery time objective met (<1 hour)
- [ ] Recovery point objective met (<24 hours)

### Documentation
- [ ] Team trained on system usage
- [ ] Administrator guide reviewed
- [ ] Security procedures documented
- [ ] Incident response plan created
- [ ] Contact information updated
- [ ] Runbook created

### Compliance
- [ ] Session recordings enabled
- [ ] Audit logs enabled
- [ ] Data retention policy set
- [ ] Access reviews scheduled
- [ ] Security reviews scheduled
- [ ] Compliance requirements met

---

## Post-Deployment Checklist

### Week 1
- [ ] Daily monitoring established
- [ ] Any issues resolved
- [ ] User feedback collected
- [ ] Performance baselines recorded
- [ ] Documentation updated

### Month 1
- [ ] Security audit performed
- [ ] Vulnerability scan completed
- [ ] Backup restoration tested
- [ ] User access reviewed
- [ ] Metrics analyzed

### Quarterly
- [ ] Full security review
- [ ] Compliance audit
- [ ] Disaster recovery drill
- [ ] Capacity planning
- [ ] Updates and patches applied

---

## Troubleshooting Quick Reference

### Service Won't Start
```bash
docker-compose logs <service-name>
docker-compose restart <service-name>
./scripts/manage.sh health
```

### Can't Access Service
```bash
# Check DNS
nslookup auth.yourdomain.com

# Check Traefik routes
docker logs mcp-traefik

# Check firewall
sudo ufw status
```

### Authentication Fails
```bash
# Check Authentik
docker logs mcp-authentik-server

# Verify OIDC config
# Check redirect URIs match
# Verify client ID and secret
```

### Database Issues
```bash
# Check PostgreSQL
docker exec mcp-postgresql pg_isready -U postgres

# List databases
docker exec mcp-postgresql psql -U postgres -c "\l"

# Check connections
docker exec mcp-postgresql psql -U postgres -c "SELECT * FROM pg_stat_activity;"
```

---

## Sign-Off

Deployment completed by: _______________  
Date: _______________  
Verified by: _______________  
Date: _______________

Issues found: _______________

Resolution: _______________

---

**Status: [ ] PASSED [ ] FAILED [ ] PARTIAL**

**Ready for Production: [ ] YES [ ] NO**

---

*Keep this checklist for your records and future deployments.*

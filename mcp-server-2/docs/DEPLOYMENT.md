# MCP Server 2 - Deployment Guide

Complete step-by-step deployment instructions for MCP Server 2.

## Prerequisites

### 1. GCP Account Setup
- [ ] Active GCP account with billing enabled
- [ ] Project created or selected
- [ ] Billing account linked to project
- [ ] Required APIs enabled:
  - Compute Engine API
  - Cloud Resource Manager API
  - IAM API

### 2. Local Tools
Install the following tools on your local machine:

```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Install Terraform
wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
unzip terraform_1.6.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# Verify installations
gcloud --version
terraform --version
```

### 3. Tailscale Setup
- [ ] Create Tailscale account at https://tailscale.com
- [ ] Generate auth key:
  1. Go to https://login.tailscale.com/admin/settings/keys
  2. Click "Generate auth key"
  3. Enable "Reusable" and "Pre-authorized"
  4. Add tag: `tag:mcp-server`
  5. Copy the generated key

### 4. Domain Setup
- [ ] Domain name registered
- [ ] Access to DNS management
- [ ] Subdomains planned:
  - auth.yourdomain.com
  - kasm.yourdomain.com
  - vault.yourdomain.com
  - panel.yourdomain.com
  - web.yourdomain.com
  - traefik.yourdomain.com

## Phase 1: Infrastructure Deployment

### Step 1: Clone Repository
```bash
git clone https://github.com/infra-neo/desarollo.git
cd desarollo/mcp-server-2
```

### Step 2: Configure Terraform Variables
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your values:
```hcl
project_id = "your-gcp-project-id"
region     = "us-central1"
zone       = "us-central1-a"

domain     = "yourdomain.com"
acme_email = "admin@yourdomain.com"

tailscale_authkey = "tskey-auth-YOUR-KEY-HERE"

# Generate strong passwords
postgres_password        = "STRONG_RANDOM_PASSWORD_32_CHARS"
authentik_secret_key     = "STRONG_RANDOM_KEY_MIN_50_CHARACTERS"
kasm_admin_password      = "STRONG_RANDOM_PASSWORD"
infisical_encryption_key = "EXACTLY_32_CHARACTERS_RANDOM_KEY"
```

### Step 3: Authenticate with GCP
```bash
gcloud auth application-default login
gcloud config set project your-gcp-project-id
```

### Step 4: Deploy Infrastructure
```bash
# Initialize Terraform
terraform init

# Validate configuration
terraform validate

# Review plan
terraform plan

# Apply (will take 5-10 minutes)
terraform apply

# Save outputs
terraform output -json > outputs.json
```

### Step 5: Configure DNS
Get the static IP:
```bash
STATIC_IP=$(terraform output -raw static_ip)
echo "Static IP: $STATIC_IP"
```

Create DNS A records for all subdomains pointing to `$STATIC_IP`:
```
auth.yourdomain.com      A    YOUR_STATIC_IP
kasm.yourdomain.com      A    YOUR_STATIC_IP
vault.yourdomain.com     A    YOUR_STATIC_IP
panel.yourdomain.com     A    YOUR_STATIC_IP
web.yourdomain.com       A    YOUR_STATIC_IP
traefik.yourdomain.com   A    YOUR_STATIC_IP
```

Wait 5-10 minutes for DNS propagation and verify:
```bash
nslookup auth.yourdomain.com
nslookup kasm.yourdomain.com
```

## Phase 2: Service Deployment

### Step 6: Access the VM
```bash
# SSH to the instance
gcloud compute ssh mcp-server-2 --zone=us-central1-a --project=your-gcp-project-id

# Check startup script completion
tail -f /var/log/mcp-server-2-startup.log

# Verify Tailscale connection
sudo tailscale status
```

### Step 7: Deploy MCP Server 2 Stack
```bash
# Navigate to MCP directory
cd /opt/mcp-server-2

# Clone repository with configurations
sudo git clone https://github.com/infra-neo/desarollo.git temp
sudo cp -r temp/mcp-server-2/{docker-compose.yml,configs,scripts,webasset-controller} .
sudo rm -rf temp

# Verify .env file was created by startup script
cat .env

# Create required directories
sudo mkdir -p data/{postgres,redis,authentik,kasm,infisical,onepanel,traefik,tailscale,webasset}

# Set permissions
sudo chown -R 1000:1000 .

# Pull Docker images
sudo docker-compose pull

# Start services
sudo docker-compose up -d

# Check status
sudo docker-compose ps

# View logs
sudo docker-compose logs -f
```

### Step 8: Verify Services
```bash
# Check all containers are running
sudo docker ps

# Expected output: 11 running containers
# - postgres
# - redis
# - authentik-server
# - authentik-worker
# - kasm
# - infisical
# - onepanel
# - webasset-controller
# - traefik
# - tailscale

# Check health endpoints
curl -k https://localhost/health
```

## Phase 3: Service Configuration

### Step 9: Configure Authentik

1. Access Authentik at `https://auth.yourdomain.com`
2. Complete initial setup:
   - Admin username: `admin`
   - Admin password: (set your own)
   - Admin email: `admin@yourdomain.com`

3. Create OAuth2 Providers:

**For KasmWeb:**
```
Name: KasmWeb
Authorization Flow: default-authorization-flow
Client Type: Confidential
Client ID: kasmweb
Client Secret: (generate strong secret)
Redirect URIs: https://kasm.yourdomain.com/api/oidc_callback
```

**For Infisical:**
```
Name: Infisical
Client ID: infisical
Client Secret: (generate strong secret)
Redirect URIs: https://vault.yourdomain.com/api/v1/sso/oidc/callback
```

**For WebAsset Controller:**
```
Name: WebAsset Controller
Client ID: webasset-controller
Client Secret: (generate strong secret)
Redirect URIs: https://web.yourdomain.com/auth/callback
```

**For 1Panel:**
```
Name: 1Panel
Client ID: onepanel
Client Secret: (generate strong secret)
Redirect URIs: https://panel.yourdomain.com/api/v1/auth/callback
```

**For Traefik:**
```
Name: Traefik
Client ID: traefik
Client Secret: (generate strong secret)
Redirect URIs: https://traefik.yourdomain.com/
```

4. Configure MFA Policy:
   - Go to Flows & Stages
   - Create new stage: "MFA Validation"
   - Type: Authenticator Validation
   - Add to default authentication flow

5. Create Users or Enable User Registration

### Step 10: Configure KasmWeb

1. Access KasmWeb at `https://kasm.yourdomain.com`
2. Login with default credentials:
   - Username: `admin@kasm.local`
   - Password: (from .env KASM_ADMIN_PASSWORD)

3. Configure SSO:
   - Go to Admin → Authentication → SSO
   - Enable OIDC
   - Provider URL: `https://auth.yourdomain.com`
   - Client ID: `kasmweb`
   - Client Secret: (from Authentik)
   - Scope: `openid email profile`

4. Import Users:
```bash
cd /opt/mcp-server-2

# From Authentik
python3 scripts/import_users_kasm.py \
  --kasm-url https://kasm.yourdomain.com \
  --api-key YOUR_KASM_API_KEY \
  --api-secret YOUR_KASM_API_SECRET \
  --source authentik \
  --authentik-url https://auth.yourdomain.com \
  --authentik-token YOUR_AUTHENTIK_TOKEN
```

5. Create Banking Workspaces:
```bash
python3 scripts/create_workspaces.py \
  --kasm-url https://kasm.yourdomain.com \
  --api-key YOUR_KASM_API_KEY \
  --api-secret YOUR_KASM_API_SECRET \
  --config configs/webasset/banking_sites.yml
```

6. Enable Session Recording:
   - Go to Admin → Settings → Recording
   - Enable "Record All Sessions"
   - Recording Path: `/opt/kasm/current/recordings`
   - Format: MP4

### Step 11: Configure Infisical

1. Access Infisical at `https://vault.yourdomain.com`
2. Create initial account
3. Create Organization: "MCP Server 2"
4. Create Project: "Banking Credentials"
5. Configure SSO:
   - Go to Organization Settings → SSO
   - Enable OIDC
   - Issuer URL: `https://auth.yourdomain.com`
   - Client ID: `infisical`
   - Client Secret: (from Authentik)

6. Add Banking Secrets:
```
Environment: production
Path: /banking/

Secrets:
- bmg-user1: {username: "xxx", password: "xxx"}
- facta-user1: {username: "xxx", password: "xxx"}
- bbva-user1: {username: "xxx", password: "xxx"}
... (add for each banking site)
```

7. Generate API Token:
   - Go to Project Settings → API Keys
   - Create new key: "WebAsset Controller"
   - Save the token securely

8. Update WebAsset Controller:
```bash
# Update .env file
sudo nano /opt/mcp-server-2/.env

# Add Infisical token
WEBASSET_INFISICAL_TOKEN=your-infisical-token

# Restart service
sudo docker-compose restart webasset-controller
```

### Step 12: Configure 1Panel

1. Access 1Panel at `https://panel.yourdomain.com`
2. Complete initial setup
3. Configure SSO with Authentik
4. Add Docker connection: `unix:///var/run/docker.sock`

### Step 13: Configure WebAsset Controller

1. Access WebAsset at `https://web.yourdomain.com`
2. Login via Authentik SSO
3. Verify Admin Panel:
   - Check banking sites are loaded (26+ sites)
   - Verify database connection
   - Check Infisical integration
   - Check Kasm integration

4. Test Auto-Login:
   - Select a banking site (e.g., BMG)
   - Select credentials
   - Launch session
   - Verify auto-login works
   - Check session recording

## Phase 4: Testing and Validation

### Step 14: End-to-End Testing

1. **Authentication Test:**
```bash
# Test SSO login to each service
# Verify MFA is enforced
# Check user session persistence
```

2. **Banking Session Test:**
```bash
# Launch a banking session
# Verify auto-login works
# Check session is recorded
# Verify session metadata
# End session and check logs
```

3. **Multi-Session Test:**
```bash
# Launch multiple sessions simultaneously
# Verify session limits work
# Check resource usage
```

4. **Audit Test:**
```bash
# Review audit logs in WebAsset Controller
# Check KasmWeb recordings
# Verify all actions are logged
```

### Step 15: Performance Verification
```bash
# Check system resources
htop

# Check Docker stats
docker stats

# Check disk usage
df -h

# Check network connectivity
ping -c 4 google.com

# Check Tailscale
sudo tailscale status

# Check service health
curl https://web.yourdomain.com/health
```

## Phase 5: Backup and Monitoring

### Step 16: Configure Backups

1. **Database Backups:**
```bash
# Create backup script
sudo nano /opt/mcp-server-2/backup.sh

#!/bin/bash
BACKUP_DIR="/mnt/mcp-data/backups/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
docker exec mcp-postgres pg_dumpall -U mcpserver > $BACKUP_DIR/postgres.sql

# Backup Docker volumes
docker run --rm -v mcp-server-2_kasm_recordings:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/recordings.tar.gz /data

# Add to crontab
crontab -e
# Add: 0 2 * * * /opt/mcp-server-2/backup.sh
```

2. **GCP Disk Snapshots:**
```bash
# Enable automated snapshots in GCP Console
# Schedule: Daily at 2 AM
# Retention: 7 days
```

### Step 17: Set Up Monitoring

1. Access Traefik dashboard: `https://traefik.yourdomain.com`
2. Monitor service health and request rates
3. Set up alerts (optional):
   - Email notifications
   - Slack webhooks
   - PagerDuty integration

## Post-Deployment

### Security Hardening
- [ ] Review firewall rules
- [ ] Enable automatic security updates
- [ ] Configure fail2ban for SSH
- [ ] Set up log monitoring
- [ ] Review Authentik security policies
- [ ] Enable audit logging for all services

### Documentation
- [ ] Document admin credentials (securely)
- [ ] Create user guide
- [ ] Document backup procedures
- [ ] Create runbook for common tasks

### Training
- [ ] Train administrators on system management
- [ ] Train users on banking workflow
- [ ] Document emergency procedures

## Troubleshooting

### Common Issues

**DNS not resolving:**
```bash
# Check DNS propagation
dig auth.yourdomain.com
nslookup auth.yourdomain.com
```

**Containers not starting:**
```bash
# Check logs
sudo docker-compose logs service-name

# Check resources
sudo docker system df
free -h
```

**SSL certificate issues:**
```bash
# Check Traefik logs
sudo docker-compose logs traefik

# Verify DNS is correct
# Wait for Let's Encrypt rate limits to reset
```

**Tailscale not connecting:**
```bash
# Check status
sudo tailscale status

# Re-authenticate
sudo tailscale up --authkey=your-key
```

## Support

For issues or questions:
1. Check logs: `sudo docker-compose logs -f`
2. Review documentation in `/docs`
3. Open issue on GitHub
4. Contact support team

## Next Steps

- Review [SECURITY.md](./SECURITY.md) for security best practices
- Read [USER_MANUAL.md](./USER_MANUAL.md) for user workflows
- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
- Monitor system health regularly

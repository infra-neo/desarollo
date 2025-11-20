# MCP Server - Quick Deployment Guide

## Prerequisites Checklist

- [ ] Docker 24.0+ installed
- [ ] Docker Compose installed
- [ ] 16GB+ RAM available
- [ ] 100GB+ disk space
- [ ] Domain name configured
- [ ] Tailscale account created
- [ ] (GCP only) GCP account with billing enabled

---

## 5-Minute Local Setup

### 1. Clone and Navigate
```bash
git clone https://github.com/infra-neo/desarollo.git
cd desarollo/mcp-server/docker-compose
```

### 2. Configure Environment
```bash
# Copy template
cp .env.example .env

# Generate secure keys
echo "AUTHENTIK_SECRET_KEY=$(openssl rand -base64 60)" >> .env
echo "JUMPSERVER_SECRET_KEY=$(openssl rand -base64 40)" >> .env
echo "INFISICAL_ENCRYPTION_KEY=$(openssl rand -base64 32 | cut -c1-32)" >> .env

# Edit domain (use localhost for testing)
nano .env
# Change DOMAIN=localhost
```

### 3. Start Services
```bash
docker-compose up -d
```

### 4. Wait for Services (2-3 minutes)
```bash
# Watch logs
docker-compose logs -f

# Or check status
docker-compose ps
```

### 5. Access Services

| Service | URL | Default Credentials |
|---------|-----|---------------------|
| Authentik | http://localhost:9000 | akadmin / (check logs) |
| JumpServer | http://localhost:8080 | admin / admin |
| Traefik | http://localhost:8081 | N/A (dashboard) |

---

## Production GCP Deployment

### 1. Prepare Terraform

```bash
cd mcp-server/terraform-gcp

# Copy and edit variables
cp terraform.tfvars.example terraform.tfvars
nano terraform.tfvars
```

Required variables:
- `project_id`: Your GCP project ID
- `domain`: Your domain name
- `tailscale_auth_key`: From Tailscale admin
- `authentik_secret_key`: Generate with `openssl rand -base64 60`

### 2. Initialize and Deploy

```bash
# Authenticate with GCP
gcloud auth application-default login

# Initialize Terraform
terraform init

# Review plan
terraform plan

# Deploy (takes 5-10 minutes)
terraform apply
```

### 3. Configure DNS

Point your domain's DNS to the IP shown in Terraform output:

```
*.yourdomain.com → <instance_external_ip>
```

### 4. SSH and Configure

```bash
# SSH to instance (from Terraform output)
ssh ubuntu@<instance_external_ip>

# Navigate to MCP directory
cd /opt/mcp-server/docker-compose

# Configure environment
nano .env

# Start services
docker-compose up -d

# Run initialization
cd ../scripts
./init.sh
```

---

## Post-Deployment Configuration

### 1. Authentik Setup (5 minutes)

```bash
# Get bootstrap password
docker logs mcp-authentik-server 2>&1 | grep "Bootstrap"

# Access https://auth.yourdomain.com
# Login and change password
# Create OIDC providers for each service
```

See [docs/CONFIGURATION.md](docs/CONFIGURATION.md) for detailed OIDC setup.

### 2. JumpServer Setup (5 minutes)

```bash
# Access https://jump.yourdomain.com
# Login admin/admin and change password
# Generate API key in Profile → API Keys
# Add to .env as JUMPSERVER_API_KEY
```

### 3. Import Data (2 minutes)

```bash
cd /opt/mcp-server
export JUMPSERVER_URL=http://localhost:8080
export JUMPSERVER_API_KEY=your-key

# Import 50 users
python3 jumpserver/scripts/import_users.py

# Import 25 banking sites
python3 jumpserver/scripts/import_assets.py

# Link policies
python3 jumpserver/scripts/link_policies.py
```

### 4. Infisical Setup (5 minutes)

```bash
# Access https://vault.yourdomain.com
# Create organization and project
# Add secrets for banking sites
# Generate service token
# Add to .env as INFISICAL_SERVICE_TOKEN
```

### 5. Restart Services

```bash
cd /opt/mcp-server/docker-compose
docker-compose restart
```

---

## Quick Test

1. Open browser: `https://web.yourdomain.com`
2. Login with SSO
3. Complete MFA
4. Select banking site
5. Verify credentials auto-fill
6. Check session recording in JumpServer

---

## Troubleshooting

### Services not starting
```bash
# Check logs
docker-compose logs

# Check resources
docker stats

# Restart specific service
docker-compose restart <service-name>
```

### Can't access services
```bash
# Check Traefik routes
docker logs mcp-traefik

# Verify DNS
nslookup auth.yourdomain.com

# Check firewall
sudo ufw status
```

### PostgreSQL connection errors
```bash
# Verify PostgreSQL is ready
docker exec mcp-postgresql pg_isready -U postgres

# Check database creation
docker exec mcp-postgresql psql -U postgres -c "\l"
```

---

## Quick Commands Reference

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Restart service
docker-compose restart [service-name]

# Check status
docker-compose ps

# Update images
docker-compose pull && docker-compose up -d

# Backup database
docker exec mcp-postgresql pg_dumpall -U postgres > backup.sql

# Restore database
docker exec -i mcp-postgresql psql -U postgres < backup.sql
```

---

## Getting Help

- **Documentation**: See README.md and docs/CONFIGURATION.md
- **Logs**: `docker-compose logs -f`
- **GitHub Issues**: https://github.com/infra-neo/desarollo/issues
- **Architecture**: See diagrams/ARCHITECTURE.md

---

## Time Estimates

| Task | Time |
|------|------|
| Local setup | 5 minutes |
| GCP deployment | 10 minutes |
| Service configuration | 20 minutes |
| Data import | 5 minutes |
| Testing | 10 minutes |
| **Total** | **~50 minutes** |

---

**Ready to deploy? Start with the Local Setup above! 🚀**

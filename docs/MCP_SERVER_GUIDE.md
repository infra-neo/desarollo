# MCP Server Infrastructure - Complete Guide

**Author:** Ing. Benjamín Frías — DevOps & Cloud Specialist  
**Version:** 1.0.0  
**Last Updated:** 2025-11-16

---

## Overview

This repository implements a complete MCP (Model Context Protocol) Server infrastructure designed for GitHub Copilot Agents, featuring comprehensive banking automation with enterprise-grade security.

## Architecture

### Components

1. **Traefik Reverse Proxy** - SSL termination, load balancing, auto-discovery
2. **Authentik** - Identity Provider (OIDC/SAML/LDAP)
3. **PostgreSQL** - Unified database for all services
4. **Redis** - Caching layer
5. **Infisical** - Secrets management
6. **JumpServer** - Session recording and audit
7. **1Panel** - Server administration
8. **WebAsset Controller** - Banking automation with Playwright
9. **Tailscale** - Zero-trust VPN with MagicDNS

### Network Architecture

```
Internet (Users)
    ↓
[Tailscale VPN] (Optional secure access)
    ↓
[Traefik] :443 (SSL/TLS Termination)
    ↓
[Authentik] (SSO Authentication)
    ↓
    ├─→ [Infisical] (Secrets)
    ├─→ [JumpServer] (Audit)
    ├─→ [1Panel] (Admin)
    └─→ [WebAsset Controller]
            ↓
        [Playwright Browser]
            ↓
        Banking Sites (BMG, iCred, etc.)

Backend Network:
    ├─→ [Redis] (Cache)
    └─→ [PostgreSQL] (Database)
        ├─ authentik DB
        ├─ jumpserver DB
        ├─ infisical DB
        ├─ onepanel DB
        └─ webasset DB
```

## Quick Start

### Prerequisites

- GCP account with billing enabled
- Terraform >= 1.6.0
- Docker Swarm cluster
- Domain name for SSL certificates
- GitHub account for CI/CD

### 1. Infrastructure Deployment

```bash
# Clone repository
git clone https://github.com/infra-neo/desarollo.git
cd desarollo

# Analyze current Terraform structure
./scripts/analyze_terraform_structure.sh

# Review generated structure
cat terraform_structure.md

# Configure Terraform
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

# Initialize Terraform
terraform init

# Plan deployment
terraform plan -out=tfplan

# Apply infrastructure
terraform apply tfplan
```

### 2. Docker Swarm Deployment

```bash
# Set environment variables
export DOMAIN="your-domain.com"
export ACME_EMAIL="admin@your-domain.com"
export POSTGRES_HOST="<postgres-ip>"
export AUTHENTIK_SECRET_KEY="$(openssl rand -base64 32)"
export INFISICAL_ENCRYPTION_KEY="$(openssl rand -base64 32)"
export INFISICAL_AUTH_SECRET="$(openssl rand -base64 32)"
export JUMPSERVER_SECRET_KEY="$(openssl rand -base64 32)"
export JUMPSERVER_BOOTSTRAP_TOKEN="$(openssl rand -base64 32)"

# Deploy the stack
docker stack deploy -c docker-compose.stack.yml mcp-server

# Check deployment
docker stack services mcp-server
```

### 3. Initial Configuration

#### Authentik Setup

1. Access: `https://auth.your-domain.com`
2. Initial login: `akadmin` / (check logs for password)
3. Configure applications:
   - WebAsset Controller (OIDC)
   - JumpServer (OIDC)
   - Infisical (OIDC)
   - 1Panel (OIDC)

#### Infisical Setup

1. Access: `https://secrets.your-domain.com`
2. Create organization
3. Create project: "Banking Credentials"
4. Add secrets:
   ```
   /banking/bmg/master-credentials
     - username: <bmg-username>
     - password: <bmg-password>
   
   /banking/icred/master-credentials
     - email: <icred-email>
     - password: <icred-password>
   ```

#### JumpServer Setup

1. Access: `https://jump.your-domain.com`
2. Configure OIDC with Authentik
3. Set up asset management
4. Configure session recording

## WebAsset Controller

### Features

- **SSO Authentication**: Seamless integration with Authentik
- **Multi-Banking Support**: BMG Consig, iCred API, and custom sites
- **Automated Login**: Playwright-based browser automation
- **Session Recording**: Every session is recorded for audit
- **Kiosk Mode**: Full-screen locked-down experience
- **Role-Based Access**: Different credentials based on user groups

### API Endpoints

```bash
# Start a banking session
curl -X POST https://webasset.your-domain.com/api/session/start \
  -H "Cookie: auth_session=..." \
  -H "Content-Type: application/json" \
  -d '{
    "asset": "bmg"
  }'

# Get session status
curl https://webasset.your-domain.com/api/session/{sessionId}/status \
  -H "Cookie: auth_session=..."

# Stop session
curl -X POST https://webasset.your-domain.com/api/session/{sessionId}/stop \
  -H "Cookie: auth_session=..."

# Get available assets
curl https://webasset.your-domain.com/api/assets \
  -H "Cookie: auth_session=..."

# Get audit logs
curl https://webasset.your-domain.com/api/audit \
  -H "Cookie: auth_session=..."
```

## Security

### Authentication Flow

1. User accesses WebAsset Controller
2. Traefik forwards to Authentik for authentication
3. User logs in with SSO
4. Authentik issues OIDC token
5. WebAsset Controller validates token
6. User is granted access based on group membership

### Secrets Management

- All banking credentials stored in Infisical
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Role-based access control
- Automatic credential rotation

### Network Security

- **Public Subnet**: Only Traefik exposed on port 443
- **Private Subnet**: All application services
- **Database Subnet**: PostgreSQL isolated
- **VPC Firewall**: Restrictive rules
- **Tailscale**: Optional zero-trust access

### Audit and Compliance

- All sessions recorded by JumpServer
- Audit logs in PostgreSQL
- User activity tracking
- Access logs
- Session metadata

## Credential Rotation

```bash
# Rotate BMG credentials
./scripts/rotate_credentials.sh bmg

# Rotate iCred credentials
./scripts/rotate_credentials.sh icred

# Rotate all credentials
./scripts/rotate_credentials.sh all
```

## Monitoring and Observability

### Metrics

- Traefik: Prometheus metrics
- PostgreSQL: pg_stat_statements
- Application: Custom metrics

### Logs

- Centralized in JumpServer
- Application logs in PostgreSQL
- System logs via syslog

### Dashboards

- Traefik: `https://traefik.your-domain.com/dashboard/`
- JumpServer: `https://jump.your-domain.com`
- 1Panel: `https://panel.your-domain.com`

## CI/CD

### GitHub Actions Workflows

1. **terraform-lint.yml** - Terraform validation and security scanning
2. **infrastructure.yml** - Infrastructure deployment
3. **webasset-build.yml** - WebAsset Controller build and test
4. **deploy.yml** - Application deployment

### Deployment Process

1. Push to main branch
2. Linting and validation
3. Terraform plan
4. Manual approval (for apply)
5. Terraform apply
6. Docker build
7. Docker push
8. Deploy to Swarm
9. E2E tests
10. Notification

## Brainboard Integration

```bash
# Generate architecture diagram
python3 scripts/generate_brainboard.py

# Import into Brainboard
# File: brainboard/architecture_brainboard.json
```

The generated diagram includes:
- All components
- Network relationships
- Security zones
- Firewall rules
- Data flow

## Terraform Modules

### Available Modules

1. **compute** - GCP compute instances
2. **network** - VPC, subnets, static IPs
3. **firewall** - Firewall rules
4. **postgresql** - Cloud SQL PostgreSQL with multiple databases

### Module Usage Example

```hcl
module "postgresql" {
  source = "./modules/postgresql"
  
  project_id       = var.project_id
  region           = var.region
  instance_name    = "desarollo-postgres"
  vpc_network_id   = module.network.vpc_network_id
  
  # Database credentials automatically generated
}
```

## Troubleshooting

### Common Issues

#### Traefik not routing correctly

```bash
# Check Traefik logs
docker service logs mcp-server_traefik

# Verify labels
docker service inspect mcp-server_authentik --format '{{json .Spec.Labels}}'
```

#### WebAsset Controller can't connect to Infisical

```bash
# Check network connectivity
docker exec $(docker ps -q -f name=webasset) ping infisical

# Verify environment variables
docker service inspect mcp-server_webasset-controller --format '{{json .Spec.TaskTemplate.ContainerSpec.Env}}'
```

#### Database connection issues

```bash
# Check PostgreSQL status
gcloud sql instances describe desarollo-postgres

# Test connection
psql "postgresql://user:pass@<postgres-ip>:5432/database"
```

## Performance Tuning

### WebAsset Controller

- **Replicas**: Adjust based on concurrent users
- **CPU/Memory**: 2 CPU, 2GB RAM per replica
- **Browser instances**: One per session

### PostgreSQL

- **Tier**: Start with db-g1-small, scale up as needed
- **Connection pooling**: Use PgBouncer for large deployments
- **Backups**: Automated daily backups with 7-day retention

### Redis

- **Persistence**: RDB snapshots every 60 seconds
- **Memory**: Monitor and adjust based on usage

## Maintenance

### Regular Tasks

- [ ] Weekly: Review audit logs
- [ ] Monthly: Rotate credentials
- [ ] Monthly: Update dependencies
- [ ] Quarterly: Security audit
- [ ] Quarterly: Disaster recovery test

### Backup Strategy

- **PostgreSQL**: Automated daily backups
- **Secrets**: Export from Infisical weekly
- **Recordings**: Archive to GCS monthly
- **Terraform State**: Remote state in GCS

## Support

### Documentation

- Terraform: `terraform_structure.md`
- WebAsset: `webasset-controller/README.md`
- Architecture: `brainboard/architecture_brainboard.json`

### Contact

For issues or questions, contact:  
**Ing. Benjamín Frías**  
DevOps & Cloud Specialist

---

## License

MIT License - See LICENSE file for details

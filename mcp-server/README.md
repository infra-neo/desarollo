# MCP Server - Complete Architecture Documentation

## Overview

The MCP Server is a comprehensive, production-ready platform for managing 50 users accessing 25 banking websites with automated credential injection, session recording, and full audit capabilities.

## Architecture

### Components

1. **Authentik** - SSO & MFA Provider
2. **Tailscale** - Secure networking with MagicDNS
3. **Traefik** - Reverse proxy with automatic HTTPS
4. **JumpServer** - Web asset management and session recording
5. **Infisical** - Centralized secrets management
6. **WebAsset Controller** - Custom credential injection service
7. **1Panel** - Admin panel for Docker management
8. **PostgreSQL** - Single database instance with multiple databases

### Network Architecture

```
Internet
    │
    ▼
Traefik (80/443)
    │
    ├─► Authentik (SSO/MFA) :9000
    ├─► JumpServer :8080
    ├─► Infisical :8080
    ├─► WebAsset Controller :3000
    ├─► 1Panel :8080
    └─► Tailscale (Secure Network)
         │
         └─► Internal Services
              ├─► PostgreSQL :5432
              └─► Redis :6379
```

## Features

### Security
- ✅ Zero Trust with Tailscale
- ✅ SSO with Authentik (OIDC)
- ✅ Mandatory MFA for all users
- ✅ HTTPS everywhere with automatic certificates
- ✅ ForwardAuth middleware for service protection
- ✅ Session recording and auditing
- ✅ Secrets management with Infisical
- ✅ No exposed ports except 80/443

### User Management
- ✅ 50+ users with role-based access
- ✅ Group-based permissions
- ✅ Automated user provisioning
- ✅ SSO across all services

### Asset Management
- ✅ 25 banking websites pre-configured
- ✅ Automated credential injection
- ✅ Session isolation per user
- ✅ Multi-session support (multiple users to same site)
- ✅ Kiosk mode rendering
- ✅ Full session recording

### Auditing
- ✅ Video recording of all sessions
- ✅ Event logging
- ✅ User activity tracking
- ✅ Access logs per bank per user
- ✅ Persistent storage of recordings

## Prerequisites

- Docker 24.0+ with Docker Compose
- 4 CPU cores minimum (8 recommended)
- 16GB RAM minimum (32GB recommended)
- 100GB disk space
- Ubuntu 22.04 LTS (or similar Linux)
- Domain name with DNS configured
- Tailscale account and auth key
- GCP account (for cloud deployment)

## Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/infra-neo/desarollo.git
   cd desarollo/mcp-server
   ```

2. **Configure environment**
   ```bash
   cd docker-compose
   cp .env.example .env
   # Edit .env with your configuration
   nano .env
   ```

3. **Start services**
   ```bash
   docker-compose up -d
   ```

4. **Initialize the system**
   ```bash
   cd ../scripts
   ./init.sh
   ```

5. **Access services**
   - Authentik: https://auth.yourdomain.com
   - JumpServer: https://jump.yourdomain.com
   - Infisical: https://vault.yourdomain.com
   - WebAsset: https://web.yourdomain.com
   - 1Panel: https://panel.yourdomain.com

### GCP Deployment

1. **Configure Terraform**
   ```bash
   cd terraform-gcp
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your GCP configuration
   nano terraform.tfvars
   ```

2. **Initialize Terraform**
   ```bash
   terraform init
   ```

3. **Plan deployment**
   ```bash
   terraform plan
   ```

4. **Deploy infrastructure**
   ```bash
   terraform apply
   ```

5. **SSH to instance and configure**
   ```bash
   ssh ubuntu@<instance-ip>
   cd /opt/mcp-server/docker-compose
   nano .env  # Configure services
   docker-compose up -d
   cd ../scripts
   ./init.sh
   ```

## Configuration

### 1. Authentik Setup

1. Access Authentik at `https://auth.yourdomain.com`
2. Default credentials: `akadmin` / check logs for bootstrap password
3. Create OIDC providers for each service:

#### JumpServer OIDC Provider
- Name: `jumpserver`
- Redirect URIs: `https://jump.yourdomain.com/core/auth/openid/callback`
- Client ID: Copy to `.env` as `JUMPSERVER_OIDC_CLIENT_ID`
- Client Secret: Copy to `.env` as `JUMPSERVER_OIDC_CLIENT_SECRET`

#### Infisical OIDC Provider
- Name: `infisical`
- Redirect URIs: `https://vault.yourdomain.com/api/v1/auth/oidc/callback`
- Client ID: Copy to `.env` as `INFISICAL_OIDC_CLIENT_ID`
- Client Secret: Copy to `.env` as `INFISICAL_OIDC_CLIENT_SECRET`

#### WebAsset Controller OIDC Provider
- Name: `webasset`
- Redirect URIs: `https://web.yourdomain.com/auth/callback`
- Client ID: Copy to `.env` as `WEBASSET_OIDC_CLIENT_ID`
- Client Secret: Copy to `.env` as `WEBASSET_OIDC_CLIENT_SECRET`

#### 1Panel OIDC Provider
- Name: `1panel`
- Redirect URIs: `https://panel.yourdomain.com/auth/callback`
- Client ID: Copy to `.env` as `PANEL_OIDC_CLIENT_ID`
- Client Secret: Copy to `.env` as `PANEL_OIDC_CLIENT_SECRET`

4. Enable MFA policies:
   - Go to Policies → Create → MFA Policy
   - Name: `Mandatory MFA`
   - Set as default
   - Save

### 2. JumpServer Setup

1. Access JumpServer at `https://jump.yourdomain.com`
2. Default credentials: `admin` / `admin` (change immediately)
3. Go to Settings → System → API
4. Generate API key
5. Add to `.env` as `JUMPSERVER_API_KEY`

### 3. Infisical Setup

1. Access Infisical at `https://vault.yourdomain.com`
2. Create organization and project
3. Add secrets for each banking site:
   - Secret name: `banking_bmg`
   - Username: master username
   - Password: master password
4. Generate service token
5. Add to `.env` as `INFISICAL_SERVICE_TOKEN`

### 4. Import Data

After configuration, run the import scripts:

```bash
cd mcp-server/scripts
export JUMPSERVER_URL=http://localhost:8080
export JUMPSERVER_API_KEY=your-api-key

# Import users
python3 ../jumpserver/scripts/import_users.py

# Import banking assets
python3 ../jumpserver/scripts/import_assets.py

# Link policies
python3 ../jumpserver/scripts/link_policies.py
```

## Usage

### For End Users

1. Navigate to `https://web.yourdomain.com`
2. Login with SSO credentials
3. Complete MFA challenge
4. Select banking site from list
5. Session opens automatically with credentials filled
6. Work normally - all actions are recorded
7. Close browser tab to end session

### For Administrators

1. Access 1Panel: `https://panel.yourdomain.com`
2. Manage Docker containers
3. View logs and metrics
4. Access JumpServer for:
   - User management
   - Asset management
   - Session recordings
   - Audit reports

### Session Recording

All web sessions are recorded and stored in:
- Container: `mcp-jumpserver-core`
- Path: `/opt/jumpserver/data/media/replay/`
- Access via JumpServer UI: Sessions → Recordings

## Monitoring and Logs

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f authentik-server
docker-compose logs -f jumpserver-core
docker-compose logs -f webasset-controller
```

### Health Checks
```bash
# Check all services
docker-compose ps

# Health endpoint
curl http://localhost:8080/api/health/
```

## Maintenance

### Backup

```bash
# Backup PostgreSQL
docker exec mcp-postgresql pg_dumpall -U postgres > backup.sql

# Backup volumes
docker run --rm -v postgresql_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/postgresql_data.tar.gz /data
```

### Update

```bash
# Pull latest images
docker-compose pull

# Restart services
docker-compose down
docker-compose up -d
```

### Scale

To handle more users or sites, adjust resources in `docker-compose.yml`:

```yaml
deploy:
  resources:
    limits:
      cpus: '2.0'
      memory: 4G
```

## Troubleshooting

### Services won't start
1. Check logs: `docker-compose logs`
2. Verify .env configuration
3. Ensure PostgreSQL is healthy: `docker exec mcp-postgresql pg_isready`

### SSO not working
1. Verify OIDC configuration in Authentik
2. Check redirect URIs match exactly
3. Restart affected services: `docker-compose restart`

### Credentials not injecting
1. Verify Infisical secrets exist
2. Check WebAsset Controller logs
3. Verify site selectors in `webasset-controller/src/index.js`

### Sessions not recording
1. Check JumpServer Chen component status
2. Verify recording path has permissions
3. Check disk space

## Security Considerations

1. **Change all default passwords** in `.env`
2. **Restrict SSH access** in GCP firewall to specific IPs
3. **Enable audit logging** in all services
4. **Regular backups** of PostgreSQL and volumes
5. **Monitor failed authentication attempts**
6. **Review session recordings** periodically
7. **Update containers** regularly for security patches
8. **Use strong secrets** (50+ characters for keys)

## Performance Tuning

### PostgreSQL
```ini
# Add to postgresql.conf
shared_buffers = 2GB
effective_cache_size = 8GB
max_connections = 200
```

### Browser Sessions
Limit concurrent browser sessions in WebAsset Controller:
```javascript
const MAX_SESSIONS = 50;
```

## Support

For issues, questions, or contributions:
- GitHub Issues: https://github.com/infra-neo/desarollo/issues
- Documentation: https://github.com/infra-neo/desarollo/wiki
- Email: support@example.com

## License

MIT License - See LICENSE file for details

## Credits

Developed by Ing. Benjamín Frías
DevOps & Cloud Specialist

---

**Note**: This is a production-ready system. Ensure proper security hardening before deploying to production environments.

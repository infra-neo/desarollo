# MCP Server 2 - KasmWeb Architecture

Complete infrastructure for secure banking operations with remote browser sessions, automated login, and comprehensive auditing.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Components](#components)
- [Features](#features)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Deployment](#deployment)
- [Configuration](#configuration)
- [Security](#security)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

MCP Server 2 is a comprehensive banking operations platform that provides:

- **Secure Remote Sessions**: Isolated browser workspaces via KasmWeb
- **Auto-Login**: Automated credential injection for banking sites
- **Zero Trust Access**: Tailscale VPN with MagicDNS
- **SSO & MFA**: Authentik identity provider integration
- **Secret Management**: Infisical for secure credential storage
- **Session Recording**: Full audit trails of all banking operations
- **Multi-User Support**: Up to 50 users, 25 concurrent sessions

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Internet                                │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  Traefik (Reverse Proxy)│
        │  - TLS Termination      │
        │  - ForwardAuth          │
        └────────────┬────────────┘
                     │
     ┌───────────────┼───────────────┐
     │               │               │
     ▼               ▼               ▼
┌─────────┐   ┌──────────┐   ┌───────────┐
│Authentik│   │  KasmWeb │   │ Infisical │
│  (SSO)  │   │(Sessions)│   │ (Secrets) │
└─────────┘   └──────────┘   └───────────┘
     │               │               │
     └───────────────┼───────────────┘
                     │
              ┌──────▼───────┐
              │  WebAsset    │
              │  Controller  │
              │  (Auto-Login)│
              └──────────────┘
                     │
              ┌──────▼───────┐
              │  PostgreSQL  │
              │  (Database)  │
              └──────────────┘
```

### Network Architecture

- **External Access**: Only ports 80/443 exposed via Traefik
- **Internal Network**: Docker bridge network (172.20.0.0/16)
- **Isolated Network**: Banking workspaces (172.21.0.0/16)
- **VPN Access**: Tailscale for administrative access

## 🔧 Components

### 1. Authentik
- **Purpose**: SSO and Identity Provider
- **Features**:
  - OIDC/OAuth2 provider
  - Multi-factor authentication (MFA)
  - User and group management
  - Integration with all services
- **URL**: `https://auth.your-domain.com`

### 2. KasmWeb
- **Purpose**: Remote browser sessions
- **Features**:
  - Isolated browser workspaces
  - HTML5 streaming (no client needed)
  - Session recording
  - Pre-configured banking workspaces
- **URL**: `https://kasm.your-domain.com`

### 3. WebAsset Controller
- **Purpose**: Banking site automation
- **Features**:
  - Automated credential injection
  - Multi-site support (26+ banking sites)
  - Session management
  - Audit logging
- **URL**: `https://web.your-domain.com`

### 4. Infisical
- **Purpose**: Secret management
- **Features**:
  - Encrypted credential storage
  - API-based secret retrieval
  - Audit trail
  - Secret rotation support
- **URL**: `https://vault.your-domain.com`

### 5. 1Panel
- **Purpose**: Server management
- **Features**:
  - Docker container management
  - System monitoring
  - Log viewing
  - Resource management
- **URL**: `https://panel.your-domain.com`

### 6. Traefik
- **Purpose**: Reverse proxy and load balancer
- **Features**:
  - Automatic TLS with Let's Encrypt
  - ForwardAuth integration with Authentik
  - Request routing
  - Dashboard
- **URL**: `https://traefik.your-domain.com`

### 7. Tailscale
- **Purpose**: Zero-trust VPN
- **Features**:
  - MagicDNS for service discovery
  - Encrypted mesh network
  - Access control lists
  - No exposed ports needed

### 8. PostgreSQL
- **Purpose**: Central database
- **Databases**:
  - `authentik`: Authentik data
  - `kasm`: KasmWeb data
  - `infisical`: Secret metadata
  - `onepanel`: 1Panel data
  - `webasset`: Banking sessions and audit logs

## ✨ Features

### Security
- ✅ Zero-trust network architecture
- ✅ End-to-end encryption
- ✅ MFA enforcement
- ✅ Session isolation
- ✅ Audit logging
- ✅ Secret rotation
- ✅ Non-root containers

### Banking Operations
- ✅ 26+ supported banking sites (BMG, FACTA, BBVA, Santander, etc.)
- ✅ Automated credential injection
- ✅ Multiple concurrent sessions per user
- ✅ Session recording for compliance
- ✅ Real-time monitoring
- ✅ Session metadata injection

### User Management
- ✅ SSO via Authentik
- ✅ CSV or Authentik user import
- ✅ Role-based access control
- ✅ Session limits per user
- ✅ Activity tracking

### Auditing
- ✅ Full session recordings
- ✅ Login/logout tracking
- ✅ Banking site access logs
- ✅ Failed login attempts
- ✅ 90-day retention (configurable)

## 📋 Requirements

### Infrastructure
- GCP Project with billing enabled
- Domain name with DNS control
- Terraform >= 1.0
- Tailscale account and auth key

### Machine Requirements
- **Minimum**: e2-standard-4 (4 vCPUs, 16GB RAM)
- **Recommended**: n1-standard-4 (4 vCPUs, 15GB RAM)
- **Storage**: 
  - 100GB boot disk
  - 200GB data disk
  - 500GB recordings disk

### Local Requirements
- Terraform CLI
- gcloud CLI
- Git

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/infra-neo/desarollo.git
cd desarollo/mcp-server-2
```

### 2. Configure Terraform
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
vim terraform.tfvars
```

### 3. Deploy Infrastructure
```bash
# Initialize Terraform
terraform init

# Review plan
terraform plan

# Apply configuration
terraform apply
```

### 4. Configure DNS
Point your domain's DNS records to the static IP output by Terraform:
```bash
# Get the static IP
terraform output static_ip

# Create DNS A records:
# auth.your-domain.com -> STATIC_IP
# kasm.your-domain.com -> STATIC_IP
# vault.your-domain.com -> STATIC_IP
# panel.your-domain.com -> STATIC_IP
# web.your-domain.com -> STATIC_IP
# traefik.your-domain.com -> STATIC_IP
```

### 5. Deploy Services
```bash
# SSH to the instance
gcloud compute ssh mcp-server-2 --zone=us-central1-a

# Copy configuration files
cd /opt/mcp-server-2
sudo git clone https://github.com/infra-neo/desarollo.git temp
sudo cp -r temp/mcp-server-2/* .
sudo rm -rf temp

# Start services
sudo systemctl start mcp-server-2

# Check status
sudo docker ps
sudo docker-compose logs -f
```

### 6. Initial Setup

#### Configure Authentik
1. Access `https://auth.your-domain.com`
2. Complete initial setup wizard
3. Create OAuth2 providers for each service
4. Configure MFA policies

#### Configure KasmWeb
1. Access `https://kasm.your-domain.com`
2. Login with admin credentials
3. Configure SSO with Authentik
4. Import users: `python3 /opt/mcp-server-2/scripts/import_users_kasm.py`
5. Create workspaces: `python3 /opt/mcp-server-2/scripts/create_workspaces.py`

#### Configure Infisical
1. Access `https://vault.your-domain.com`
2. Create organization
3. Create project for banking credentials
4. Add secrets for each banking site

#### Configure WebAsset Controller
1. Access `https://web.your-domain.com`
2. Login via Authentik
3. Verify banking sites are loaded
4. Test auto-login with one site

## 📖 Deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment instructions.

## ⚙️ Configuration

See [CONFIGURATION.md](./docs/CONFIGURATION.md) for configuration options.

## 🔒 Security

See [SECURITY.md](./docs/SECURITY.md) for security guidelines and best practices.

## 📊 Monitoring

All services include health checks and logging:

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f webasset-controller

# View KasmWeb sessions
docker exec -it mcp-kasm kasm-sessions

# View Traefik dashboard
# Access https://traefik.your-domain.com
```

## 🔧 Troubleshooting

See [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) for common issues and solutions.

### Quick Checks

```bash
# Check all containers
docker ps

# Check service health
curl http://localhost:5000/health

# Check Traefik configuration
docker exec mcp-traefik traefik version

# Check Tailscale status
sudo tailscale status

# Check disk space
df -h
```

## 📝 Scripts

### User Management
```bash
# Import users from CSV
python3 scripts/import_users_kasm.py \
  --kasm-url https://kasm.your-domain.com \
  --api-key YOUR_API_KEY \
  --api-secret YOUR_API_SECRET \
  --source csv \
  --csv-file users.csv

# Import users from Authentik
python3 scripts/import_users_kasm.py \
  --kasm-url https://kasm.your-domain.com \
  --api-key YOUR_API_KEY \
  --api-secret YOUR_API_SECRET \
  --source authentik \
  --authentik-url https://auth.your-domain.com \
  --authentik-token YOUR_TOKEN
```

### Workspace Management
```bash
# Create banking workspaces
python3 scripts/create_workspaces.py \
  --kasm-url https://kasm.your-domain.com \
  --api-key YOUR_API_KEY \
  --api-secret YOUR_API_SECRET \
  --config configs/webasset/banking_sites.yml
```

### Session Management
```bash
# Inject labels into active session
python3 scripts/inject_labels.py inject \
  --kasm-url https://kasm.your-domain.com \
  --api-key YOUR_API_KEY \
  --api-secret YOUR_API_SECRET \
  --session-id SESSION_ID \
  --user username \
  --banking-site BMG \
  --enable-watermark

# List active sessions
python3 scripts/inject_labels.py list \
  --kasm-url https://kasm.your-domain.com \
  --api-key YOUR_API_KEY \
  --api-secret YOUR_API_SECRET
```

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

**Ing. Benjamín Frías** - DevOps & Cloud Specialist

## 📞 Support

For support, please open an issue or contact the development team.

## 🗺️ Roadmap

- [ ] Multi-region deployment
- [ ] Advanced session analytics
- [ ] AI-powered fraud detection
- [ ] Mobile app support
- [ ] Advanced reporting dashboard
- [ ] Integration with additional banking sites
- [ ] Automated secret rotation
- [ ] Kubernetes migration option

## 📚 Additional Documentation

- [Architecture Details](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Configuration Guide](./docs/CONFIGURATION.md)
- [Security Guidelines](./docs/SECURITY.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)
- [User Manual](./docs/USER_MANUAL.md)

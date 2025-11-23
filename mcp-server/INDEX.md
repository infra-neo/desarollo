# MCP Server - Complete Documentation Index

## 📚 Documentation Overview

Welcome to the MCP Server documentation. This comprehensive system provides secure web asset management with automated credential injection, session recording, and full audit capabilities.

---

## 🚀 Getting Started

### Quick Links

| Document | Purpose | Time Required |
|----------|---------|---------------|
| [QUICKSTART.md](QUICKSTART.md) | Fast deployment guide | 5-50 minutes |
| [README.md](README.md) | Full system overview | 10 minutes read |
| [CONFIGURATION.md](docs/CONFIGURATION.md) | Detailed setup guide | 30-60 minutes |

### Choose Your Path

#### 🏃 Fast Track (Local Development)
1. Read [QUICKSTART.md](QUICKSTART.md) - Section "5-Minute Local Setup"
2. Run commands
3. Access services

#### 🏢 Production Deployment
1. Read [README.md](README.md) - Section "Prerequisites"
2. Follow [QUICKSTART.md](QUICKSTART.md) - Section "Production GCP Deployment"
3. Complete [CONFIGURATION.md](docs/CONFIGURATION.md)
4. Review [SECURITY.md](docs/SECURITY.md)

---

## 📖 Core Documentation

### System Architecture
- **[README.md](README.md)** - Complete system overview, features, and capabilities
- **[ARCHITECTURE.md](diagrams/ARCHITECTURE.md)** - Technical diagrams and data flows

### Setup & Configuration
- **[QUICKSTART.md](QUICKSTART.md)** - Step-by-step deployment for local and cloud
- **[CONFIGURATION.md](docs/CONFIGURATION.md)** - Detailed configuration for all services
- **[SECURITY.md](docs/SECURITY.md)** - Security hardening and best practices

---

## 🏗️ Architecture Components

### Core Services

| Service | Purpose | Port | Documentation |
|---------|---------|------|---------------|
| **Authentik** | SSO + MFA | 9000 | [Authentik Docs](https://goauthentik.io/docs/) |
| **Traefik** | Reverse Proxy | 80/443 | [Traefik Docs](https://doc.traefik.io/traefik/) |
| **JumpServer** | Asset Management | 8080 | [JumpServer Docs](https://docs.jumpserver.org/) |
| **Infisical** | Secrets Management | 8080 | [Infisical Docs](https://infisical.com/docs) |
| **WebAsset Controller** | Credential Injection | 3000 | Custom (see source) |
| **1Panel** | Admin Interface | 8080 | [1Panel Docs](https://1panel.io/docs/) |
| **PostgreSQL** | Database | 5432 | 5 isolated databases |
| **Redis** | Cache | 6379 | Shared cache |
| **Tailscale** | Zero Trust Network | 41641 | [Tailscale Docs](https://tailscale.com/kb/) |

### Architecture Diagrams

See [diagrams/ARCHITECTURE.md](diagrams/ARCHITECTURE.md) for:
- System architecture overview
- Network flow diagrams
- Component interactions
- Security layers
- Database schema

---

## 🛠️ Setup Guides

### Initial Setup

1. **Local Development**
   ```bash
   cd mcp-server/docker-compose
   cp .env.example .env
   # Edit .env
   docker-compose up -d
   ```

2. **GCP Production**
   ```bash
   cd mcp-server/terraform-gcp
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars
   terraform init
   terraform apply
   ```

### Service Configuration

Each service requires specific configuration:

1. **Authentik**: OIDC providers for all services
2. **JumpServer**: API key generation and OIDC setup
3. **Infisical**: Secret creation for banking sites
4. **WebAsset**: Banking site selector configuration

See [CONFIGURATION.md](docs/CONFIGURATION.md) for detailed steps.

---

## 📝 Operational Guides

### Daily Operations

Use the management script for common tasks:

```bash
# Start services
./scripts/manage.sh start

# Check status
./scripts/manage.sh status

# View logs
./scripts/manage.sh logs

# Health check
./scripts/manage.sh health
```

### Maintenance

```bash
# Backup database
./scripts/manage.sh backup

# Update services
./scripts/manage.sh update

# Clean up resources
./scripts/manage.sh cleanup
```

### Data Management

```bash
# Import users (50)
python3 jumpserver/scripts/import_users.py

# Import banking sites (25)
python3 jumpserver/scripts/import_assets.py

# Link policies
python3 jumpserver/scripts/link_policies.py
```

---

## 🔒 Security

### Security Features

- ✅ Zero Trust networking with Tailscale
- ✅ SSO with mandatory MFA
- ✅ HTTPS everywhere with auto-certificates
- ✅ Secrets encryption with Infisical
- ✅ Session isolation per user
- ✅ Complete session recording
- ✅ Audit logging for all activities
- ✅ Role-based access control

### Security Checklist

- [ ] Change all default passwords
- [ ] Configure MFA for all users
- [ ] Restrict SSH access to specific IPs
- [ ] Enable audit logging
- [ ] Set up automated backups
- [ ] Review [SECURITY.md](docs/SECURITY.md)
- [ ] Implement monitoring and alerting

---

## 🎯 Use Cases

### For End Users
1. Navigate to WebAsset Controller
2. Login with SSO credentials
3. Complete MFA challenge
4. Select banking site
5. Work normally (credentials auto-filled)
6. Close when done (session recorded)

### For Administrators
1. Manage users in Authentik
2. Configure assets in JumpServer
3. Store secrets in Infisical
4. Review session recordings
5. Generate audit reports
6. Monitor system via 1Panel

---

## 🧪 Testing

### Smoke Test

```bash
# 1. Start services
./scripts/manage.sh start

# 2. Wait for services
sleep 60

# 3. Health check
./scripts/manage.sh health

# 4. Test authentication
curl -I https://auth.yourdomain.com

# 5. Check services
./scripts/manage.sh status
```

### Full Test

1. Access WebAsset Controller: `https://web.yourdomain.com`
2. Login with test user
3. Complete MFA
4. Select banking site
5. Verify credential injection
6. Check JumpServer for recording

---

## 📊 Monitoring & Troubleshooting

### View Logs

```bash
# All services
./scripts/manage.sh logs

# Specific service
./scripts/manage.sh logs authentik-server
./scripts/manage.sh logs jumpserver-core
./scripts/manage.sh logs webasset-controller
```

### Common Issues

| Problem | Solution | Reference |
|---------|----------|-----------|
| Services not starting | Check logs and resources | [README.md](README.md#troubleshooting) |
| SSO not working | Verify OIDC configuration | [CONFIGURATION.md](docs/CONFIGURATION.md#authentik-configuration) |
| Credentials not injecting | Check Infisical secrets | [CONFIGURATION.md](docs/CONFIGURATION.md#infisical-configuration) |
| Sessions not recording | Verify JumpServer Chen | [README.md](README.md#troubleshooting) |

---

## 🔄 CI/CD

Automated pipeline includes:

- ✅ Linting and validation
- ✅ Docker image building
- ✅ Integration tests
- ✅ Security scanning
- ✅ Terraform validation
- ✅ Automated deployment

See `.github/workflows/mcp-server-cicd.yml` for details.

---

## 📦 Project Structure

```
mcp-server/
├── README.md                    # Main overview
├── QUICKSTART.md                # Fast deployment
├── docker-compose/              # Docker orchestration
│   ├── docker-compose.yml       # Service definitions
│   └── .env.example             # Configuration template
├── terraform-gcp/               # GCP infrastructure
│   ├── main.tf                  # Terraform config
│   ├── variables.tf             # Input variables
│   └── outputs.tf               # Output values
├── scripts/                     # Management scripts
│   ├── init.sh                  # Initialization
│   └── manage.sh                # Operations
├── jumpserver/scripts/          # Data import scripts
│   ├── import_users.py          # 50 users
│   ├── import_assets.py         # 25 banking sites
│   └── link_policies.py         # Access policies
├── webasset-controller/         # Custom service
│   ├── Dockerfile               # Container build
│   ├── package.json             # Dependencies
│   └── src/index.js             # Main application
├── traefik/dynamic/             # Traefik config
│   └── middlewares.yml          # Security rules
├── postgresql/                  # Database init
│   └── init-databases.sql       # Schema creation
├── diagrams/                    # Architecture docs
│   └── ARCHITECTURE.md          # Diagrams
├── docs/                        # Documentation
│   ├── CONFIGURATION.md         # Setup guide
│   └── SECURITY.md              # Security guide
└── .github/workflows/           # CI/CD
    └── mcp-server-cicd.yml      # Pipeline
```

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📞 Support

### Get Help

- **Documentation**: Start with this index
- **Issues**: [GitHub Issues](https://github.com/infra-neo/desarollo/issues)
- **Logs**: `./scripts/manage.sh logs`
- **Status**: `./scripts/manage.sh status`

### Contact

- **Email**: support@example.com
- **Slack**: #mcp-server (if applicable)

---

## 📜 License

MIT License - See LICENSE file for details

---

## 🙏 Credits

**Developed by**: Ing. Benjamín Frías  
**Role**: DevOps & Cloud Specialist  
**Organization**: infra-neo

---

## ⭐ Quick Reference

### Essential Commands

```bash
# Start
./scripts/manage.sh start

# Stop
./scripts/manage.sh stop

# Status
./scripts/manage.sh status

# Logs
./scripts/manage.sh logs

# Backup
./scripts/manage.sh backup

# Update
./scripts/manage.sh update
```

### Service URLs

```
https://auth.yourdomain.com   - Authentik (SSO)
https://jump.yourdomain.com   - JumpServer
https://vault.yourdomain.com  - Infisical
https://web.yourdomain.com    - WebAsset Controller
https://panel.yourdomain.com  - 1Panel
https://traefik.yourdomain.com - Traefik Dashboard
```

---

**Ready to get started? → [QUICKSTART.md](QUICKSTART.md) 🚀**

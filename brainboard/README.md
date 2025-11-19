# Brainboard Architecture Diagrams

This directory contains the generated architecture diagrams for the MCP Server infrastructure, compatible with Brainboard for visualization and documentation.

## Files

- **architecture_brainboard.json** - Complete architecture definition in Brainboard-compatible format

## Architecture Overview

The MCP Server infrastructure consists of:

### Components (16 total)
1. VPC Network (10.0.0.0/16)
2. Public Subnet (10.0.1.0/24)
3. Private Subnet (10.0.2.0/24)
4. Database Subnet (10.0.3.0/24)
5. PostgreSQL Master (5 databases)
6. Traefik Reverse Proxy
7. Authentik Identity Provider
8. Redis Cache
9. Infisical Secrets Management
10. JumpServer Audit & Recording
11. 1Panel Server Administration
12. WebAsset Controller
13. BMG Consig (External)
14. iCred API (External)
15. Tailscale VPN
16. End Users

### Network Flow

```
Users → Tailscale (optional) → Traefik :443 → Authentik SSO
                                     ↓
                        ┌────────────┼────────────┐
                        ↓            ↓            ↓
                   Infisical    JumpServer    1Panel
                        ↓            ↓            ↓
                   WebAsset ────────┴────────────┘
                        ↓
                   Banking Sites
```

### Security Zones

1. **Public Zone** (DMZ)
   - Traefik (443)
   - Tailscale VPN endpoint

2. **Private Zone** (Application Layer)
   - Authentik
   - Infisical
   - JumpServer
   - 1Panel
   - WebAsset Controller
   - Redis

3. **Data Zone** (Database Layer)
   - PostgreSQL (isolated, no public access)

## How to Use

### Generate New Diagram

```bash
# From repository root
python3 scripts/generate_brainboard.py
```

### Import into Brainboard

1. Go to [Brainboard](https://www.brainboard.co)
2. Create new project or open existing
3. Click "Import" → "From JSON"
4. Upload `architecture_brainboard.json`
5. Visualize and customize

### Customize Architecture

Edit `scripts/generate_brainboard.py` to:
- Add new components
- Modify connections
- Update network topology
- Change security rules

## Architecture Metadata

- **Provider**: Google Cloud Platform (GCP)
- **Region**: us-central1
- **Terraform**: Modular design
- **Docker**: Swarm orchestration
- **Security**: Zero Trust with SSO

## Author

Ing. Benjamín Frías — DevOps & Cloud Specialist

## Related Documentation

- [MCP Server Guide](../docs/MCP_SERVER_GUIDE.md)
- [Terraform Structure](../terraform_structure.md)
- [WebAsset Controller](../webasset-controller/README.md)

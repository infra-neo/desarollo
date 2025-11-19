# MCP Server Infrastructure - Deployment Checklist

**Author:** Ing. Benjamín Frías — DevOps & Cloud Specialist  
**Version:** 1.0.0

---

## Pre-Deployment Checklist

### Infrastructure Prerequisites

- [ ] GCP Project created and billing enabled
- [ ] GCP credentials configured (`gcloud auth login`)
- [ ] Domain name purchased and DNS configured
- [ ] GitHub repository access configured
- [ ] Docker Swarm cluster ready (or VM for single-node)

### Tools Installation

- [ ] Terraform >= 1.6.0 installed
- [ ] Docker >= 20.10 installed
- [ ] Python >= 3.8 installed
- [ ] Git installed
- [ ] OpenSSL installed (for secret generation)

### Secrets Preparation

- [ ] Generate all required secrets using `scripts/setup_env.sh`
- [ ] Store secrets in secure location (1Password, HashiCorp Vault, etc.)
- [ ] Configure GCP credentials as GitHub Secrets
- [ ] Configure SSH keys for VM access

---

## Deployment Steps

### Phase 1: Infrastructure (Terraform)

- [ ] Review `terraform_structure.md`
- [ ] Update `terraform/terraform.tfvars` with your values
- [ ] Run `terraform init`
- [ ] Run `terraform plan` and review
- [ ] Run `terraform apply` (approve after review)
- [ ] Verify infrastructure in GCP Console
- [ ] Save Terraform outputs (instance IP, connection strings)
- [ ] Configure DNS records for domain

### Phase 2: Environment Setup

- [ ] SSH into the VM
- [ ] Install Docker and Docker Compose
- [ ] Initialize Docker Swarm: `docker swarm init`
- [ ] Generate environment file: `./scripts/setup_env.sh`
- [ ] Update `.env.stack` with PostgreSQL host from Terraform
- [ ] Update `.env.stack` with your domain
- [ ] Verify environment variables are set correctly

### Phase 3: Stack Deployment

- [ ] Copy docker-compose.stack.yml to VM
- [ ] Copy .env.stack to VM
- [ ] Deploy stack: `docker stack deploy -c docker-compose.stack.yml --env-file .env.stack mcp-server`
- [ ] Wait for services to start (check: `docker stack services mcp-server`)
- [ ] Verify all services are running: `docker service ls`
- [ ] Check logs for errors: `docker service logs mcp-server_<service>`

### Phase 4: Service Configuration

#### Traefik
- [ ] Access: `https://traefik.your-domain.com/dashboard/`
- [ ] Verify SSL certificates issued
- [ ] Check routing rules

#### Authentik
- [ ] Access: `https://auth.your-domain.com`
- [ ] Complete initial setup wizard
- [ ] Change default admin password
- [ ] Create organization
- [ ] Configure email provider
- [ ] Create user groups:
  - [ ] admin
  - [ ] banking-users
  - [ ] bmg-access
  - [ ] icred-access
- [ ] Create applications:
  - [ ] WebAsset Controller (OIDC)
  - [ ] JumpServer (OIDC)
  - [ ] Infisical (OIDC)
  - [ ] 1Panel (OIDC)
- [ ] Configure ForwardAuth provider for Traefik

#### Infisical
- [ ] Access: `https://secrets.your-domain.com`
- [ ] Complete initial setup
- [ ] Create organization
- [ ] Create project: "Banking Credentials"
- [ ] Create environments: production, staging, development
- [ ] Add secrets:
  - [ ] `/banking/bmg/master-credentials` (username, password)
  - [ ] `/banking/icred/master-credentials` (email, password)
- [ ] Generate service tokens for WebAsset Controller
- [ ] Configure access permissions

#### JumpServer
- [ ] Access: `https://jump.your-domain.com`
- [ ] Complete initial setup
- [ ] Configure OIDC integration with Authentik
- [ ] Create asset types
- [ ] Configure session recording settings
- [ ] Set recording storage path
- [ ] Configure audit settings
- [ ] Generate API token for WebAsset Controller

#### 1Panel
- [ ] Access: `https://panel.your-domain.com`
- [ ] Complete initial setup
- [ ] Configure OIDC integration with Authentik
- [ ] Set up Docker management
- [ ] Configure file manager permissions
- [ ] Set up backup schedules

#### WebAsset Controller
- [ ] Access: `https://webasset.your-domain.com`
- [ ] Test SSO login via Authentik
- [ ] Verify Infisical connection
- [ ] Verify JumpServer integration
- [ ] Test asset listing
- [ ] Test session creation
- [ ] Verify session recording

### Phase 5: Testing

#### Functional Tests
- [ ] User can login via SSO (Authentik)
- [ ] User can access WebAsset Controller
- [ ] User can see available banking assets
- [ ] User can start a banking session
- [ ] Browser automation works correctly
- [ ] Session is recorded in JumpServer
- [ ] Audit logs are created
- [ ] Session timeout works
- [ ] User can logout

#### Security Tests
- [ ] SSL/TLS certificates valid
- [ ] HTTP redirects to HTTPS
- [ ] Database not accessible from internet
- [ ] Services only accessible via Traefik
- [ ] Authentik ForwardAuth working
- [ ] Secrets not exposed in logs
- [ ] No sensitive data in error messages

#### Performance Tests
- [ ] Test with 10 concurrent users
- [ ] Test with 50 concurrent users (target)
- [ ] Monitor resource usage
- [ ] Check response times
- [ ] Verify no memory leaks

### Phase 6: Monitoring & Observability

- [ ] Configure Prometheus metrics collection
- [ ] Set up Grafana dashboards
- [ ] Configure alerting rules
- [ ] Test alert notifications
- [ ] Set up log aggregation
- [ ] Configure backup schedules
- [ ] Document runbook procedures

### Phase 7: Documentation

- [ ] Update MCP_SERVER_GUIDE.md with actual values
- [ ] Document custom configurations
- [ ] Create user guides
- [ ] Document troubleshooting procedures
- [ ] Create incident response plan
- [ ] Document backup/restore procedures

---

## Post-Deployment

### Regular Maintenance

- [ ] Weekly: Review audit logs
- [ ] Weekly: Check for failed sessions
- [ ] Monthly: Rotate credentials
- [ ] Monthly: Update dependencies
- [ ] Monthly: Review access logs
- [ ] Quarterly: Security audit
- [ ] Quarterly: DR test

### Monitoring Checklist

- [ ] All services running
- [ ] No failed deployments
- [ ] SSL certificates valid (>30 days)
- [ ] Disk usage < 80%
- [ ] Memory usage < 80%
- [ ] CPU usage reasonable
- [ ] No errors in logs
- [ ] Backups completing successfully

---

## Rollback Plan

If deployment fails:

1. **Stop the stack**:
   ```bash
   docker stack rm mcp-server
   ```

2. **Destroy infrastructure** (if needed):
   ```bash
   cd terraform
   terraform destroy
   ```

3. **Review logs**:
   ```bash
   docker service logs mcp-server_<service>
   ```

4. **Fix issues and redeploy**

---

## Support Contacts

- **Infrastructure**: Ing. Benjamín Frías
- **Repository**: https://github.com/infra-neo/desarollo
- **Documentation**: `/docs/MCP_SERVER_GUIDE.md`

---

## Appendix: Environment Variables Reference

See `.env.stack.example` for complete list of required environment variables.

### Critical Variables

```bash
DOMAIN=your-domain.com
POSTGRES_HOST=<from-terraform-output>
AUTHENTIK_SECRET_KEY=<generated>
INFISICAL_ENCRYPTION_KEY=<generated>
JUMPSERVER_SECRET_KEY=<generated>
```

### Generation Commands

```bash
# Generate secrets
openssl rand -base64 32

# Or use provided script
./scripts/setup_env.sh
```

---

**Remember:** This is production infrastructure handling sensitive banking operations. Always follow security best practices and maintain compliance with banking regulations.

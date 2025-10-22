# Deployment Checklist

**Author: Ing. Benjamín Frías — DevOps & Cloud Specialist**

This checklist ensures all prerequisites and configurations are in place before deploying the infrastructure and application.

---

## Pre-Deployment Checklist

### 1. Cloud Provider Setup

#### GCP Account Configuration
- [ ] GCP account created and verified
- [ ] Billing account linked and active
- [ ] Project created with unique ID
- [ ] Project billing enabled

#### Required APIs
Enable the following APIs in your GCP project:
- [ ] Compute Engine API
- [ ] VPC Access API
- [ ] Cloud Resource Manager API
- [ ] Service Usage API

```bash
# Enable APIs via gcloud CLI
gcloud services enable compute.googleapis.com
gcloud services enable vpcaccess.googleapis.com
gcloud services enable cloudresourcemanager.googleapis.com
gcloud services enable serviceusage.googleapis.com
```

#### Service Account
- [ ] Service account created with appropriate permissions
- [ ] JSON key downloaded securely
- [ ] Key stored in GitHub Secrets as `GCP_CREDENTIALS`

Required roles:
- Compute Admin
- Compute Network Admin
- Service Account User

```bash
# Create service account
gcloud iam service-accounts create desarollo-deploy \
  --display-name="Desarollo Deployment Service Account"

# Grant roles
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:desarollo-deploy@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/compute.admin"

gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:desarollo-deploy@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/compute.networkAdmin"

# Create key
gcloud iam service-accounts keys create key.json \
  --iam-account=desarollo-deploy@PROJECT_ID.iam.gserviceaccount.com
```

### 2. GitHub Repository Setup

#### Repository Configuration
- [ ] Repository forked/cloned
- [ ] Branch protection rules configured
- [ ] Code owners defined (optional)

#### GitHub Secrets
Navigate to: Settings → Secrets and variables → Actions

Create the following secrets:
- [ ] `GCP_CREDENTIALS` - JSON content from service account key
- [ ] `GCP_PROJECT_ID` - Your GCP project ID
- [ ] `SSH_PRIVATE_KEY` - Private SSH key for VM access
- [ ] `VM_IP` - (Will be added after infrastructure deployment)
- [ ] `GRAFANA_ADMIN_PASSWORD` - (Optional) Grafana admin password

#### GitHub Actions
- [ ] GitHub Actions enabled in repository
- [ ] Workflow permissions set (Read and write permissions)

### 3. SSH Key Generation

#### Generate SSH Key Pair
```bash
# Generate SSH key pair (if not already existing)
ssh-keygen -t rsa -b 4096 -f ~/.ssh/desarollo_key -C "desarollo-deployment"

# View public key (to add to VM)
cat ~/.ssh/desarollo_key.pub

# View private key (to add to GitHub Secrets)
cat ~/.ssh/desarollo_key
```

- [ ] SSH key pair generated
- [ ] Public key saved for VM configuration
- [ ] Private key added to GitHub Secrets as `SSH_PRIVATE_KEY`

### 4. Local Development Setup

#### Required Tools
- [ ] Git installed (>= 2.0)
- [ ] Terraform installed (>= 1.0)
- [ ] Docker installed (>= 20.10)
- [ ] GCloud CLI installed and configured
- [ ] Node.js installed (>= 18) for local development
- [ ] SSH client installed

```bash
# Verify installations
git --version
terraform --version
docker --version
gcloud --version
node --version
ssh -V
```

#### Clone Repository
- [ ] Repository cloned locally
- [ ] Correct branch checked out

```bash
git clone https://github.com/infra-neo/desarollo.git
cd desarollo
git checkout main
```

### 5. Configuration Files

#### Terraform Configuration
- [ ] Copy `terraform/terraform.tfvars.example` to `terraform/terraform.tfvars`
- [ ] Update `project_id` in terraform.tfvars
- [ ] Review and adjust other variables (region, zone, instance type)
- [ ] Verify network CIDR ranges don't conflict

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
```

#### Architecture Configuration
- [ ] Review `input/arch.yaml`
- [ ] Adjust resource specifications if needed
- [ ] Verify firewall rules meet security requirements

#### Application Configuration
- [ ] Review `input/docker-compose.yml`
- [ ] Adjust service replicas if needed
- [ ] Configure environment variables

---

## Deployment Checklist

### Phase 1: Infrastructure Deployment

#### Manual Deployment
- [ ] Navigate to terraform directory
- [ ] Run `terraform init`
- [ ] Run `terraform plan` and review changes
- [ ] Run `terraform apply` and confirm
- [ ] Note the outputs (VM IP, SSH command)
- [ ] Add VM IP to GitHub Secrets as `VM_IP`

#### CI/CD Deployment
- [ ] Push code to main branch
- [ ] Monitor GitHub Actions workflow
- [ ] Verify infrastructure deployment completed
- [ ] Check workflow outputs for VM IP
- [ ] Update GitHub Secrets with VM IP

### Phase 2: VM Access Verification

- [ ] Test SSH connection to VM
- [ ] Verify Docker installation
- [ ] Verify startup script completion
- [ ] Check /opt/desarollo directory exists

```bash
# Test SSH
ssh -i ~/.ssh/desarollo_key ubuntu@VM_IP

# Verify Docker
docker --version
docker info

# Check startup script
cat /var/log/startup-script.log
```

### Phase 3: Application Deployment

#### Manual Deployment
- [ ] Copy deployment files to VM
- [ ] Initialize Docker Swarm
- [ ] Deploy application stack
- [ ] Deploy observability stack
- [ ] Verify services are running

#### CI/CD Deployment
- [ ] Trigger deployment workflow
- [ ] Monitor build process
- [ ] Verify Docker image pushed
- [ ] Verify stack deployment
- [ ] Check service health

### Phase 4: Verification

#### Infrastructure Verification
- [ ] VM is accessible via SSH
- [ ] Static IP assigned correctly
- [ ] Firewall rules working
- [ ] Network connectivity confirmed

#### Application Verification
- [ ] Application accessible at http://VM_IP
- [ ] Services responding to requests
- [ ] Health checks passing
- [ ] Logs being generated

#### Observability Verification
- [ ] Grafana accessible at http://VM_IP:3000
- [ ] Loki API responding at http://VM_IP:3100
- [ ] Promtail collecting logs
- [ ] Logs visible in Grafana

### Phase 5: Diagram Generation

- [ ] Run diagram generation script
- [ ] Verify diagrams created
- [ ] Review infrastructure visualization
- [ ] Commit diagrams to repository

---

## Post-Deployment Checklist

### Security Hardening

- [ ] Change default Grafana password
- [ ] Review firewall rules and tighten if needed
- [ ] Configure SSH to use key-only authentication
- [ ] Enable automatic security updates
- [ ] Set up monitoring alerts
- [ ] Configure backup strategy

### Optimization

- [ ] Review resource utilization
- [ ] Adjust service replicas based on load
- [ ] Optimize Docker image sizes
- [ ] Configure log rotation
- [ ] Set up performance monitoring

### Documentation

- [ ] Document custom configurations
- [ ] Update team runbooks
- [ ] Create incident response plan
- [ ] Document monitoring thresholds
- [ ] Create disaster recovery plan

---

## Validation Commands

### Infrastructure Validation
```bash
# Check Terraform state
cd terraform
terraform state list

# Verify GCP resources
gcloud compute instances list
gcloud compute addresses list
gcloud compute firewall-rules list
```

### Application Validation
```bash
# SSH to VM
ssh ubuntu@$VM_IP

# Check Docker Swarm
docker node ls
docker network ls

# Check stacks
docker stack ls
docker stack services desarollo
docker stack services monitoring

# Check service logs
docker service logs desarollo_app
docker service logs monitoring_grafana
```

### Observability Validation
```bash
# Test Grafana
curl http://VM_IP:3000/api/health

# Test Loki
curl http://VM_IP:3100/ready

# Query logs via Loki API
curl -G -s "http://VM_IP:3100/loki/api/v1/query" \
  --data-urlencode 'query={job="varlogs"}'
```

---

## Troubleshooting Reference

### Common Issues

#### Terraform Errors
- Check GCP credentials validity
- Verify API enablement
- Check quota limits
- Review error messages in workflow logs

#### SSH Connection Issues
- Verify SSH key is correct
- Check firewall rules allow port 22
- Confirm VM is running
- Verify network connectivity

#### Docker Deployment Issues
- Check Docker daemon status
- Verify Swarm initialization
- Review service logs
- Check resource availability

#### Application Not Accessible
- Verify firewall rules
- Check service is running
- Test local connectivity first
- Review nginx logs

---

## Rollback Procedures

### Infrastructure Rollback
```bash
# Revert to previous Terraform state
cd terraform
terraform state pull > backup.tfstate
terraform apply -target=module.compute  # Selective rollback

# Complete rollback
terraform destroy
```

### Application Rollback
```bash
# Remove failed stack
docker stack rm desarollo

# Redeploy previous version
docker stack deploy -c docker-compose.yml desarollo
```

---

## Success Criteria

Deployment is successful when:
- [ ] Infrastructure provisioned without errors
- [ ] VM accessible via SSH
- [ ] Docker Swarm initialized
- [ ] Application stack deployed
- [ ] Application accessible via browser
- [ ] Observability stack running
- [ ] Grafana accessible and showing logs
- [ ] All health checks passing
- [ ] CI/CD pipeline completed successfully
- [ ] Diagrams generated
- [ ] Documentation updated

---

## Support and Contacts

For deployment issues or questions:
- Review documentation in `/docs/`
- Check GitHub Actions workflow logs
- Review service logs in Grafana
- Consult Terraform documentation

**Project Author:** Ing. Benjamín Frías — DevOps & Cloud Specialist

---

## Next Steps After Deployment

1. **Security Enhancement**
   - Configure HTTPS with Let's Encrypt
   - Implement IP whitelisting
   - Set up VPN access
   - Enable audit logging

2. **Performance Optimization**
   - Monitor resource usage
   - Optimize Docker images
   - Configure CDN (if needed)
   - Implement caching strategies

3. **Reliability Improvements**
   - Set up automated backups
   - Configure auto-scaling
   - Implement blue-green deployments
   - Create disaster recovery plan

4. **Monitoring Enhancement**
   - Create custom Grafana dashboards
   - Configure alert rules
   - Set up notification channels
   - Implement SLIs/SLOs

---

**Last Updated:** 2025-10-22

**Author:** Ing. Benjamín Frías — DevOps & Cloud Specialist

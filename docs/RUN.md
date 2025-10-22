# Execution Guide - Desarollo Project

**Author: Ing. Benjamín Frías — DevOps & Cloud Specialist**

This document provides comprehensive step-by-step instructions for deploying and running the complete infrastructure and application stack.

---

## Prerequisites

Before starting, ensure you have the following:

### Required Tools
- [Terraform](https://www.terraform.io/downloads) (>= 1.0)
- [Docker](https://docs.docker.com/get-docker/) (>= 20.10)
- [GCloud CLI](https://cloud.google.com/sdk/docs/install) (for GCP)
- [Git](https://git-scm.com/downloads)
- SSH key pair for VM access

### Required Accounts & Credentials
- Google Cloud Platform (GCP) account with billing enabled
- GCP Project with required APIs enabled:
  - Compute Engine API
  - VPC Access API
- GitHub account (for CI/CD)

### Environment Variables
Set the following secrets in your GitHub repository:
- `GCP_CREDENTIALS` - GCP service account JSON key
- `GCP_PROJECT_ID` - Your GCP project ID
- `SSH_PRIVATE_KEY` - SSH private key for VM access
- `VM_IP` - VM IP address (after infrastructure deployment)

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/infra-neo/desarollo.git
cd desarollo
```

---

## Step 2: Configure Infrastructure

### 2.1 Prepare Terraform Variables

Copy the example variables file and fill in your values:

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:

```hcl
project_id     = "your-gcp-project-id"
region         = "us-central1"
zone           = "us-central1-a"
instance_name  = "desarollo-vm"
machine_type   = "e2-medium"
```

### 2.2 Review Architecture Configuration

Review and customize `input/arch.yaml` to match your requirements:

```bash
cat input/arch.yaml
```

---

## Step 3: Deploy Infrastructure

### 3.1 Local Deployment (Manual)

Initialize and apply Terraform:

```bash
cd terraform

# Initialize Terraform
terraform init

# Review the plan
terraform plan

# Apply the configuration
terraform apply

# Note the outputs (VM IP, SSH command)
terraform output
```

### 3.2 CI/CD Deployment (Automated)

Push changes to the `main` branch to trigger automatic deployment:

```bash
git add .
git commit -m "Deploy infrastructure"
git push origin main
```

The GitHub Actions workflow will:
1. Run `terraform plan`
2. Apply infrastructure changes
3. Output instance information

---

## Step 4: Configure VM Access

### 4.1 Set Up SSH Access

Add your SSH public key to the VM:

```bash
# Get the VM IP from Terraform output
VM_IP=$(cd terraform && terraform output -raw instance_ip)

# Add SSH key to VM
gcloud compute instances add-metadata desarollo-vm \
  --zone=us-central1-a \
  --metadata=ssh-keys="ubuntu:$(cat ~/.ssh/id_rsa.pub)"
```

### 4.2 Test SSH Connection

```bash
ssh ubuntu@$VM_IP
```

---

## Step 5: Initialize Docker Swarm

### 5.1 Manual Initialization

SSH into the VM and initialize Docker Swarm:

```bash
ssh ubuntu@$VM_IP

# Navigate to workloads directory
cd /opt/desarollo/workloads/docker-swarm

# Initialize Swarm
./init-swarm.sh
```

### 5.2 Automated via CI/CD

The GitHub Actions workflow automatically initializes Docker Swarm on deployment.

---

## Step 6: Deploy Application Stack

### 6.1 Copy Deployment Files

From your local machine:

```bash
# Copy workloads to VM
scp -r workloads ubuntu@$VM_IP:/opt/desarollo/

# Copy docker-compose file
scp input/docker-compose.yml ubuntu@$VM_IP:/opt/desarollo/
```

### 6.2 Deploy Application

SSH into the VM and deploy:

```bash
ssh ubuntu@$VM_IP

cd /opt/desarollo

# Deploy application stack
export APP_IMAGE=your-docker-image:latest
docker stack deploy -c docker-compose.yml desarollo

# Verify deployment
docker stack services desarollo
docker stack ps desarollo
```

### 6.3 Automated Deployment

Push code changes to trigger automatic deployment:

```bash
git add src/
git commit -m "Update application"
git push origin main
```

---

## Step 7: Deploy Observability Stack

### 7.1 Deploy Monitoring Services

```bash
ssh ubuntu@$VM_IP

cd /opt/desarollo

# Deploy observability stack
docker stack deploy -c workloads/stacks/observability-stack.yml monitoring

# Verify deployment
docker stack services monitoring
```

### 7.2 Access Monitoring Services

- **Grafana**: http://VM_IP:3000
  - Default credentials: admin/admin
- **Loki**: http://VM_IP:3100 (API endpoint)

---

## Step 8: Generate Infrastructure Diagrams

### 8.1 Local Generation

```bash
cd diagrams
./generate-diagrams.sh
```

Diagrams will be generated in `diagrams/output/`:
- `infrastructure-inframap.png` - Inframap diagram
- `infrastructure-terravision.png` - Terravision diagram
- `branded-*.png` - Diagrams with branding

### 8.2 Automated Generation

Diagrams are automatically generated on infrastructure changes via GitHub Actions.

---

## Step 9: Access Your Application

### Application URLs

- **Frontend**: http://VM_IP (or http://VM_IP:5173 if direct access)
- **Grafana Dashboard**: http://VM_IP:3000
- **Loki API**: http://VM_IP:3100

### Verify Services

```bash
ssh ubuntu@$VM_IP

# Check all stacks
docker stack ls

# Check services status
docker service ls

# View logs
docker service logs desarollo_app
docker service logs monitoring_grafana
```

---

## Step 10: Monitor and Maintain

### View Logs in Grafana

1. Access Grafana at http://VM_IP:3000
2. Login with admin credentials
3. Navigate to Explore
4. Select Loki datasource
5. Query logs using LogQL

### Common Commands

```bash
# View service logs
docker service logs -f <service_name>

# Scale a service
docker service scale desarollo_app=3

# Update a service
docker service update --image new-image:tag desarollo_app

# Remove a stack
docker stack rm desarollo
docker stack rm monitoring
```

---

## Troubleshooting

### Infrastructure Issues

**Problem**: Terraform apply fails

```bash
# Check GCP credentials
gcloud auth list

# Verify project
gcloud config get-value project

# Check API enablement
gcloud services list --enabled
```

**Problem**: Cannot SSH to VM

```bash
# Check firewall rules
gcloud compute firewall-rules list

# Verify VM is running
gcloud compute instances list

# Check SSH keys
gcloud compute instances describe desarollo-vm --zone=us-central1-a
```

### Docker Swarm Issues

**Problem**: Swarm init fails

```bash
# Check Docker service
sudo systemctl status docker

# Restart Docker
sudo systemctl restart docker

# Leave existing swarm
docker swarm leave --force
```

**Problem**: Services not starting

```bash
# Check service status
docker service ps <service_name> --no-trunc

# View service logs
docker service logs <service_name>

# Inspect service
docker service inspect <service_name>
```

### Application Issues

**Problem**: Application not accessible

```bash
# Check service is running
docker service ls

# Verify port bindings
docker ps

# Check firewall rules
sudo ufw status

# Test local connectivity
curl localhost:5173
```

---

## CI/CD Pipeline Details

### Workflows

1. **Infrastructure Deployment** (`.github/workflows/infrastructure.yml`)
   - Triggers: Push to main, PR to main, manual dispatch
   - Actions: terraform init, plan, apply
   - Outputs: VM IP, SSH command

2. **Application Deployment** (`.github/workflows/deploy.yml`)
   - Triggers: Push to main (src/workloads changes)
   - Actions: Build Docker image, deploy to Swarm
   - Outputs: Deployment status

3. **Diagram Generation** (`.github/workflows/diagrams.yml`)
   - Triggers: Infrastructure changes
   - Actions: Generate and upload diagrams
   - Outputs: Infrastructure visualization

### GitHub Secrets Configuration

Navigate to: Repository → Settings → Secrets and variables → Actions

Add the following secrets:
```
GCP_CREDENTIALS      - JSON key file content
GCP_PROJECT_ID       - Your GCP project ID
SSH_PRIVATE_KEY      - Private key for VM access
VM_IP                - Static IP of the VM
GRAFANA_ADMIN_PASSWORD - Grafana admin password (optional)
```

---

## Cleanup

### Remove Application Stacks

```bash
ssh ubuntu@$VM_IP

# Remove application stack
docker stack rm desarollo

# Remove monitoring stack
docker stack rm monitoring

# Leave swarm
docker swarm leave --force
```

### Destroy Infrastructure

```bash
cd terraform
terraform destroy
```

Or use GitHub Actions:
- Go to Actions tab
- Select "Infrastructure Deployment"
- Click "Run workflow"
- Select action: "destroy"

---

## Additional Resources

### Documentation
- [Terraform GCP Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [Docker Swarm Documentation](https://docs.docker.com/engine/swarm/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Loki Documentation](https://grafana.com/docs/loki/latest/)

### Architecture Files
- Architecture config: `input/arch.yaml`
- Docker compose: `input/docker-compose.yml`
- Terraform config: `terraform/main.tf`

### Support
For issues or questions, contact:
**Ing. Benjamín Frías — DevOps & Cloud Specialist**

---

## Next Steps

After successful deployment:

1. **Secure your infrastructure**
   - Update firewall rules for production
   - Enable HTTPS with Let's Encrypt
   - Configure backup strategies

2. **Optimize performance**
   - Adjust resource limits
   - Configure auto-scaling
   - Optimize Docker images

3. **Enhance monitoring**
   - Create custom Grafana dashboards
   - Set up alerting rules
   - Configure log retention

4. **Implement CI/CD best practices**
   - Add automated testing
   - Configure staging environments
   - Implement blue-green deployments

---

**Author: Ing. Benjamín Frías — DevOps & Cloud Specialist**

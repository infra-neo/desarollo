# CloudSpace Deployment Guide

This guide explains how to deploy the Desarollo application to Google Cloud Platform (GCP) for testing.

## Prerequisites

Before deploying, ensure the following GitHub Secrets are configured:

1. **GCP_CREDENTIALS** - Service account JSON key with permissions to create GCP resources
2. **GCP_PROJECT_ID** - Your GCP project ID
3. **SSH_PRIVATE_KEY** - Private SSH key for accessing the deployed VM
4. **VM_IP** - (Will be set automatically after infrastructure deployment, or manually if known)

## Deployment Steps

### Option 1: Automated Deployment via GitHub Actions

#### Step 1: Deploy Infrastructure

1. Go to the **Actions** tab in GitHub
2. Select the **Infrastructure Deployment** workflow
3. Click **Run workflow**
4. Choose the branch: `copilot/deploy-on-cloudspace`
5. Select action: `apply`
6. Click **Run workflow**

This will:
- Provision a GCP VM (e2-medium instance)
- Create VPC network and subnet
- Configure firewall rules
- Assign a static IP
- Install Docker and Docker Swarm on the VM

After completion, note the VM IP address from the workflow output.

#### Step 2: Update VM_IP Secret (if not already set)

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Update or create the `VM_IP` secret with the IP address from Step 1

#### Step 3: Deploy Application

1. Go to the **Actions** tab in GitHub
2. Select the **Deploy Application** workflow
3. Click **Run workflow**
4. Choose the branch: `copilot/deploy-on-cloudspace`
5. Click **Run workflow**

This will:
- Build the React application into a Docker image
- Push the image to GitHub Container Registry
- Deploy the application to Docker Swarm on the GCP VM
- Deploy the observability stack (Grafana, Loki, Promtail)

### Option 2: Manual Deployment

If you prefer to deploy manually or need to troubleshoot:

#### 1. Deploy Infrastructure Manually

```bash
cd terraform
terraform init
terraform plan -var="project_id=YOUR_GCP_PROJECT_ID"
terraform apply -var="project_id=YOUR_GCP_PROJECT_ID"
```

Note the outputs (VM IP and SSH command).

#### 2. Build and Push Docker Image

```bash
# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Build the image
docker build -t ghcr.io/infra-neo/desarollo:latest .

# Push the image
docker push ghcr.io/infra-neo/desarollo:latest
```

#### 3. Deploy to VM

SSH into the VM and deploy the stack:

```bash
# SSH to VM
ssh ubuntu@VM_IP

# Pull the latest image
docker pull ghcr.io/infra-neo/desarollo:latest

# Deploy the stack
export APP_IMAGE=ghcr.io/infra-neo/desarollo:latest
docker stack deploy -c /opt/desarollo/docker-compose.yml desarollo

# Deploy observability stack
docker stack deploy -c /opt/desarollo/workloads/stacks/observability-stack.yml monitoring
```

## Accessing the Application

After successful deployment:

- **Application**: http://VM_IP
- **Grafana Dashboard**: http://VM_IP:3000
  - Default credentials: admin/admin (change on first login)
- **Loki API**: http://VM_IP:3100

## Verification

To verify the deployment is successful:

```bash
# SSH to VM
ssh ubuntu@VM_IP

# Check running stacks
docker stack ls

# Check services
docker stack services desarollo
docker stack services monitoring

# Check service logs
docker service logs desarollo_app
docker service logs monitoring_grafana
```

## Troubleshooting

### Docker Build Fails Locally

The Docker build may fail locally due to npm timeout issues. This is expected - the GitHub Actions environment handles this better. Use the automated deployment via GitHub Actions instead.

### Application Not Accessible

1. Check firewall rules are allowing HTTP traffic (port 80)
2. Verify the service is running: `docker service ls`
3. Check service logs: `docker service logs desarollo_app`
4. Ensure the VM has a public IP address

### Grafana Not Accessible

1. Check if the monitoring stack is deployed: `docker stack services monitoring`
2. Verify firewall allows port 3000
3. Check Grafana logs: `docker service logs monitoring_grafana`

## Cleanup

To remove the deployment:

### Remove Application Stacks

```bash
ssh ubuntu@VM_IP
docker stack rm desarollo
docker stack rm monitoring
```

### Destroy Infrastructure

```bash
cd terraform
terraform destroy -var="project_id=YOUR_GCP_PROJECT_ID"
```

Or use the GitHub Actions workflow with action: `destroy`

## Architecture

The deployment creates:

- **GCP VM**: e2-medium instance running Ubuntu
- **Docker Swarm**: Single-node swarm for orchestration
- **Application Stack**: React frontend served via Nginx
- **Observability Stack**: Grafana + Loki + Promtail for monitoring and logs
- **Network**: VPC with custom subnet and static IP
- **Security**: Firewall rules for SSH, HTTP, HTTPS, and Swarm communication

## Author

**Ing. Benjamín Frías — DevOps & Cloud Specialist**

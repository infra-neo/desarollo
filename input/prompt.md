# Infrastructure Deployment Prompt

## Overview
This directory contains the input configuration files for deploying the infrastructure and application stack.

## Files Description

### docker-compose.yml
Docker Compose file defining the application services for Docker Swarm deployment. Includes:
- Application service with replicas
- Nginx reverse proxy
- Network configuration
- Volume management

### arch.yaml
Architecture configuration file defining:
- Cloud provider settings (GCP)
- Compute resources (e2-medium VM)
- Network configuration (VPC, subnets, static IP)
- Firewall rules
- Observability stack configuration
- Docker Swarm settings

## Usage Instructions

1. **Review Configuration**: Ensure all values in `arch.yaml` match your requirements
2. **Customize Services**: Modify `docker-compose.yml` to add or remove services
3. **Deploy Infrastructure**: Use Terraform to provision the cloud infrastructure
4. **Deploy Application**: Use the CI/CD pipeline to deploy the Docker stack

## Deployment Flow

```
Input Files → Terraform (Infrastructure) → Docker Swarm Bootstrap → Stack Deployment → Observability Setup
```

## Variables to Configure

Before deployment, configure these variables:
- `APP_IMAGE`: Docker image for your application
- Cloud provider credentials
- SSH keys for VM access
- Domain names (if using custom domains)

## Author
**Ing. Benjamín Frías — DevOps & Cloud Specialist**

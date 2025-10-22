# Quick Start Guide

**Author: Ing. Benjamín Frías — DevOps & Cloud Specialist**

Get up and running with Desarollo in minutes!

---

## Prerequisites

- Google Cloud Platform account with billing enabled
- GitHub account
- Docker installed locally (for testing)

---

## 5-Minute Setup

### 1. Configure GitHub Secrets

Go to your repository Settings → Secrets and variables → Actions

Add these secrets:
```
GCP_CREDENTIALS      = <Your GCP service account JSON>
GCP_PROJECT_ID       = <Your GCP project ID>
SSH_PRIVATE_KEY      = <Your SSH private key>
```

### 2. Configure Terraform Variables

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your GCP project ID
```

### 3. Deploy Infrastructure

**Option A: Automated (Recommended)**
```bash
git add .
git commit -m "Configure infrastructure"
git push origin main
```
GitHub Actions will automatically deploy your infrastructure.

**Option B: Manual**
```bash
cd terraform
terraform init
terraform apply
```

### 4. Get Your VM IP

Check Terraform outputs or GitHub Actions logs:
```bash
terraform output instance_ip
```

Add the IP to GitHub Secrets as `VM_IP`.

### 5. Deploy Application

```bash
# Trigger deployment
git push origin main
```

Or manually:
```bash
ssh ubuntu@<VM_IP>
cd /opt/desarollo/workloads/docker-swarm
./init-swarm.sh
```

### 6. Access Your Application

- **Application**: http://YOUR_VM_IP
- **Grafana**: http://YOUR_VM_IP:3000 (admin/admin)

---

## What You Get

✅ Fully automated infrastructure on GCP  
✅ Docker Swarm orchestration  
✅ React application with Nginx  
✅ Complete CI/CD pipeline  
✅ Observability with Grafana + Loki  
✅ Automatic infrastructure diagrams  
✅ Comprehensive documentation  

---

## Next Steps

1. **Secure Your Setup**
   - Change Grafana password
   - Configure HTTPS
   - Restrict firewall rules

2. **Customize**
   - Update application code in `src/`
   - Modify infrastructure in `terraform/`
   - Adjust Docker configurations

3. **Monitor**
   - Check logs in Grafana
   - Review service health
   - Monitor resource usage

---

## Need Help?

📖 Full documentation: [/docs/RUN.md](/docs/RUN.md)  
🏗️ Architecture details: [/docs/ARCHITECTURE.md](/docs/ARCHITECTURE.md)  
✅ Deployment checklist: [/docs/DEPLOYMENT_CHECKLIST.md](/docs/DEPLOYMENT_CHECKLIST.md)  

---

**Author: Ing. Benjamín Frías — DevOps & Cloud Specialist**

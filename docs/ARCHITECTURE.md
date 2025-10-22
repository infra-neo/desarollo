# Architecture Documentation

**Author: Ing. Benjamín Frías — DevOps & Cloud Specialist**

---

## Overview

This document describes the architecture, infrastructure components, and deployment strategy for the Desarollo project.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Internet                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   GCP Load Balancer  │
              │   (Static IP)        │
              └──────────┬───────────┘
                         │
                         ▼
        ┌────────────────────────────────────┐
        │      GCP Compute Instance          │
        │      (e2-medium, Ubuntu 22.04)     │
        │                                     │
        │  ┌──────────────────────────────┐  │
        │  │     Docker Swarm Manager     │  │
        │  │                              │  │
        │  │  ┌────────────────────────┐  │  │
        │  │  │   Application Stack    │  │  │
        │  │  │  - React Frontend      │  │  │
        │  │  │  - Nginx Reverse Proxy │  │  │
        │  │  └────────────────────────┘  │  │
        │  │                              │  │
        │  │  ┌────────────────────────┐  │  │
        │  │  │  Observability Stack   │  │  │
        │  │  │  - Grafana (3000)      │  │  │
        │  │  │  - Loki (3100)         │  │  │
        │  │  │  - Promtail (agent)    │  │  │
        │  │  └────────────────────────┘  │  │
        │  └──────────────────────────────┘  │
        └────────────────────────────────────┘
```

---

## Infrastructure Components

### Cloud Provider: Google Cloud Platform (GCP)

#### Compute Resources
- **Instance Type**: e2-medium (2 vCPUs, 4GB RAM)
- **Operating System**: Ubuntu 22.04 LTS
- **Disk**: 50GB SSD persistent disk
- **Region**: us-central1
- **Zone**: us-central1-a

#### Network Configuration
- **VPC Network**: Custom VPC with custom subnet
- **Subnet**: 10.0.0.0/24 CIDR range
- **Static External IP**: Reserved static IP for consistent access
- **DNS**: Configurable for custom domain

#### Firewall Rules
1. **HTTP (80)**: Allow public access
2. **HTTPS (443)**: Allow public access
3. **SSH (22)**: Allow administrative access
4. **Docker Swarm (2377, 7946 TCP/UDP, 4789 UDP)**: Internal communication
5. **Observability (3000, 3100, 9090)**: Monitoring access

---

## Application Architecture

### Frontend Layer

#### Technology Stack
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: React Query + Context API
- **Routing**: React Router v7

#### Container Configuration
- **Base Image**: nginx:alpine
- **Build**: Multi-stage Docker build
- **Port**: 80 (internal), mapped to host
- **Replicas**: 2 (high availability)
- **Health Check**: HTTP GET /health

### Reverse Proxy Layer

#### Nginx Configuration
- **Features**:
  - SPA routing support
  - Static asset caching
  - GZIP compression
  - Security headers
  - Health check endpoint
- **Caching Strategy**:
  - Static assets: 1 year
  - HTML: No cache
  - API proxying: Pass-through

---

## Orchestration: Docker Swarm

### Swarm Configuration
- **Mode**: Single-node (manager)
- **Networks**:
  - app-network (overlay, attachable)
  - monitoring-network (overlay, attachable)

### Service Deployment Strategy
- **Update Strategy**: Rolling updates
- **Rollback**: Automatic on failure
- **Parallelism**: 1 (sequential updates)
- **Delay**: 10s between updates
- **Restart Policy**: On-failure with 3 max attempts

### Resource Management
- **CPU Limits**: Defined per service
- **Memory Limits**: Defined per service
- **Reservations**: Guaranteed minimum resources

---

## Observability Stack

### Logging: Loki + Promtail

#### Loki Configuration
- **Purpose**: Log aggregation and storage
- **Port**: 3100
- **Storage**: Filesystem (BoltDB + filesystem)
- **Retention**: 31 days
- **Index Period**: 24 hours

#### Promtail Configuration
- **Purpose**: Log collection and forwarding
- **Deployment**: Global mode (runs on all nodes)
- **Sources**:
  - Docker container logs
  - System logs (/var/log)
  - Application logs
- **Labels**: container, service, task, stream

### Visualization: Grafana

#### Configuration
- **Port**: 3000
- **Default Credentials**: admin/admin (change on first login)
- **Datasources**: Loki (pre-configured)
- **Features**:
  - Log exploration
  - Dashboard provisioning
  - Alert management
  - Plugin support

### Monitoring Flow
```
Application → Docker Logs → Promtail → Loki → Grafana
System Logs → Promtail → Loki → Grafana
```

---

## CI/CD Pipeline

### GitHub Actions Workflows

#### 1. Infrastructure Deployment
**Trigger**: Push to main (terraform/**), manual dispatch

**Steps**:
1. Terraform Init
2. Terraform Format Check
3. Terraform Validate
4. Terraform Plan
5. Terraform Apply (on main branch)
6. Output infrastructure details

**Artifacts**: Terraform plan

#### 2. Application Deployment
**Trigger**: Push to main (src/**, workloads/**), manual dispatch

**Steps**:
1. Build Docker image
2. Push to GitHub Container Registry
3. Setup SSH connection to VM
4. Initialize Docker Swarm (if needed)
5. Copy deployment files
6. Deploy application stack
7. Deploy observability stack
8. Verify deployment

**Artifacts**: Docker image

#### 3. Diagram Generation
**Trigger**: Infrastructure changes, manual dispatch

**Steps**:
1. Generate Inframap diagram
2. Generate Terravision diagram
3. Add branding footer
4. Upload artifacts
5. Commit diagrams to repository

**Artifacts**: Infrastructure diagrams (PNG)

### Deployment Flow
```
Code Push → GitHub Actions → Build Image → Deploy to Registry
                                         ↓
                            SSH to VM → Pull Image → Deploy Stack
                                         ↓
                                    Health Check → Verify
```

---

## Security Considerations

### Network Security
- **Firewall**: Restrictive rules, only necessary ports open
- **SSH Access**: Key-based authentication only
- **Internal Communication**: Isolated overlay networks
- **Static IP**: Whitelist capability for enhanced security

### Application Security
- **Container**: Non-root user, minimal base image
- **Headers**: Security headers (X-Frame-Options, X-XSS-Protection, etc.)
- **HTTPS**: Ready for TLS termination (certificate required)
- **Secrets**: Environment variables, no hardcoded credentials

### Infrastructure Security
- **IaC**: All changes tracked in Git
- **State Management**: Remote state (when configured)
- **Least Privilege**: Service accounts with minimal permissions
- **Updates**: Automated OS and package updates

---

## Scalability

### Horizontal Scaling
- **Application**: Increase replica count
- **Load Balancing**: Built-in Docker Swarm service discovery
- **Database**: External managed service (future enhancement)

### Vertical Scaling
- **Compute**: Adjust machine type via Terraform
- **Storage**: Increase disk size
- **Resources**: Adjust container limits

### Multi-Node Swarm (Future)
- Add worker nodes
- Distributed service placement
- Enhanced high availability

---

## Disaster Recovery

### Backup Strategy
- **Application Code**: Git repository
- **Infrastructure**: Terraform state
- **Configuration**: Version controlled
- **Data**: Volume snapshots (to be implemented)

### Recovery Procedures
1. **Infrastructure**: `terraform apply` to recreate
2. **Application**: Redeploy from CI/CD
3. **Data**: Restore from snapshots
4. **Configuration**: Pull from Git

### RTO/RPO Targets
- **RTO** (Recovery Time Objective): < 30 minutes
- **RPO** (Recovery Point Objective): < 1 hour

---

## Monitoring and Alerting

### Key Metrics
- **Application**:
  - Response time
  - Error rate
  - Request count
  - Container status

- **Infrastructure**:
  - CPU usage
  - Memory usage
  - Disk usage
  - Network I/O

- **Logs**:
  - Error logs
  - Access logs
  - Security events

### Alert Channels (to be configured)
- Email notifications
- Slack integration
- PagerDuty integration

---

## Cost Optimization

### Current Costs (Estimated)
- **Compute**: ~$25-30/month (e2-medium, us-central1)
- **Storage**: ~$2-5/month (50GB disk)
- **Network**: ~$1-10/month (depending on traffic)
- **Static IP**: ~$7/month

**Total**: Approximately $35-50/month

### Optimization Strategies
- Use preemptible instances for development
- Implement auto-shutdown for non-production
- Optimize Docker image sizes
- Enable log retention policies
- Use committed use discounts

---

## Future Enhancements

### Phase 2
- [ ] HTTPS with Let's Encrypt
- [ ] Custom domain configuration
- [ ] Multi-zone deployment
- [ ] Database integration (Cloud SQL)
- [ ] CDN integration (Cloud CDN)

### Phase 3
- [ ] Multi-node Swarm cluster
- [ ] Auto-scaling implementation
- [ ] Advanced monitoring (Prometheus)
- [ ] Service mesh (Istio/Linkerd)
- [ ] Kubernetes migration path

### Phase 4
- [ ] Multi-region deployment
- [ ] Disaster recovery automation
- [ ] Advanced security scanning
- [ ] Performance optimization
- [ ] Cost analytics dashboard

---

## Troubleshooting Guide

### Common Issues

#### Infrastructure
1. **Terraform errors**: Check GCP credentials and API enablement
2. **Network connectivity**: Verify firewall rules
3. **Resource limits**: Check quota limits in GCP

#### Docker Swarm
1. **Service not starting**: Check logs with `docker service logs`
2. **Network issues**: Verify overlay networks created
3. **Resource constraints**: Check container resource limits

#### Application
1. **Build failures**: Check package.json and dependencies
2. **Runtime errors**: Check application logs in Grafana
3. **Performance issues**: Check resource usage metrics

---

## Maintenance Procedures

### Regular Maintenance
- **Weekly**: Review logs for errors and warnings
- **Monthly**: Update base images and dependencies
- **Quarterly**: Review and optimize resource allocation
- **Annually**: Infrastructure audit and cost review

### Update Procedures
1. Test changes in development environment
2. Update infrastructure via Terraform
3. Deploy application via CI/CD
4. Monitor deployment health
5. Rollback if issues detected

---

## References

- [Terraform GCP Provider Documentation](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [Docker Swarm Documentation](https://docs.docker.com/engine/swarm/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Loki Documentation](https://grafana.com/docs/loki/latest/)
- [React Documentation](https://react.dev/)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

**Author: Ing. Benjamín Frías — DevOps & Cloud Specialist**

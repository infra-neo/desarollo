# Multi-Cloud Management and Machine Registration Architecture

## Overview

This document describes the architecture for the multi-cloud management interface and machine registration system, inspired by Mist.io and Teleport's approach to machine onboarding.

## Architecture Components

### 1. Frontend Components

#### CloudsPage
- **Purpose**: Central dashboard for viewing all connected cloud providers
- **Features**:
  - Display cloud connection cards (GCP, AWS, Azure, LXD, MicroCloud)
  - Show connection status and metadata
  - Statistics overview (total clouds, active connections, regions)
  - Quick actions for machine registration and infrastructure design
  - Navigation to VM listings per cloud

#### CloudVMsPage
- **Purpose**: Display and manage virtual machines for a specific cloud provider
- **Features**:
  - List all VMs with detailed information (status, specs, IPs)
  - Grid and list view modes
  - Search and filter capabilities
  - VM control actions (start, stop)
  - Statistics dashboard for resource usage

#### MachineRegistrationPage
- **Purpose**: Register on-premise machines using Headscale VPN
- **Features**:
  - Step-by-step registration wizard
  - Token generation with expiration
  - Multi-OS support (Windows, Linux, macOS)
  - Installation command generation
  - Download links for client agents

### 2. Backend Integration (Headscale)

#### What is Headscale?

Headscale is an open-source, self-hosted implementation of the Tailscale control server. It provides:
- WireGuard-based VPN mesh network
- Zero-trust network access
- Automatic NAT traversal
- Cross-platform support

#### API Endpoints Required

```typescript
// Machine Registration
POST /api/headscale/machines/register
Body: {
  name: string;
  expiresIn: number; // hours
}
Response: {
  token: string;
  expiresAt: Date;
  machineKey: string;
}

// List Registered Machines
GET /api/headscale/machines
Response: {
  machines: Array<{
    id: string;
    name: string;
    ipAddress: string;
    status: 'connected' | 'disconnected';
    lastSeen: Date;
    os: string;
    user: string;
  }>
}

// Revoke Machine
DELETE /api/headscale/machines/:id
Response: { success: boolean }

// Generate Pre-Auth Key
POST /api/headscale/preauthkeys
Body: {
  reusable: boolean;
  ephemeral: boolean;
  expiration: Date;
}
Response: {
  key: string;
  id: string;
}
```

### 3. Windows Client Agent

#### Architecture

```
┌─────────────────────────────────────────┐
│     Windows Service (Background)        │
│  - Runs as system service               │
│  - Auto-starts with Windows             │
│  - Maintains VPN connection             │
└─────────────────────────────────────────┘
                    │
                    ├──> Headscale Server
                    │    (WireGuard VPN)
                    │
                    └──> Console API
                         (Registration & Management)
```

#### Client Components

1. **Service Manager** (`neogenesys-service.exe`)
   - Windows service wrapper
   - Auto-restart on failure
   - Logging to Windows Event Log

2. **VPN Client** (`neogenesys-vpn.dll`)
   - WireGuard client library
   - Headscale protocol implementation
   - Network interface management

3. **Registration Agent** (`neogenesys-register.exe`)
   - One-time registration tool
   - Token validation
   - Machine metadata collection
   - API communication

4. **Configuration Manager**
   - Config file: `C:\ProgramData\Neogenesys\config.json`
   - Stores:
     - Headscale server URL
     - Machine credentials
     - Network settings
     - Console API endpoints

#### Installation Flow

```powershell
# 1. Download installer
Invoke-WebRequest -Uri "https://console.example.com/api/download/client/windows" `
  -OutFile "neogenesys-client.exe"

# 2. Run installer with registration token
.\neogenesys-client.exe install `
  --token="nsk_abc123..." `
  --name="office-workstation-01" `
  --server="https://headscale.example.com"

# 3. Service installs and starts automatically
# The installer will:
# - Create service: "Neogenesys VPN Client"
# - Register with Headscale
# - Configure network interface
# - Start VPN connection
# - Report to console API
```

#### Client Capabilities

1. **Network Management**
   - Establish WireGuard tunnel
   - Configure routing
   - DNS resolution
   - Firewall integration

2. **Monitoring**
   - Health checks every 30 seconds
   - Report status to console
   - Log connection events
   - Bandwidth metrics

3. **Security**
   - Encrypted credentials storage (DPAPI)
   - Certificate pinning
   - Automatic key rotation
   - Audit logging

4. **Self-Update**
   - Check for updates daily
   - Download and verify updates
   - Apply updates on restart
   - Rollback on failure

### 4. Backend Services

#### Headscale Server Setup

```yaml
# docker-compose.yml for Headscale
version: '3.8'
services:
  headscale:
    image: headscale/headscale:latest
    container_name: headscale
    volumes:
      - ./config:/etc/headscale
      - ./data:/var/lib/headscale
    ports:
      - "8080:8080"   # HTTP API
      - "50443:50443" # gRPC
    command: headscale serve
    restart: unless-stopped
```

#### Configuration

```yaml
# /etc/headscale/config.yaml
server_url: https://headscale.example.com
listen_addr: 0.0.0.0:8080
metrics_listen_addr: 127.0.0.1:9090

private_key_path: /var/lib/headscale/private.key
noise:
  private_key_path: /var/lib/headscale/noise_private.key

ip_prefixes:
  - 100.64.0.0/10

derp:
  server:
    enabled: true
    region_id: 999
    region_code: "custom"
    region_name: "Custom DERP"
    stun_listen_addr: "0.0.0.0:3478"

database:
  type: sqlite3
  sqlite:
    path: /var/lib/headscale/db.sqlite

dns_config:
  nameservers:
    - 1.1.1.1
    - 8.8.8.8
  domains: []
  magic_dns: true
  base_domain: neogenesys.local
```

### 5. API Integration

#### Console Backend (Node.js/Express Example)

```typescript
// routes/headscale.ts
import express from 'express';
import axios from 'axios';

const router = express.Router();
const HEADSCALE_URL = process.env.HEADSCALE_URL || 'http://headscale:8080';
const HEADSCALE_API_KEY = process.env.HEADSCALE_API_KEY;

// Generate registration token
router.post('/machines/register', async (req, res) => {
  const { name, expiresIn = 24 } = req.body;
  
  try {
    // Generate pre-auth key in Headscale
    const response = await axios.post(
      `${HEADSCALE_URL}/api/v1/preauthkey`,
      {
        user: req.user.id,
        reusable: false,
        ephemeral: false,
        expiration: new Date(Date.now() + expiresIn * 60 * 60 * 1000),
      },
      {
        headers: {
          'Authorization': `Bearer ${HEADSCALE_API_KEY}`,
        },
      }
    );
    
    const token = response.data.preAuthKey;
    
    // Store in database
    await db.machineTokens.create({
      userId: req.user.id,
      machineName: name,
      token,
      expiresAt: new Date(Date.now() + expiresIn * 60 * 60 * 1000),
    });
    
    res.json({
      token,
      expiresAt: new Date(Date.now() + expiresIn * 60 * 60 * 1000),
      machineKey: `mkey_${crypto.randomBytes(16).toString('hex')}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List machines
router.get('/machines', async (req, res) => {
  try {
    const response = await axios.get(
      `${HEADSCALE_URL}/api/v1/machine`,
      {
        headers: {
          'Authorization': `Bearer ${HEADSCALE_API_KEY}`,
        },
      }
    );
    
    const machines = response.data.machines
      .filter(m => m.user.name === req.user.id)
      .map(m => ({
        id: m.id,
        name: m.name,
        ipAddress: m.ipAddresses[0],
        status: m.online ? 'connected' : 'disconnected',
        lastSeen: new Date(m.lastSeen),
        os: m.os || 'unknown',
        user: m.user.name,
      }));
    
    res.json({ machines });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

## Security Considerations

### 1. Token Security
- Tokens are single-use with expiration
- Stored encrypted in database
- Transmitted over HTTPS only
- Client validates server certificate

### 2. Network Security
- WireGuard encryption for all VPN traffic
- Zero-trust model (no implicit trust)
- ACLs control machine-to-machine access
- Regular key rotation

### 3. Client Security
- Service runs with minimal privileges
- Credentials encrypted with DPAPI
- Audit logging enabled
- Update verification with signatures

### 4. API Security
- JWT authentication for API calls
- Rate limiting on registration endpoints
- IP whitelisting for Headscale server
- Regular security audits

## Deployment Guide

### 1. Deploy Headscale Server

```bash
# Create directories
mkdir -p /opt/headscale/{config,data}

# Create config file
cat > /opt/headscale/config/config.yaml << EOF
# ... (configuration from above)
EOF

# Start Headscale
docker-compose up -d headscale

# Create admin API key
docker exec headscale headscale apikeys create
```

### 2. Configure Console Backend

```bash
# Environment variables
export HEADSCALE_URL=http://headscale:8080
export HEADSCALE_API_KEY=your-api-key-here

# Update database
npm run migrate

# Start backend
npm start
```

### 3. Build Windows Client

```bash
# Prerequisites: Visual Studio 2022, WiX Toolset

# Clone client repository
git clone https://github.com/your-org/neogenesys-client-windows
cd neogenesys-client-windows

# Build
msbuild /p:Configuration=Release

# Create installer
candle installer.wxs
light installer.wixobj -out neogenesys-client.msi

# Sign installer
signtool sign /f certificate.pfx /p password neogenesys-client.msi
```

## Future Enhancements

1. **Multi-Platform Clients**
   - Linux client (systemd service)
   - macOS client (launchd service)
   - Mobile apps (iOS/Android)

2. **Advanced Features**
   - Remote shell access via console
   - File transfer capabilities
   - Screen sharing integration
   - Automated provisioning scripts

3. **Monitoring & Analytics**
   - Real-time bandwidth monitoring
   - Connection quality metrics
   - Geographic distribution map
   - Alert system for disconnections

4. **Automation**
   - Ansible playbook for deployment
   - Terraform modules for infrastructure
   - CI/CD pipeline for client builds
   - Automated testing suite

## References

- [Headscale Documentation](https://headscale.net/)
- [WireGuard Protocol](https://www.wireguard.com/)
- [Tailscale Architecture](https://tailscale.com/blog/how-tailscale-works/)
- [Teleport Documentation](https://goteleport.com/docs/)

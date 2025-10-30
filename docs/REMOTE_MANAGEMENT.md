# Remote Management Integration

## Overview

This document describes how Websoft9 and Remotely features have been integrated into the Spark UI Builder platform to create a unified remote infrastructure management solution.

## Architecture

### Component Integration

```
┌─────────────────────────────────────────────────────────────┐
│                    Neo Genesys Platform                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Workspace  │  │  Multi-Cloud │  │    Remote    │      │
│  │   Builder    │  │  Management  │  │  Management  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                ┌───────────┴──────────────┐                 │
│                │  Remote Management Core  │                 │
│                └───────────┬──────────────┘                 │
│                            │                                 │
│      ┌─────────────────────┼─────────────────────┐          │
│      │                     │                     │          │
│  ┌───▼────────┐    ┌──────▼──────┐    ┌────────▼───┐      │
│  │ Websoft9   │    │  Remotely   │    │   Native   │      │
│  │  Features  │    │   Features  │    │    SSH     │      │
│  └────────────┘    └─────────────┘    └────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Features Integration

### From Websoft9

**Application Management:**
- 200+ pre-configured open-source applications
- One-click deployment
- Application lifecycle management (install, update, remove)
- Web-based app store GUI

**System Management:**
- Web-based SSH terminal
- File manager (upload, download, edit files)
- Docker Compose GUI
- Nginx proxy manager
- User account management
- System logs and monitoring

**Use Cases:**
- Quick application deployment without CLI
- File management for non-technical users
- Visual Docker container management
- SSL certificate management via Nginx GUI

### From Remotely

**Remote Access:**
- HTML5-based remote desktop (no plugins needed)
- Unattended access capability
- Cross-platform support (Windows, Linux, macOS)
- Agent-based connection

**Remote Operations:**
- File transfer between admin and remote machine
- Remote script execution (PowerShell, Bash)
- Device monitoring and status
- Session recording and auditing

**Use Cases:**
- Remote support scenarios
- Unattended server management
- Quick troubleshooting via browser
- Multi-platform fleet management

### Native Features

**SSH/RDP:**
- Direct SSH connection for Linux/macOS
- RDP integration for Windows
- Key-based authentication support
- Connection history and favorites

## User Workflows

### Workflow 1: Create New Infrastructure

```
┌──────────────┐
│   Workspace  │  Step 1: Connect to Cloud
│              │  - GCP, AWS, Azure, LXD, MicroCloud
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Infrastructure│  Step 2: Design Infrastructure
│    Design     │  - Drag & drop blocks
│              │  - Configure VMs, networks, etc.
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Applications│  Step 3: Select Applications
│   Catalog    │  - Choose from 20+ categories
│              │  - Select apps to pre-install
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Deploy    │  Step 4: Deploy
│              │  - VM creation
│              │  - Agent installation
│              │  - App installation
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Remote    │  Step 5: Manage
│  Management  │  - Access via SSH/RDP/HTML5
│              │  - File management
│              │  - App store
└──────────────┘
```

### Workflow 2: Connect Existing Infrastructure

```
┌──────────────┐
│    Remote    │  Step 1: Select "Connect Existing"
│  Management  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Connection │  Step 2: Choose Method
│    Method    │  - Agent (recommended)
│              │  - SSH (Linux/macOS)
│              │  - RDP (Windows)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Machine   │  Step 3: Enter Details
│    Details   │  - Name, IP address, OS
│              │  - Credentials (if SSH/RDP)
└──────┬───────┘
       │
       ▼         If Agent selected
┌──────────────┐
│    Install   │  Step 4: Install Agent
│     Agent    │  - Run provided command
│              │  - Auto-installs Websoft9
│              │  - Auto-installs Remotely
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Remote    │  Step 5: Manage
│  Management  │  - Full feature access
│              │  - Unattended capability
└──────────────┘
```

## Implementation Details

### Remote Management Service

Located in `src/services/remoteManagementService.ts`, this service provides:

**Core Methods:**
```typescript
// Get all managed instances
getInstances(): Promise<RemoteInstance[]>

// Connect existing machine
connectExistingMachine(config): Promise<RemoteInstance>

// Install features
installWebsoft9(instanceId: string): Promise<void>
installRemotelyAgent(instanceId: string): Promise<{...}>

// Start sessions
startRemoteSession(instanceId: string, type: 'ssh' | 'rdp' | 'html5' | 'file-manager'): Promise<RemoteSession>

// Application management
installApplication(instanceId: string, appId: string, config?): Promise<InstalledApp>

// Remote operations
executeScript(instanceId: string, script: string, shell?): Promise<{...}>

// URL generators
getFileManagerUrl(instanceId: string): string
getTerminalUrl(instanceId: string): string
getRemoteDesktopUrl(instanceId: string): string
```

### Data Models

**RemoteInstance:**
```typescript
{
  id: string;
  name: string;
  type: 'vm' | 'physical' | 'container';
  os: 'linux' | 'windows' | 'macos';
  status: 'online' | 'offline' | 'installing';
  ipAddress: string;
  
  // Connection capabilities
  sshEnabled?: boolean;
  rdpEnabled?: boolean;
  html5Enabled?: boolean;
  
  // Feature sets
  websoft9Features?: {...};
  remotelyFeatures?: {...};
  
  // Installed applications
  installedApps?: InstalledApp[];
}
```

## Pages

### Remote Management Page (`/remote`)

**Features:**
- Grid view of all managed instances
- Status indicators (online/offline)
- Quick actions per instance
- Search and filter
- Statistics dashboard

**Quick Actions:**
- SSH Terminal
- File Manager
- Remote Desktop
- App Store
- Settings

### Connect Existing Machine Page (`/remote/connect`)

**Features:**
- Multi-step wizard
- Connection method selection
- Machine details form
- Agent installation instructions
- Progress tracking

**Connection Methods:**
1. **Agent (Recommended):**
   - Unattended access
   - Full feature set
   - HTML5 remote desktop
   
2. **SSH:**
   - Direct SSH connection
   - Key-based auth
   - Linux/macOS only
   
3. **RDP:**
   - Native RDP protocol
   - Windows only
   - Credentials required

## Installation Commands

### Linux Agent Installation

```bash
curl -s https://remote.neogenesys.com/install.sh | sudo bash -s <machine-id>
```

This script:
1. Downloads and installs Remotely agent
2. Installs Websoft9 components
3. Configures automatic startup
4. Establishes connection to platform

### Windows Agent Installation

```powershell
Invoke-WebRequest -Uri "https://remote.neogenesys.com/install.ps1" -OutFile "install.ps1"
.\install.ps1 -MachineId "<machine-id>"
```

This script:
1. Downloads Remotely agent for Windows
2. Installs Websoft9 components
3. Configures Windows Service
4. Establishes connection to platform

## Feature Matrix

| Feature | Source | Linux | Windows | macOS |
|---------|--------|-------|---------|-------|
| Web Terminal | Websoft9 | ✅ | ❌ | ✅ |
| File Manager | Websoft9 | ✅ | ✅ | ✅ |
| App Store | Websoft9 | ✅ | ✅ | ❌ |
| Docker GUI | Websoft9 | ✅ | ✅ | ✅ |
| Nginx Proxy | Websoft9 | ✅ | ❌ | ✅ |
| HTML5 Desktop | Remotely | ✅ | ✅ | ✅ |
| Unattended Access | Remotely | ✅ | ✅ | ✅ |
| File Transfer | Remotely | ✅ | ✅ | ✅ |
| Script Execution | Remotely | ✅ | ✅ | ✅ |
| Direct SSH | Native | ✅ | ❌ | ✅ |
| Direct RDP | Native | ❌ | ✅ | ❌ |

## Branding

All components use unified Neo Genesys branding:

**Colors:**
- Primary: Blue gradient (#3B82F6 to #8B5CF6)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)

**Typography:**
- Headings: Bold with gradient text
- Body: Clean sans-serif
- Code: Monospace

**Visual Elements:**
- Consistent card shadows
- Smooth transitions
- Icon-based navigation
- Color-coded status indicators

## Security Considerations

**Agent Installation:**
- Agents use secure WebSocket connections
- Certificate validation enforced
- Token-based authentication
- Session encryption

**Credentials:**
- SSH keys stored securely
- Passwords never stored in plaintext
- RDP credentials encrypted in transit
- Multi-factor authentication support

**Access Control:**
- Role-based access control (RBAC)
- Organization-level permissions
- Session logging and audit trails
- IP whitelisting support

## Next Steps

### Backend Integration

1. **Websoft9 API Integration:**
   ```typescript
   // Real implementation would use Websoft9 API
   const websoft9API = new Websoft9Client({
     endpoint: process.env.WEBSOFT9_API,
     apiKey: process.env.WEBSOFT9_KEY,
   });
   ```

2. **Remotely API Integration:**
   ```typescript
   // Real implementation would use Remotely API
   const remotelyAPI = new RemotelyClient({
     serverUrl: process.env.REMOTELY_SERVER,
     organizationId: process.env.REMOTELY_ORG,
   });
   ```

3. **SSH/RDP Proxying:**
   - WebSocket-based SSH terminal (xterm.js)
   - Guacamole for HTML5 RDP
   - File transfer via SFTP/SMB

### Additional Features

- [ ] Session recording playback
- [ ] Bulk script execution
- [ ] Scheduled maintenance windows
- [ ] Health check monitoring
- [ ] Automated backup integration
- [ ] Compliance reporting

## Troubleshooting

### Agent Won't Connect

**Symptoms:**
- Instance shows "installing" status indefinitely
- No response from remote machine

**Solutions:**
1. Check firewall rules (port 443 outbound)
2. Verify agent service is running
3. Check network connectivity
4. Review agent logs

### Feature Not Available

**Symptoms:**
- Quick action button disabled
- Feature shows as "not installed"

**Solutions:**
1. Ensure agent is fully installed
2. Check OS compatibility
3. Verify feature installation completed
4. Reinstall specific feature

### Can't Access Remote Desktop

**Symptoms:**
- HTML5 desktop shows blank screen
- Connection timeout

**Solutions:**
1. Verify display service is running
2. Check screen resolution settings
3. Ensure graphics drivers installed
4. Try reconnecting

## References

- [Websoft9 GitHub](https://github.com/Websoft9/websoft9)
- [Remotely GitHub](https://github.com/immense/Remotely)
- [Apache Guacamole](https://guacamole.apache.org/)
- [xterm.js](https://xtermjs.org/)

## Support

For issues or questions:
1. Check this documentation
2. Review service logs
3. Contact Neo Genesys support
4. Open GitHub issue

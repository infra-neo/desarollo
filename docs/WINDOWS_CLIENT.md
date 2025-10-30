# Neogenesys Windows Client Agent

## Overview

The Neogenesys Windows Client Agent is a lightweight background service that connects Windows machines to the Neogenesys multi-cloud management console via a secure Headscale VPN network.

## Features

- **Automatic Registration**: One-command installation and registration
- **Background Service**: Runs as a Windows service, no user interaction required
- **Secure VPN**: WireGuard-based encrypted mesh network via Headscale
- **Self-Monitoring**: Health checks and automatic reconnection
- **Auto-Update**: Automatic updates with rollback capability
- **Minimal Resource Usage**: < 50MB RAM, < 1% CPU

## System Requirements

- **Operating System**: Windows 10/11, Windows Server 2016+
- **Architecture**: x64
- **RAM**: Minimum 100MB available
- **Disk Space**: 50MB for installation
- **Network**: Outbound HTTPS access to Headscale server
- **Privileges**: Administrator rights for installation

## Installation

### Quick Install (Recommended)

1. Download the installer from the console:
   ```powershell
   Invoke-WebRequest -Uri "https://your-console.example.com/api/download/client/windows" `
     -OutFile "neogenesys-client.exe"
   ```

2. Run the installer with your registration token:
   ```powershell
   .\neogenesys-client.exe install `
     --token="nsk_abc123..." `
     --name="my-machine"
   ```

3. Verify installation:
   ```powershell
   Get-Service "Neogenesys VPN Client"
   ```

### Manual Installation

1. Download the MSI installer
2. Run the installer:
   ```powershell
   msiexec /i neogenesys-client.msi /quiet
   ```

3. Configure the service:
   ```powershell
   neogenesys-client configure `
     --server="https://headscale.example.com" `
     --token="nsk_abc123..."
   ```

4. Start the service:
   ```powershell
   Start-Service "Neogenesys VPN Client"
   ```

## Configuration

### Configuration File

Location: `C:\ProgramData\Neogenesys\config.json`

```json
{
  "server": {
    "headscale": "https://headscale.example.com",
    "console": "https://console.example.com"
  },
  "machine": {
    "name": "office-workstation-01",
    "id": "mkey_abc123...",
    "registeredAt": "2025-10-29T10:00:00Z"
  },
  "network": {
    "interface": "Neogenesys",
    "ipAddress": "100.64.0.5",
    "dns": ["100.64.0.1"],
    "routes": ["100.64.0.0/10"]
  },
  "monitoring": {
    "healthCheckInterval": 30,
    "reportingInterval": 60
  },
  "updates": {
    "enabled": true,
    "checkInterval": 86400,
    "autoInstall": true
  },
  "logging": {
    "level": "info",
    "location": "C:\\ProgramData\\Neogenesys\\logs",
    "maxSizeMB": 100,
    "retention": 7
  }
}
```

### Service Configuration

View service details:
```powershell
Get-Service "Neogenesys VPN Client" | Format-List *
```

Service properties:
- **Name**: `NeogenesysVPN`
- **Display Name**: `Neogenesys VPN Client`
- **Description**: `Secure VPN connection to Neogenesys management console`
- **Start Type**: Automatic (Delayed Start)
- **Recovery**: Restart the service on failure
- **Account**: LocalSystem

## Usage

### Check Status

```powershell
# Service status
Get-Service NeogenesysVPN

# Network interface status
neogenesys-client status

# Connection details
neogenesys-client info
```

### View Logs

```powershell
# Recent logs
neogenesys-client logs --tail 50

# Follow logs
neogenesys-client logs --follow

# Export logs
neogenesys-client logs --export logs.txt
```

### Restart Connection

```powershell
# Restart service
Restart-Service NeogenesysVPN

# Reconnect without restart
neogenesys-client reconnect
```

### Update Client

```powershell
# Check for updates
neogenesys-client update --check

# Install update
neogenesys-client update --install

# Update to specific version
neogenesys-client update --version 1.2.0
```

### Unregister Machine

```powershell
# Unregister from console (keeps client installed)
neogenesys-client unregister

# Complete uninstallation
.\neogenesys-client.exe uninstall
# or
msiexec /x {PRODUCT-GUID} /quiet
```

## Troubleshooting

### Service Won't Start

1. Check Windows Event Log:
   ```powershell
   Get-EventLog -LogName Application -Source "Neogenesys VPN" -Newest 10
   ```

2. Verify configuration:
   ```powershell
   neogenesys-client validate-config
   ```

3. Check permissions:
   ```powershell
   icacls "C:\ProgramData\Neogenesys"
   ```

### Connection Issues

1. Test Headscale connectivity:
   ```powershell
   Test-NetConnection -ComputerName headscale.example.com -Port 443
   ```

2. Check firewall rules:
   ```powershell
   Get-NetFirewallRule -DisplayName "Neogenesys*"
   ```

3. View connection diagnostics:
   ```powershell
   neogenesys-client diagnose
   ```

### High CPU/Memory Usage

1. Check resource usage:
   ```powershell
   Get-Process neogenesys-* | Format-Table Name, CPU, WorkingSet
   ```

2. Review configuration:
   ```powershell
   neogenesys-client config show
   ```

3. Adjust monitoring intervals in config file

### Update Failures

1. Verify update server connectivity:
   ```powershell
   Test-NetConnection -ComputerName console.example.com -Port 443
   ```

2. Check available disk space:
   ```powershell
   Get-PSDrive C | Select-Object Used, Free
   ```

3. Review update logs:
   ```powershell
   neogenesys-client logs --filter update
   ```

## Advanced Configuration

### Custom Network Routes

Edit config.json to add custom routes:

```json
{
  "network": {
    "routes": [
      "100.64.0.0/10",
      "10.0.0.0/8",
      "192.168.0.0/16"
    ]
  }
}
```

Restart service after changes:
```powershell
Restart-Service NeogenesysVPN
```

### Proxy Configuration

For environments with HTTP proxy:

```json
{
  "proxy": {
    "enabled": true,
    "url": "http://proxy.company.com:8080",
    "username": "user",
    "password": "encrypted:abc123..."
  }
}
```

### DNS Override

Custom DNS servers:

```json
{
  "network": {
    "dns": ["8.8.8.8", "8.8.4.4"],
    "dnsSearchDomains": ["company.local"]
  }
}
```

## Security

### Credential Storage

- Machine credentials are encrypted using Windows DPAPI
- Keys are protected by machine-specific entropy
- Credentials are accessible only to LocalSystem account

### Network Security

- All VPN traffic encrypted with WireGuard
- TLS 1.3 for API communication
- Certificate pinning for Headscale server
- Regular key rotation (every 90 days)

### Audit Logging

All security events are logged to Windows Event Log:
- Service start/stop
- Registration/unregistration
- Connection establishment
- Configuration changes
- Update installations

### Hardening

Recommended security settings:

1. **Firewall Rules**:
   ```powershell
   # Allow outbound to Headscale only
   New-NetFirewallRule -DisplayName "Neogenesys VPN" `
     -Direction Outbound -RemoteAddress headscale.example.com `
     -Action Allow -Program "C:\Program Files\Neogenesys\neogenesys-vpn.exe"
   ```

2. **Service Account**:
   - Consider using a dedicated service account instead of LocalSystem
   - Grant minimal required privileges

3. **File Permissions**:
   ```powershell
   # Restrict config directory
   icacls "C:\ProgramData\Neogenesys" /inheritance:r
   icacls "C:\ProgramData\Neogenesys" /grant "SYSTEM:(OI)(CI)F"
   ```

## Development

### Building from Source

Prerequisites:
- Visual Studio 2022
- .NET 8.0 SDK
- WiX Toolset 3.11
- Code signing certificate

Build steps:
```powershell
# Clone repository
git clone https://github.com/your-org/neogenesys-client-windows
cd neogenesys-client-windows

# Restore packages
dotnet restore

# Build
dotnet build -c Release

# Run tests
dotnet test

# Create installer
msbuild installer/installer.wixproj /p:Configuration=Release

# Sign binaries
signtool sign /f cert.pfx /p password /t http://timestamp.digicert.com `
  .\bin\Release\*.exe .\bin\Release\*.dll
```

### Testing

Run the test suite:
```powershell
# Unit tests
dotnet test --filter Category=Unit

# Integration tests (requires Headscale server)
dotnet test --filter Category=Integration

# Load tests
dotnet test --filter Category=Performance
```

## Support

- **Documentation**: https://docs.neogenesys.com
- **Issues**: https://github.com/your-org/neogenesys-client-windows/issues
- **Email**: support@neogenesys.com
- **Slack**: #neogenesys-support

## License

Copyright (c) 2025 Neogenesys. All rights reserved.

Licensed under the MIT License. See LICENSE file for details.

## Changelog

### Version 1.0.0 (2025-10-29)
- Initial release
- Basic VPN connectivity
- Service management
- Auto-update functionality
- Windows Event Log integration

### Roadmap

- [ ] v1.1.0: Enhanced monitoring and metrics
- [ ] v1.2.0: Remote shell support
- [ ] v1.3.0: File transfer capabilities
- [ ] v2.0.0: GUI management console

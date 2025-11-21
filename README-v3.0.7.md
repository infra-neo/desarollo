# Neogenesys Cloud v3.0.7

## Version Information
This project uses **JumpServer Client v3.0.7** (Electron-based architecture) with custom Neogenesys Cloud branding.

**Why v3.0.7?**
- This version has been tested and confirmed working
- Uses stable Electron framework
- Source: https://github.com/jumpserver/client/releases/tag/v3.0.7

## Branding Applied

All JumpServer references have been replaced with Neogenesys Cloud branding:

- **Product Name:** Neogenesys Cloud
- **App ID:** com.neogenesys.cloud
- **Author:** Neogenesys
- **Homepage:** https://neogenesys.com
- **Window Title:** Neogenesys Cloud
- **Installer Names:** Neogenesys-Cloud-Installer-*

## Build Instructions

### Prerequisites

1. **Node.js** >= 20
2. **Yarn** or **npm**
3. **Platform-specific requirements:**
   - **Windows:** Visual Studio Build Tools
   - **macOS:** Xcode Command Line Tools
   - **Linux:** Standard build tools (build-essential)

### Building the Application

1. Navigate to the UI directory:
```bash
cd jumpserver-client/ui
```

2. Install dependencies:
```bash
yarn install
# or
npm install
```

3. Build for your platform:

**Windows:**
```bash
yarn build:win
# or
npm run build:win
```

**macOS:**
```bash
yarn build:mac
# or
npm run build:mac
```

**Linux:**
```bash
yarn build:linux
# or
npm run build:linux
```

### Build Output

Installers will be generated in:
```
jumpserver-client/ui/dist/
```

**Windows:**
- `Neogenesys-Cloud-Installer-win-v3.0.7-x64.exe`
- `Neogenesys-Cloud-Installer-win-v3.0.7-x64.msi`
- `Neogenesys-Cloud-Installer-win-v3.0.7-ia32.exe`

**macOS:**
- `Neogenesys-Cloud-Installer-mac-v3.0.7-arm64.dmg`
- `Neogenesys-Cloud-Installer-mac-v3.0.7-x64.dmg`

**Linux:**
- `Neogenesys-Cloud-Installer-linux-v3.0.7-x64.deb`
- `Neogenesys-Cloud-Installer-linux-v3.0.7-arm64.deb`
- `Neogenesys-Cloud-Installer-linux-v3.0.7-x64.AppImage`
- `Neogenesys-Cloud-Installer-linux-v3.0.7-arm64.AppImage`

## Development Mode

To run in development mode:

```bash
cd jumpserver-client/ui
yarn install
yarn dev
```

## Features

- Multi-platform support (Windows, macOS, Linux)
- SSH, RDP, VNC, and database protocol support
- Asset management
- User account management
- Dark/Light theme support
- Multi-language support (English, Chinese)
- Secure credential storage

## Architecture

- **Framework:** Electron v31.0.2
- **UI Framework:** Vue 3
- **UI Library:** Naive UI
- **Build Tool:** electron-vite
- **Bundler:** electron-builder

## Go Client Component

The project also includes a Go-based client component in `jumpserver-client/go-client/` for handling protocol connections.

To build the Go client:

```bash
cd jumpserver-client/go-client
make  # On Unix/Linux/macOS
# or
.\build.ps1  # On Windows PowerShell
```

## Notes

- The application uses Electron's native capabilities for secure credential storage
- Protocol handler `jms://` is registered automatically during installation
- Logs are stored in the application's user data directory

## Support

For issues or questions related to the Neogenesys Cloud branding:
- Contact: Neogenesys support

For issues related to the underlying JumpServer client functionality:
- Original project: https://github.com/jumpserver/client
- Version: v3.0.7

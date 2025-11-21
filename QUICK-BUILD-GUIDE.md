# Quick Build Guide - Neogenesys Cloud v3.0.7

## Prerequisites ✓

Before building, ensure you have:

1. **Node.js 20+** installed
   ```bash
   node --version  # Should show v20.x.x or higher
   ```

2. **Yarn** or **npm**
   ```bash
   yarn --version  # or: npm --version
   ```

3. **Platform-specific tools:**
   - **Windows:** Visual Studio Build Tools (C++ workload)
   - **macOS:** Xcode Command Line Tools (`xcode-select --install`)
   - **Linux:** build-essential (`sudo apt-get install build-essential`)

## Quick Build Commands

### Step 1: Navigate to UI directory
```bash
cd jumpserver-client/ui
```

### Step 2: Install dependencies (first time only)
```bash
yarn install
# or
npm install
```

### Step 3: Build for your platform

**Windows (x64 and ia32):**
```bash
yarn build:win
```
Output: `dist/Neogenesys-Cloud-Installer-win-v3.0.7-{x64|ia32}.{exe|msi}`

**macOS (Intel and Apple Silicon):**
```bash
yarn build:mac
```
Output: `dist/Neogenesys-Cloud-Installer-mac-v3.0.7-{x64|arm64}.dmg`

**Linux (x64 and arm64):**
```bash
yarn build:linux
```
Output: `dist/Neogenesys-Cloud-Installer-linux-v3.0.7-{x64|arm64}.{deb|AppImage}`

## Build All Platforms (if on macOS or Linux with cross-compilation)
```bash
yarn build:win && yarn build:mac && yarn build:linux
```

## Development Mode

To test without building:
```bash
yarn dev
```
This opens the app in development mode with hot-reload.

## Clean Build

If you encounter issues:
```bash
# Remove old builds and dependencies
rm -rf dist node_modules out

# Reinstall and rebuild
yarn install
yarn build:win  # or your platform
```

## Expected Build Time

- **First build:** 5-10 minutes (includes dependency installation)
- **Subsequent builds:** 2-5 minutes
- **Development mode startup:** 30-60 seconds

## Build Output Structure

```
jumpserver-client/ui/dist/
├── Neogenesys-Cloud-Installer-win-v3.0.7-x64.exe       (Windows 64-bit)
├── Neogenesys-Cloud-Installer-win-v3.0.7-ia32.exe      (Windows 32-bit)
├── Neogenesys-Cloud-Installer-win-v3.0.7-x64.msi       (Windows MSI)
├── Neogenesys-Cloud-Installer-mac-v3.0.7-x64.dmg       (macOS Intel)
├── Neogenesys-Cloud-Installer-mac-v3.0.7-arm64.dmg     (macOS Apple Silicon)
├── Neogenesys-Cloud-Installer-linux-v3.0.7-x64.deb     (Ubuntu/Debian x64)
├── Neogenesys-Cloud-Installer-linux-v3.0.7-arm64.deb   (Ubuntu/Debian ARM)
├── Neogenesys-Cloud-Installer-linux-v3.0.7-x64.AppImage
└── Neogenesys-Cloud-Installer-linux-v3.0.7-arm64.AppImage
```

## Troubleshooting

### "electron-builder not found"
```bash
yarn add -D electron-builder
```

### "node-gyp rebuild failed"
Install platform-specific build tools (see Prerequisites).

### "EACCES: permission denied"
```bash
# macOS/Linux
sudo chown -R $(whoami) node_modules
```

### Build hangs or crashes
Try increasing Node.js memory:
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
yarn build:win
```

## Code Signing (Optional but Recommended)

For production releases, sign your binaries:

**Windows:**
Set these environment variables:
```bash
export CSC_LINK=/path/to/certificate.pfx
export CSC_KEY_PASSWORD=your_password
```

**macOS:**
```bash
export APPLEID=your@apple.id
export APPLEIDPASS=your_app_specific_password
```

Then build as normal.

## CI/CD Integration

You can automate builds using GitHub Actions. See `.github/workflows/build.yml` for the build workflow configuration.

## Post-Build

After building, test the installer on a clean system before distribution:
1. Install on a VM or test machine
2. Verify the app launches correctly
3. Test connecting to a JumpServer instance
4. Verify all branded elements appear correctly

## Support

- **Build issues:** Check `jumpserver-client/ui/package.json` for exact dependency versions
- **Platform-specific issues:** Refer to electron-builder documentation
- **General questions:** See README-v3.0.7.md

---

**Happy Building! 🚀**

Your Neogenesys Cloud installer will be ready in the `dist/` directory after a successful build.

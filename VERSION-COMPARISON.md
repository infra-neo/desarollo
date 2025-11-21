# Version Comparison: v3.0.7 vs v3.1.0

## Overview

This document compares the two versions of the JumpServer Client used in this repository.

## Version History

### v3.1.0 (Previous - Tauri-based)
- **Architecture:** Tauri (Rust backend + Vue 3 frontend)
- **Status:** Newer but NOT the version requested
- **Build System:** Tauri CLI + pnpm
- **Configuration Files:**
  - `package.json` (Node 20+, pnpm)
  - `src-tauri/tauri.conf.json`
  - `src-tauri/Cargo.toml`
  - `nuxt.config.ts`

### v3.0.7 (Current - Electron-based) ✓
- **Architecture:** Electron (Node.js + Vue 3 frontend)
- **Status:** Tested and working (user-confirmed)
- **Build System:** electron-builder + yarn/npm
- **Configuration Files:**
  - `ui/package.json`
  - `ui/electron-builder.yml`
  - `ui/electron.vite.config.ts`

## Why v3.0.7?

The user specifically requested v3.0.7 because:
1. It has been **tested and confirmed working**
2. It's from the stable releases: https://github.com/jumpserver/client/releases/tag/v3.0.7
3. Uses the mature Electron framework
4. Has proven reliability in production environments

## Key Differences

| Feature | v3.1.0 (Tauri) | v3.0.7 (Electron) |
|---------|----------------|-------------------|
| **Backend** | Rust | Node.js |
| **Framework** | Tauri 2.9.0 | Electron 31.0.2 |
| **Build Tool** | Tauri CLI | electron-builder |
| **Package Manager** | pnpm | yarn/npm |
| **UI Framework** | Nuxt 3 + Vue 3 | Vue 3 + Vite |
| **Bundle Size** | Smaller (~15MB) | Larger (~90MB) |
| **Startup Time** | Faster | Standard |
| **Platform Support** | Full | Full |
| **Maturity** | Newer | Mature |
| **Documentation** | Growing | Extensive |

## Branding Consistency

Both versions support the same Neogenesys Cloud branding:
- ✓ Product name
- ✓ App identifier
- ✓ Window titles
- ✓ Installer names
- ✓ Protocol handlers
- ✓ UI text replacements

## Build Process Comparison

### v3.1.0 (Tauri)
```bash
cd jumpserver-client
pnpm install
pnpm run tauri:build
```

### v3.0.7 (Electron) ✓ CURRENT
```bash
cd jumpserver-client/ui
yarn install
yarn build:win    # or build:mac, build:linux
```

## Migration Notes

The transition from v3.1.0 to v3.0.7 required:
1. Complete replacement of the codebase (different architectures)
2. Re-application of all Neogenesys Cloud branding
3. Updated documentation for Electron build process
4. Different file structure and configuration

## Future Considerations

- **Stick with v3.0.7:** It's tested and working
- **Monitor JumpServer releases:** Watch for new stable Electron-based releases
- **Evaluate Tauri:** Consider Tauri-based versions only after thorough testing

## Recommendation

**Use v3.0.7** as it has been verified to work correctly and uses the stable Electron framework that's well-documented and widely supported.

# JumpServer Client Testing Branch

## 🎯 Purpose

This branch is dedicated exclusively to the JumpServer client for:
- **Testing**: Evaluate the JumpServer client functionality
- **Windows Installation**: Test installation and setup on Windows environments
- **UI Testing**: Explore and test the user interface
- **Development**: Experiment with the client without affecting other branches

## 📁 Branch Structure

This branch contains **ONLY** the JumpServer client code in the `jumpserver-client/` directory.

```
jumpserver-client-testing/
├── jumpserver-client/          # Complete JumpServer client source code
│   ├── README.md              # Original JumpServer client documentation
│   ├── README_CN.md           # Chinese documentation
│   ├── package.json           # Node.js dependencies
│   ├── Makefile              # Build automation
│   ├── nuxt.config.ts        # Nuxt 3 configuration
│   ├── go-client/            # Go-based native client components
│   ├── i18n/                 # Internationalization
│   ├── src-tauri/            # Tauri (Rust) backend
│   ├── ui/                   # Vue 3 frontend components
│   └── ...                   # Additional client files
└── README-JUMPSERVER-CLIENT-TESTING.md  # This file
```

## 🚀 About JumpServer Client

The JumpServer client is a modern, cross-platform desktop application built with:
- **Tauri 2.9** (Rust backend)
- **Vue 3** (Frontend framework)
- **Nuxt UI** (Component library)
- **Go** (Native protocol handling)

### Key Features:
- ✅ Cross-platform support (Windows, macOS, Linux)
- ✅ Secure connections (SSH, RDP, VNC)
- ✅ Multi-database support (MySQL, PostgreSQL, MongoDB, etc.)
- ✅ Modern and responsive UI
- ✅ Custom protocol support (`jms://`)
- ✅ Theme support (light/dark mode)
- ✅ Internationalization

## 💻 Windows Installation & Testing

### Prerequisites

Before building or testing on Windows, ensure you have:

1. **Node.js** >= 20
   - Download from: https://nodejs.org/
   
2. **pnpm** >= 10.20.0
   ```powershell
   npm install -g pnpm
   ```

3. **Rust** (latest stable)
   - Download from: https://rustup.rs/
   - Run: `rustup-init.exe`

4. **Microsoft Visual C++ Build Tools**
   - Install Visual Studio 2022 or
   - Visual Studio Build Tools: https://visualstudio.microsoft.com/downloads/

5. **Git** (to clone this branch)
   - Download from: https://git-scm.com/

### Installation Steps for Windows

1. **Clone this branch:**
   ```powershell
   git clone https://github.com/infra-neo/desarollo.git -b jumpserver-client-testing
   cd desarollo/jumpserver-client
   ```

2. **Install dependencies:**
   ```powershell
   pnpm install
   ```

3. **Run in development mode:**
   ```powershell
   pnpm run tauri:dev
   ```

4. **Build for Windows:**
   ```powershell
   # Production build
   pnpm run tauri:build
   
   # Debug build (faster compilation)
   pnpm run tauri:build:debug
   ```

5. **Find the installer:**
   - The built installer will be in: `jumpserver-client/src-tauri/target/release/bundle/`
   - Look for `.msi` or `.exe` files

### Alternative: Download Pre-built Release

If you don't want to build from source:

1. Visit the official releases page: https://github.com/jumpserver/client/releases
2. Download the Windows installer (`.msi` or `.exe`)
3. Run the installer
4. Launch from Start Menu

## 🧪 Testing Checklist

Use this checklist to systematically test the JumpServer client:

### Installation Testing
- [ ] Installer runs without errors
- [ ] Application installs to correct location
- [ ] Start menu shortcut is created
- [ ] Desktop shortcut is created (if selected)
- [ ] Application can be launched successfully

### UI Testing
- [ ] Main window opens and displays correctly
- [ ] All menus are accessible and functional
- [ ] Theme switching (light/dark) works
- [ ] Window resizing works properly
- [ ] Interface is responsive and smooth

### Connection Testing
- [ ] SSH connection can be initiated
- [ ] RDP connection can be initiated
- [ ] VNC connection can be initiated
- [ ] Database connections work
- [ ] Custom protocol (`jms://`) launches correctly

### Feature Testing
- [ ] Asset browsing works
- [ ] Search functionality works
- [ ] Favorites can be added/removed
- [ ] Settings can be saved
- [ ] Clipboard integration works
- [ ] Notifications appear correctly

### Performance Testing
- [ ] Application starts quickly
- [ ] UI is responsive
- [ ] Memory usage is reasonable
- [ ] No crashes or freezes during use

## 📝 Development & Testing Notes

Use this section to document your findings:

### Issues Found
- Document any bugs or issues here
- Include steps to reproduce
- Note the environment (Windows version, etc.)

### Performance Observations
- Note startup time
- Memory usage
- CPU usage during operations

### UI Feedback
- Visual issues
- UX improvements
- Design suggestions

## 🔧 Common Commands

```powershell
# Install dependencies
pnpm install

# Run development server (web only)
pnpm run dev

# Run Tauri development mode (desktop app)
pnpm run tauri:dev

# Build for production
pnpm run tauri:build

# Build in debug mode (faster)
pnpm run tauri:build:debug

# Lint code
pnpm run lint

# Generate static site
pnpm run generate
```

## 📚 Documentation

For detailed information about the JumpServer client:

- **Original README**: See `jumpserver-client/README.md`
- **Chinese Documentation**: See `jumpserver-client/README_CN.md`
- **Official Docs**: https://docs.jumpserver.org/
- **GitHub Repository**: https://github.com/jumpserver/client

## 🔗 Related Links

- **JumpServer Main Project**: https://github.com/jumpserver/jumpserver
- **JumpServer Installer**: https://github.com/jumpserver/installer
- **JumpServer Documentation**: https://docs.jumpserver.org/
- **Tauri Framework**: https://tauri.app/

## 🤝 Contributing

If you find issues or have improvements:

1. Document your findings in this branch
2. Create detailed bug reports
3. Suggest improvements with screenshots
4. Share your testing results

## 📧 Support

For issues with:
- **This testing branch**: Open an issue in the infra-neo/desarollo repository
- **JumpServer client**: Open an issue in the official jumpserver/client repository

---

**Branch Created**: 2025-11-19  
**Purpose**: Testing and evaluation of JumpServer client  
**Status**: Ready for testing on Windows and other platforms

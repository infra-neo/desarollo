# Neogenesys Cloud Branding Guide

## Overview

This guide explains how to complete the branding customization for the Neogenesys Cloud client installer. The text-based branding has been updated throughout the application, but logo and icon files need to be replaced with your actual brand assets.

## What Has Been Changed

### ✅ Completed Text Branding Updates

1. **Application Name**: Changed from "JumpServerClient" to "Neogenesys Cloud"
2. **Product Identifier**: Updated to `com.neogenesys.cloud`
3. **Package Name**: Changed to `neogenesys-cloud`
4. **Author Information**: Updated to "Neogenesys" throughout
5. **Repository Links**: Updated to point to `infra-neo/desarollo`
6. **UI Text**: Updated sidebar and all visible text references
7. **Internationalization**: Updated both English and Chinese language files

### Configuration Files Updated

- `src-tauri/tauri.conf.json` - Tauri application configuration
- `package.json` - NPM package configuration
- `ui/app.config.ts` - Application configuration
- `nuxt.config.ts` - Nuxt framework configuration
- `src-tauri/Cargo.toml` - Rust/Tauri backend configuration
- `ui/components/SideBar/sideBar.vue` - Sidebar component text
- `i18n/locales/en.json` - English translations
- `i18n/locales/zh.json` - Chinese translations

## 🎨 Logo and Icon Files to Replace

To complete the branding, you need to replace the following image files with your Neogenesys Cloud branded versions:

### 1. Main Application Logo

**File**: `public/logo.png`
- **Current**: JumpServer logo
- **Required**: Neogenesys Cloud logo
- **Recommended Size**: 512x512 pixels or larger (square)
- **Format**: PNG with transparent background
- **Usage**: Displayed in the sidebar and application UI

### 2. Application Icons

All files in `src-tauri/icons/` directory:

#### Windows Icons
- **`icon.ico`** - Multi-resolution Windows icon (16x16, 32x32, 48x48, 256x256)
  - Used for: Application icon, taskbar, window title bar
  - Tool to create: https://www.imagemagick.org/ or https://convertico.com/

#### macOS Icons
- **`icon.icns`** - Multi-resolution macOS icon bundle
  - Used for: macOS application icon, Dock
  - Tool to create: https://cloudconvert.com/png-to-icns or Xcode

#### Linux Icons
- **`icon.png`** - 1024x1024 pixels - Main icon
- **`icon-appimage.png`** - 512x512 pixels - AppImage icon
- **`128x128.png`** - 128x128 pixels
- **`128x128@2x.png`** - 256x256 pixels (Retina display)
- **`32x32.png`** - 32x32 pixels

#### macOS System Tray
- **`tray-mac.png`** - 22x22 pixels - System tray icon for macOS

### 3. Asset Logo (SVG)

**File**: `ui/assets/logo.svg`
- **Current**: JumpServer SVG logo
- **Required**: Neogenesys Cloud SVG logo
- **Format**: SVG (Scalable Vector Graphics)
- **Usage**: May be used in various UI contexts where scalable graphics are preferred

## 🔧 How to Replace Logo and Icon Files

### Step 1: Prepare Your Neogenesys Cloud Logo

1. Start with a high-resolution version of your logo (at least 1024x1024 pixels)
2. Ensure the logo works well on both light and dark backgrounds
3. Save it as a PNG with a transparent background

### Step 2: Create Icon Files

#### For Windows (.ico)

Using ImageMagick (command line):
```bash
# Install ImageMagick first if not available
# On Windows: Download from https://imagemagick.org/
# On macOS: brew install imagemagick
# On Linux: sudo apt-get install imagemagick

# Create .ico file with multiple sizes
convert your-logo.png -resize 256x256 \
        \( -clone 0 -resize 16x16 \) \
        \( -clone 0 -resize 32x32 \) \
        \( -clone 0 -resize 48x48 \) \
        \( -clone 0 -resize 256x256 \) \
        -delete 0 -colors 256 icon.ico
```

Or use online tools:
- https://convertico.com/
- https://www.icoconverter.com/

#### For macOS (.icns)

Using command line (macOS only):
```bash
# Create iconset directory
mkdir MyIcon.iconset

# Generate all required sizes
sips -z 16 16     your-logo.png --out MyIcon.iconset/icon_16x16.png
sips -z 32 32     your-logo.png --out MyIcon.iconset/icon_16x16@2x.png
sips -z 32 32     your-logo.png --out MyIcon.iconset/icon_32x32.png
sips -z 64 64     your-logo.png --out MyIcon.iconset/icon_32x32@2x.png
sips -z 128 128   your-logo.png --out MyIcon.iconset/icon_128x128.png
sips -z 256 256   your-logo.png --out MyIcon.iconset/icon_128x128@2x.png
sips -z 256 256   your-logo.png --out MyIcon.iconset/icon_256x256.png
sips -z 512 512   your-logo.png --out MyIcon.iconset/icon_256x256@2x.png
sips -z 512 512   your-logo.png --out MyIcon.iconset/icon_512x512.png
sips -z 1024 1024 your-logo.png --out MyIcon.iconset/icon_512x512@2x.png

# Convert to .icns
iconutil -c icns MyIcon.iconset
```

Or use online tools:
- https://cloudconvert.com/png-to-icns
- https://anyconv.com/png-to-icns-converter/

#### For Linux (PNG files)

Using ImageMagick:
```bash
# Create all required PNG sizes
convert your-logo.png -resize 32x32 32x32.png
convert your-logo.png -resize 128x128 128x128.png
convert your-logo.png -resize 256x256 128x128@2x.png
convert your-logo.png -resize 512x512 icon-appimage.png
convert your-logo.png -resize 1024x1024 icon.png
```

### Step 3: Replace the Files

```bash
# Navigate to jumpserver-client directory
cd /path/to/desarollo/jumpserver-client

# Replace main logo
cp /path/to/your-logo.png public/logo.png

# Replace icons
cp /path/to/your-icons/icon.ico src-tauri/icons/icon.ico
cp /path/to/your-icons/icon.icns src-tauri/icons/icon.icns
cp /path/to/your-icons/32x32.png src-tauri/icons/32x32.png
cp /path/to/your-icons/128x128.png src-tauri/icons/128x128.png
cp /path/to/your-icons/128x128@2x.png src-tauri/icons/128x128@2x.png
cp /path/to/your-icons/icon.png src-tauri/icons/icon.png
cp /path/to/your-icons/icon-appimage.png src-tauri/icons/icon-appimage.png
cp /path/to/your-icons/tray-mac.png src-tauri/icons/tray-mac.png

# If you have an SVG version
cp /path/to/your-logo.svg ui/assets/logo.svg
```

### Step 4: Commit the Changes

```bash
git add public/logo.png
git add src-tauri/icons/*
git add ui/assets/logo.svg
git commit -m "Update branding: Replace logos and icons with Neogenesys Cloud branding"
```

## 🏗️ Building the Windows Installer

### Prerequisites

Ensure you have installed:
1. **Node.js** >= 20
2. **pnpm** >= 10.20.0
3. **Rust** (latest stable)
4. **Microsoft Visual C++ Build Tools** or Visual Studio 2022

### Build Steps

```bash
# Navigate to jumpserver-client directory
cd /path/to/desarollo/jumpserver-client

# Install dependencies
pnpm install

# Build for Windows production
pnpm run tauri:build

# Or build in debug mode (faster for testing)
pnpm run tauri:build:debug
```

### Find Your Installer

After building, the installer will be located at:
- **MSI Installer**: `src-tauri/target/release/bundle/msi/`
- **NSIS Installer**: `src-tauri/target/release/bundle/nsis/`

Look for files like:
- `Neogenesys Cloud_3.1.0_x64_en-US.msi`
- `Neogenesys Cloud_3.1.0_x64-setup.exe`

## 🧪 Testing the Branded Installer

1. **Install the application**
   ```powershell
   # Run the MSI installer
   .\Neogenesys Cloud_3.1.0_x64_en-US.msi
   ```

2. **Verify branding**
   - Check the installer window shows "Neogenesys Cloud"
   - Check Start Menu shortcut name
   - Check application icon in taskbar
   - Launch application and verify:
     - Window title shows "Neogenesys Cloud"
     - Sidebar shows "Neogenesys" text
     - Logo is your Neogenesys Cloud logo
     - About/Settings show correct company name

3. **Test functionality**
   - Verify all features work as expected
   - Test SSH, RDP, and database connections
   - Check settings persistence

## 📋 Branding Checklist

Use this checklist to ensure complete branding:

### Text Branding
- [x] Application name updated in all config files
- [x] Product identifier changed
- [x] Package name updated
- [x] Author/Company name updated everywhere
- [x] Repository URLs updated
- [x] UI component text updated
- [x] Translation files updated (EN and ZH)

### Visual Branding
- [ ] Replace `public/logo.png` with Neogenesys Cloud logo
- [ ] Replace `src-tauri/icons/icon.ico` (Windows)
- [ ] Replace `src-tauri/icons/icon.icns` (macOS)
- [ ] Replace all PNG icon files in `src-tauri/icons/`
- [ ] Replace `ui/assets/logo.svg` (if available)
- [ ] Test all icons display correctly

### Build & Test
- [ ] Successfully build Windows installer
- [ ] Test installer on Windows machine
- [ ] Verify all branding appears correctly
- [ ] Test core functionality
- [ ] Distribute to clients for testing

## 🔒 Security Notes

This branding customization is designed for security when distributing to clients:
- The rebranded application will show only Neogenesys Cloud branding
- No references to the original JumpServer project appear in the UI
- Clients will see a professional, branded application
- Technical documentation still credits the original open-source project

## 📚 Additional Resources

- **Tauri Documentation**: https://tauri.app/
- **Icon Guidelines**: https://tauri.app/v1/guides/features/icons
- **Windows Icon Guide**: https://learn.microsoft.com/en-us/windows/apps/design/style/iconography/app-icon-construction
- **macOS Icon Guide**: https://developer.apple.com/design/human-interface-guidelines/app-icons

## 🆘 Support

For issues or questions:
- Check the build logs in `src-tauri/target/`
- Review Tauri documentation at https://tauri.app/
- Ensure all prerequisites are correctly installed
- Verify icon files are in correct formats and sizes

---

**Version**: 1.0  
**Last Updated**: 2025-11-19  
**Branch**: branding

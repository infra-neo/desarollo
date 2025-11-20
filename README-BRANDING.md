# Neogenesys Cloud - Branding Branch

Este branch contiene la versión personalizada del cliente JumpServer con el branding de **Neogenesys Cloud**. Esta personalización fue creada con fines de seguridad para proporcionar instaladores a clientes sin exponer referencias al proyecto original.

This branch contains the customized version of the JumpServer client with **Neogenesys Cloud** branding. This customization was created for security purposes to provide installers to clients without exposing references to the original project.

## 🎨 Cambios de Branding / Branding Changes

### ✅ Completado / Completed

1. **Nombre de la aplicación** → "Neogenesys Cloud"
2. **Identificador del producto** → `com.neogenesys.cloud`
3. **Nombre del paquete** → `neogenesys-cloud`
4. **Información del autor** → "Neogenesys"
5. **Texto de la interfaz** → Actualizado en todos los componentes
6. **Archivos de internacionalización** → Actualizados (inglés y chino)
7. **Configuraciones** → Todas las configuraciones actualizadas

### 📝 Pendiente / Pending

Para completar el branding, necesitas reemplazar los archivos de logotipo e iconos con tus propios diseños de marca de Neogenesys Cloud.

To complete the branding, you need to replace the logo and icon files with your own Neogenesys Cloud brand designs.

**Archivos a reemplazar / Files to replace:**
- `jumpserver-client/public/logo.png` - Logo principal de la aplicación
- `jumpserver-client/src-tauri/icons/icon.ico` - Icono de Windows
- `jumpserver-client/src-tauri/icons/icon.icns` - Icono de macOS
- `jumpserver-client/src-tauri/icons/*.png` - Iconos de Linux en varios tamaños
- `jumpserver-client/ui/assets/logo.svg` - Logo en formato SVG

## 📖 Documentación / Documentation

Lee la guía completa de branding para instrucciones detalladas:

Read the complete branding guide for detailed instructions:

**→ [BRANDING-GUIDE.md](./BRANDING-GUIDE.md)**

La guía incluye:
- Lista completa de cambios realizados
- Instrucciones paso a paso para reemplazar logotipos
- Herramientas recomendadas para crear archivos de iconos
- Instrucciones de compilación para Windows
- Lista de verificación de branding

The guide includes:
- Complete list of changes made
- Step-by-step instructions for replacing logos
- Recommended tools for creating icon files
- Build instructions for Windows
- Branding checklist

## 🚀 Inicio Rápido / Quick Start

### 1. Preparar Logotipos / Prepare Logos

Opción A: Usar script de placeholders (requiere Python + Pillow):
```bash
pip install Pillow
python3 create_placeholder_logos.py
```

Opción B: Crear tus propios logotipos manualmente siguiendo [BRANDING-GUIDE.md](./BRANDING-GUIDE.md)

Option A: Use placeholder script (requires Python + Pillow):
```bash
pip install Pillow
python3 create_placeholder_logos.py
```

Option B: Create your own logos manually following [BRANDING-GUIDE.md](./BRANDING-GUIDE.md)

### 2. Construir para Windows / Build for Windows

```bash
cd jumpserver-client

# Instalar dependencias / Install dependencies
pnpm install

# Compilar versión de producción / Build production version
pnpm run tauri:build

# O compilar en modo debug (más rápido) / Or build debug mode (faster)
pnpm run tauri:build:debug
```

### 3. Encontrar el Instalador / Find the Installer

El instalador se generará en:
```
jumpserver-client/src-tauri/target/release/bundle/msi/
jumpserver-client/src-tauri/target/release/bundle/nsis/
```

Busca archivos como:
- `Neogenesys Cloud_3.1.0_x64_en-US.msi`
- `Neogenesys Cloud_3.1.0_x64-setup.exe`

## 💻 Requisitos Previos / Prerequisites

Para compilar en Windows:

1. **Node.js** >= 20
2. **pnpm** >= 10.20.0
   ```powershell
   npm install -g pnpm
   ```
3. **Rust** (última versión estable)
   - Descargar de: https://rustup.rs/
4. **Microsoft Visual C++ Build Tools**
   - Visual Studio 2022 o Build Tools

For building on Windows:

1. **Node.js** >= 20
2. **pnpm** >= 10.20.0
   ```powershell
   npm install -g pnpm
   ```
3. **Rust** (latest stable)
   - Download from: https://rustup.rs/
4. **Microsoft Visual C++ Build Tools**
   - Visual Studio 2022 or Build Tools

## 🔒 Propósito de Seguridad / Security Purpose

Este branding personalizado permite:
- Distribuir el instalador a clientes sin exponer el proyecto original
- Presentar una interfaz profesional con tu marca
- Proteger tu proyecto mediante la marca personalizada
- Mantener la funcionalidad completa del cliente

This custom branding allows you to:
- Distribute the installer to clients without exposing the original project
- Present a professional interface with your brand
- Protect your project through custom branding
- Maintain full client functionality

## 📁 Estructura del Branch / Branch Structure

```
desarollo/
├── BRANDING-GUIDE.md                    # Guía completa de branding
├── README-BRANDING.md                   # Este archivo
├── create_placeholder_logos.py          # Script para crear logos placeholder
└── jumpserver-client/                   # Cliente personalizado
    ├── package.json                     # Actualizado con branding
    ├── nuxt.config.ts                   # Configuración Nuxt actualizada
    ├── src-tauri/
    │   ├── tauri.conf.json             # Configuración Tauri actualizada
    │   ├── Cargo.toml                  # Configuración Rust actualizada
    │   └── icons/                      # Iconos a reemplazar
    ├── ui/
    │   ├── app.config.ts               # Config de app actualizada
    │   ├── assets/logo.svg             # Logo SVG a reemplazar
    │   └── components/
    │       └── SideBar/sideBar.vue     # Texto actualizado
    ├── i18n/locales/
    │   ├── en.json                     # Traducciones EN actualizadas
    │   └── zh.json                     # Traducciones ZH actualizadas
    └── public/
        └── logo.png                    # Logo principal a reemplazar
```

## 🧪 Probar el Instalador / Testing the Installer

1. **Compilar** / Build:
   ```bash
   cd jumpserver-client
   pnpm run tauri:build
   ```

2. **Instalar** / Install:
   ```powershell
   .\Neogenesys Cloud_3.1.0_x64_en-US.msi
   ```

3. **Verificar branding** / Verify branding:
   - ✓ Título de ventana muestra "Neogenesys Cloud"
   - ✓ Barra lateral muestra "Neogenesys"
   - ✓ Logo es el de Neogenesys Cloud
   - ✓ Acceso directo en menú Inicio con nombre correcto
   - ✓ Icono correcto en la barra de tareas

4. **Probar funcionalidad** / Test functionality:
   - ✓ Conexiones SSH funcionan
   - ✓ Conexiones RDP funcionan
   - ✓ Conexiones de base de datos funcionan
   - ✓ Configuraciones se guardan correctamente

## 📞 Soporte / Support

Para preguntas o problemas:
- Revisa [BRANDING-GUIDE.md](./BRANDING-GUIDE.md) para instrucciones detalladas
- Verifica que todos los requisitos previos estén instalados
- Revisa los logs de compilación en `src-tauri/target/`

For questions or issues:
- Review [BRANDING-GUIDE.md](./BRANDING-GUIDE.md) for detailed instructions
- Verify all prerequisites are installed
- Check build logs in `src-tauri/target/`

## 🎯 Próximos Pasos / Next Steps

1. [ ] Reemplazar archivos de logotipo con diseños de marca reales
2. [ ] Compilar instalador de Windows
3. [ ] Probar instalador en máquina Windows
4. [ ] Distribuir a clientes para pruebas
5. [ ] Recopilar comentarios y ajustar según sea necesario

1. [ ] Replace logo files with actual brand designs
2. [ ] Build Windows installer
3. [ ] Test installer on Windows machine
4. [ ] Distribute to clients for testing
5. [ ] Gather feedback and adjust as needed

---

**Branch**: branding  
**Versión**: 3.1.0  
**Última actualización / Last updated**: 2025-11-19

# Comparación Antes/Después - Before/After Comparison

## Cambios de Branding / Branding Changes

### 1. Nombre de la Aplicación / Application Name

**ANTES / BEFORE:**
```
productName: "JumpServerClient"
```

**DESPUÉS / AFTER:**
```
productName: "Neogenesys Cloud"
```

---

### 2. Identificador del Producto / Product Identifier

**ANTES / BEFORE:**
```
identifier: "com.jumpserver.client"
```

**DESPUÉS / AFTER:**
```
identifier: "com.neogenesys.cloud"
```

---

### 3. Nombre del Paquete NPM / NPM Package Name

**ANTES / BEFORE:**
```json
{
  "name": "jumpserver-client",
  "description": "JumpServer client tool",
  "author": "JumpServer"
}
```

**DESPUÉS / AFTER:**
```json
{
  "name": "neogenesys-cloud",
  "description": "Neogenesys Cloud client tool",
  "author": "Neogenesys"
}
```

---

### 4. Configuración Rust (Cargo.toml)

**ANTES / BEFORE:**
```toml
[package]
name = "JumpServerClient"
description = "JumpServer client tool"
authors = [ "JumpServer" ]
repository = "https://github.com/jumpserver/clients"

[lib]
name = "jumpserver_client_lib"
```

**DESPUÉS / AFTER:**
```toml
[package]
name = "NeogenesysCloud"
description = "Neogenesys Cloud client tool"
authors = [ "Neogenesys" ]
repository = "https://github.com/infra-neo/desarollo"

[lib]
name = "neogenesys_cloud_lib"
```

---

### 5. Configuración de la App / App Configuration

**ANTES / BEFORE:**
```typescript
export default defineAppConfig({
  app: {
    name: "JumpServer Client",
    author: "JumpServer",
    version: "3.1.0",
    repo: "https://github.com/jumpserver/clients"
  }
})
```

**DESPUÉS / AFTER:**
```typescript
export default defineAppConfig({
  app: {
    name: "Neogenesys Cloud",
    author: "Neogenesys",
    version: "3.1.0",
    repo: "https://github.com/infra-neo/desarollo"
  }
})
```

---

### 6. Título de Página / Page Title

**ANTES / BEFORE:**
```typescript
app: {
  head: {
    title: "JumpServer Client",
  }
}
```

**DESPUÉS / AFTER:**
```typescript
app: {
  head: {
    title: "Neogenesys Cloud",
  }
}
```

---

### 7. Texto del Sidebar / Sidebar Text

**ANTES / BEFORE:**
```vue
<template>
  <div class="flex items-center gap-2" v-if="!isMacOS && !collapse">
    <UAvatar size="sm" src="/logo.png" />
    <span class="text-sm">JumpServer</span>
  </div>
</template>
```

**DESPUÉS / AFTER:**
```vue
<template>
  <div class="flex items-center gap-2" v-if="!isMacOS && !collapse">
    <UAvatar size="sm" src="/logo.png" />
    <span class="text-sm">Neogenesys</span>
  </div>
</template>
```

---

### 8. Mensajes de Internacionalización / Internationalization Messages

**ANTES / BEFORE (en.json):**
```json
{
  "VersionIncompatible": "The client version is incompatible with JumpServer versions...",
  "VersionNoMatch": "The client version does not match the JumpServer version..."
}
```

**DESPUÉS / AFTER (en.json):**
```json
{
  "VersionIncompatible": "The client version is incompatible with server versions...",
  "VersionNoMatch": "The client version does not match the server version..."
}
```

**ANTES / BEFORE (zh.json):**
```json
{
  "VersionIncompatible": "客户端与JumpServer 版本...",
  "VersionNoMatch": "客户端与 JumpServer 版本不匹配..."
}
```

**DESPUÉS / AFTER (zh.json):**
```json
{
  "VersionIncompatible": "客户端与服务器版本...",
  "VersionNoMatch": "客户端与服务器版本不匹配..."
}
```

---

## HTML Generado / Generated HTML

**ANTES / BEFORE:**
```html
<!DOCTYPE html>
<html>
  <head>
    <title>JumpServer Client</title>
    ...
  </head>
  ...
</html>
```

**DESPUÉS / AFTER:**
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Neogenesys Cloud</title>
    ...
  </head>
  ...
</html>
```

---

## Instalador de Windows / Windows Installer

**ANTES / BEFORE:**
```
JumpServerClient_3.1.0_x64_en-US.msi
JumpServerClient_3.1.0_x64-setup.exe
```

**DESPUÉS / AFTER:**
```
Neogenesys Cloud_3.1.0_x64_en-US.msi
Neogenesys Cloud_3.1.0_x64-setup.exe
```

---

## Menú de Inicio de Windows / Windows Start Menu

**ANTES / BEFORE:**
```
📁 Inicio > Todos los programas > JumpServerClient
```

**DESPUÉS / AFTER:**
```
📁 Inicio > Todos los programas > Neogenesys Cloud
```

---

## Barra de Tareas / Taskbar

**ANTES / BEFORE:**
- Icono: JumpServer logo
- Nombre: "JumpServerClient"

**DESPUÉS / AFTER:**
- Icono: Neogenesys Cloud logo (pendiente de actualizar)
- Nombre: "Neogenesys Cloud"

---

## Ventana de la Aplicación / Application Window

**ANTES / BEFORE:**
```
┌─────────────────────────────────────┐
│ JumpServerClient                 ⚊ ❑ ✕│
├─────────────────────────────────────┤
│ 🔷 JumpServer                       │
│                                     │
│ 🔍 Search...                        │
│                                     │
│ 📦 Resource                         │
│   🐧 Linux                          │
│   🪟 Windows                        │
│   🗄️ Database                       │
└─────────────────────────────────────┘
```

**DESPUÉS / AFTER:**
```
┌─────────────────────────────────────┐
│ Neogenesys Cloud              ⚊ ❑ ✕│
├─────────────────────────────────────┤
│ 🔷 Neogenesys                       │
│                                     │
│ 🔍 Search...                        │
│                                     │
│ 📦 Resource                         │
│   🐧 Linux                          │
│   🪟 Windows                        │
│   🗄️ Database                       │
└─────────────────────────────────────┘
```

---

## Resumen de Impacto / Impact Summary

### ✅ Cambios Realizados / Changes Made:
- 8 archivos de configuración actualizados
- 4 archivos de documentación creados
- 1 script de generación de logos creado
- 0 referencias a "JumpServer" en UI visible
- 100% branding de texto completado

### 📝 Próximos Pasos / Next Steps:
1. Reemplazar archivos de logo (público/logo.png)
2. Actualizar iconos (.ico, .icns, .png)
3. Compilar instalador de Windows
4. Probar y distribuir

### 🎯 Objetivo / Goal:
Proporcionar instaladores con marca "Neogenesys Cloud" a clientes sin exponer referencias al proyecto JumpServer original por motivos de seguridad.

Provide "Neogenesys Cloud" branded installers to clients without exposing references to the original JumpServer project for security purposes.

---

**Fecha / Date**: 2025-11-19  
**Branch**: branding  
**Estado / Status**: ✓ Configuración completa / Configuration complete

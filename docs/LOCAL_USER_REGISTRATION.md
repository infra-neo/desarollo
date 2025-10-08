# Registro de Usuarios Locales

## Descripción

Esta funcionalidad permite registrar nuevos usuarios y almacenarlos localmente en el navegador usando `localStorage`. Los usuarios registrados localmente pueden iniciar sesión en la aplicación sin necesidad de conectarse a un backend.

## Características

- ✅ Registro de nuevos usuarios con validación de datos
- ✅ Almacenamiento local en `localStorage` del navegador
- ✅ Inicio de sesión automático después del registro
- ✅ Soporte para login con usuarios locales como fallback si la API falla
- ✅ Validación de contraseñas (mínimo 8 caracteres, debe contener mayúsculas, minúsculas y números)
- ✅ Verificación de correos duplicados

## Cómo Usar

### Registrar un Nuevo Usuario

1. Navega a la página de autenticación (`/auth`)
2. Haz clic en "¿No tienes cuenta? Regístrate"
3. Completa el formulario con:
   - Nombre completo (mínimo 3 caracteres)
   - Correo electrónico válido
   - Contraseña (mínimo 8 caracteres, con mayúsculas, minúsculas y números)
   - Confirmación de contraseña
4. Haz clic en "Crear Cuenta"
5. Serás registrado y automáticamente iniciado sesión

### Iniciar Sesión con Usuario Local

1. Navega a la página de autenticación (`/auth`)
2. Ingresa el correo y contraseña del usuario registrado localmente
3. Haz clic en "Iniciar Sesión"
4. Si la API no responde, el sistema intentará autenticar con los usuarios locales

## Estructura de Datos

### Almacenamiento en localStorage

Los usuarios registrados se almacenan en la clave `local_registered_users` como un array JSON:

```json
[
  {
    "id": "uuid-generado",
    "name": "Nombre del Usuario",
    "email": "usuario@ejemplo.com",
    "password": "contraseña",
    "enterpriseGuid": "",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
]
```

⚠️ **Nota de Seguridad**: En esta implementación de desarrollo, las contraseñas se almacenan en texto plano. En un entorno de producción, se deben hashear las contraseñas antes de almacenarlas.

## Archivos Modificados

### Nuevos Archivos

- `src/data/users.ts` - Funciones para gestionar usuarios locales en localStorage

### Archivos Modificados

- `src/services/auth.ts` - Añadido método `register()` y fallback a usuarios locales en `login()`
- `src/services/user.ts` - Fallback para obtener datos de usuario desde localStorage
- `src/context/AuthContext.tsx` - Añadido método `register()` y lógica para manejar usuarios locales
- `src/hooks/auth/useAuthForm.ts` - Soporte para alternar entre login y registro
- `src/pages/AuthPage.tsx` - Habilitado UI de registro (descomentado toggle button)

## API de Funciones

### `src/data/users.ts`

#### `getLocalUsers(): LocalUser[]`
Obtiene todos los usuarios registrados desde localStorage.

#### `saveLocalUsers(users: LocalUser[]): void`
Guarda un array de usuarios en localStorage.

#### `addLocalUser(user: Omit<LocalUser, "id" | "createdAt">): LocalUser`
Registra un nuevo usuario local. Genera un ID único y fecha de creación automáticamente.

**Errores**: Lanza un error si el email ya está registrado.

#### `findLocalUser(email: string, password: string): LocalUser | null`
Busca un usuario por email y contraseña.

**Retorna**: El usuario si existe, `null` en caso contrario.

## Estrategia de Autenticación

1. **Registro**: Los usuarios se guardan directamente en localStorage
2. **Login**: 
   - Primero intenta autenticar con la API del backend
   - Si la API falla, busca en usuarios locales
   - Si encuentra coincidencia local, autentica al usuario

Esta estrategia permite que la aplicación funcione tanto con backend como en modo standalone con usuarios locales.

## Limitaciones

- ⚠️ Las contraseñas no están hasheadas (solo para desarrollo)
- ⚠️ Los datos se pierden si se limpia el localStorage del navegador
- ⚠️ No hay sincronización entre dispositivos
- ⚠️ Limitado al almacenamiento del navegador (~5-10MB típicamente)

## Mejoras Futuras Recomendadas

1. Implementar hash de contraseñas usando bcrypt o similar
2. Añadir opción para exportar/importar usuarios
3. Sincronización con backend cuando esté disponible
4. Límite de intentos de login fallidos
5. Recuperación de contraseña para usuarios locales

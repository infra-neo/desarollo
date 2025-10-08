# Swagger UI - API Explorer

Esta funcionalidad proporciona una interfaz gráfica interactiva para explorar y ejecutar endpoints de API definidos en una especificación OpenAPI/Swagger.

## Características

- 📋 **Visualización de Endpoints**: Muestra todos los endpoints organizados por tags (Compute, Storage, Users, etc.)
- 🎨 **Métodos HTTP con Colores**: Cada método (GET, POST, PUT, DELETE, PATCH) tiene un color distintivo
- 🔍 **Búsqueda en Tiempo Real**: Filtra endpoints por nombre, ruta o descripción
- 📝 **Formularios Dinámicos**: Genera automáticamente formularios para parámetros y request body
- ▶️ **Ejecución Directa**: Ejecuta endpoints directamente desde el navegador
- 📊 **Visualización de Respuestas**: Muestra las respuestas JSON formateadas
- ⚠️ **Manejo de Errores**: Mensajes de error claros cuando las peticiones fallan

## Estructura de Archivos

```
src/
├── components/
│   └── swagger/
│       ├── EndpointCard.tsx       # Tarjeta individual para cada endpoint
│       └── EndpointExecutor.tsx   # Formulario y ejecución de endpoints
├── hooks/
│   └── useSwaggerSpec.ts          # Hook para cargar y parsear Swagger
├── pages/
│   └── SwaggerUIPage.tsx          # Página principal del API Explorer
├── types/
│   ├── swagger.types.ts           # Tipos TypeScript para Swagger
│   └── swagger-client.d.ts        # Declaraciones de tipos para swagger-client
└── public/
    └── swagger.json               # Especificación OpenAPI/Swagger
```

## Uso

### 1. Acceder a la Página

Navega a `/swagger-ui` en la aplicación (requiere autenticación).

### 2. Explorar Endpoints

Los endpoints se agrupan automáticamente por tags. Cada endpoint muestra:
- Método HTTP (GET, POST, PUT, DELETE)
- Ruta del endpoint
- Resumen/nombre del endpoint
- Descripción

### 3. Expandir Detalles

Haz clic en el botón de chevron (▼) para ver los parámetros y el schema del request body.

### 4. Ejecutar un Endpoint

1. Haz clic en el botón "▶ Ejecutar"
2. Completa los parámetros requeridos en el formulario
3. Haz clic en "Ejecutar" en el panel emergente
4. La respuesta se mostrará debajo del formulario

### 5. Buscar Endpoints

Usa la barra de búsqueda para filtrar endpoints por:
- Nombre del endpoint
- Ruta
- Descripción

## Configuración del Swagger

### Archivo swagger.json

El archivo debe estar ubicado en `/public/swagger.json` y seguir la especificación OpenAPI 3.0.

Ejemplo de estructura:

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Mi API",
    "version": "1.0.0"
  },
  "tags": [
    {
      "name": "Compute",
      "description": "Operaciones de computación"
    }
  ],
  "paths": {
    "/mi-endpoint": {
      "get": {
        "summary": "Obtener datos",
        "tags": ["Compute"],
        "parameters": [...],
        "responses": {...}
      }
    }
  }
}
```

### URL Personalizada

Para usar una URL diferente para el Swagger, modifica el hook:

```typescript
const { groupedEndpoints, loading, error } = useSwaggerSpec("/ruta/personalizada.json");
```

## Componentes Principales

### EndpointCard

Muestra la información de un endpoint individual y permite expandir detalles o ejecutarlo.

### EndpointExecutor

Componente que:
- Genera formularios dinámicos basados en parámetros del endpoint
- Construye la petición HTTP con los datos del formulario
- Ejecuta la petición usando axios
- Muestra la respuesta o error

### useSwaggerSpec Hook

Custom hook que:
- Carga la especificación Swagger
- Parsea los endpoints
- Agrupa por tags
- Maneja estados de carga y error

## Dependencias

- `swagger-client`: Para leer y parsear especificaciones OpenAPI/Swagger
- `axios`: Para ejecutar peticiones HTTP
- `react-hook-form`: Para gestión de formularios (opcional)
- `sonner`: Para notificaciones toast

## Próximas Mejoras

- [ ] Soporte para autenticación (API keys, OAuth)
- [ ] Historial de peticiones ejecutadas
- [ ] Exportar/importar colecciones de peticiones
- [ ] Modo oscuro
- [ ] Generación de código (curl, JavaScript, Python)

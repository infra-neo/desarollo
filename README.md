# Desarollo - Full-Stack Application with DevOps Automation

**Author: Ing. Benjamín Frías — DevOps & Cloud Specialist**

---

## Overview

This project is a comprehensive full-stack application with automated DevOps infrastructure, featuring:
- React TypeScript frontend
- Terraform-based GCP infrastructure
- Docker Swarm orchestration
- Complete CI/CD pipelines
- Observability stack (Loki, Promtail, Grafana)
- Automated infrastructure diagrams

---

## Project Structure

```
desarollo/
├── input/                    # Input configuration templates
│   ├── docker-compose.yml    # Docker Swarm stack configuration
│   ├── arch.yaml             # Architecture configuration
│   └── prompt.md             # Deployment instructions
├── terraform/                # Infrastructure as Code
│   ├── main.tf               # Main Terraform configuration
│   ├── variables.tf          # Terraform variables
│   ├── outputs.tf            # Terraform outputs
│   └── modules/              # Terraform modules
│       ├── compute/          # GCP compute instance
│       ├── network/          # VPC and networking
│       └── firewall/         # Firewall rules
├── workloads/                # Application workloads
│   ├── docker-swarm/         # Docker Swarm scripts
│   │   ├── init-swarm.sh     # Initialize Docker Swarm
│   │   ├── deploy-stack.sh   # Deploy stack
│   │   └── remove-stack.sh   # Remove stack
│   └── stacks/               # Docker stack definitions
│       ├── app-stack.yml     # Application stack
│       └── observability-stack.yml  # Monitoring stack
├── pipelines/                # CI/CD pipelines
│   └── .github/workflows/    # GitHub Actions workflows
├── diagrams/                 # Infrastructure diagrams
│   ├── generate-diagrams.sh  # Diagram generation script
│   └── output/               # Generated diagrams
├── observability/            # Observability configurations
│   ├── loki/                 # Loki log aggregation
│   ├── promtail/             # Promtail log collection
│   └── grafana/              # Grafana dashboards
├── src/                      # React application source
└── docs/                     # Documentation
```

---

## Quick Start

See [/docs/RUN.md](/docs/RUN.md) for detailed step-by-step execution instructions.

---

## Recent Fixes and Improvements

### Error Corrections (October 2025)

**1. TypeError in DashboardGrid Component**
- **Issue**: Calling `.filter()` on potentially undefined `servers` array causing runtime errors
- **Fix**: Added safety check using `Array.isArray()` to ensure servers is always a valid array before filtering
- **Location**: `src/components/dashboard/DashboardGrid.tsx`

**2. Error Boundary Implementation**
- **Issue**: Unhandled runtime errors could crash the entire application
- **Fix**: Implemented a comprehensive ErrorBoundary component with user-friendly error messages
- **Location**: `src/components/common/ErrorBoundary.tsx`
- **Impact**: Application now gracefully handles errors and provides recovery options

**3. SwaggerUIPage Filter Safety**
- **Issue**: Potential runtime errors when filtering endpoints with null/undefined properties
- **Fix**: Added null-safe checks using optional chaining in filter operations
- **Location**: `src/pages/SwaggerUIPage.tsx`

**4. Environment Configuration**
- **Added**: `.env.example` file documenting required environment variables
- **Variable**: `VITE_URL_API` for API base URL configuration
- **Location**: `.env.example`

**5. Favicon and Icon Handling**
- **Issue**: 404 errors for missing favicon.ico and apple-touch-icon files
- **Fix**: Added favicon.svg and nginx configuration to handle these requests gracefully
- **Location**: `public/favicon.svg` and `nginx.conf`

**6. Build and Linting**
- All TypeScript compilation errors resolved
- ESLint warnings reduced to only non-critical fast-refresh warnings
- Production build tested and verified

### Testing Status
- ✅ Build: Successfully compiles with no errors
- ✅ Linting: Passes with only minor warnings
- ✅ TypeScript: All type errors resolved
- ⚠️ Runtime Testing: Requires backend API for full testing

---

### 1\. Frontend Overview

El frontend de la aplicación está desarrollado utilizando **React**, un popular framework de JavaScript para construir interfaces de usuario interactivas. Se emplean diversas librerías y herramientas modernas para asegurar una experiencia de usuario fluida y una arquitectura de código escalable.

-----

### 2\. Estructura del Proyecto

El proyecto del frontend sigue una estructura modular y organizada, facilitando la navegación y el mantenimiento del código. Las carpetas principales y su propósito son las siguientes:

  * `assets`: Contiene recursos estáticos como imágenes, íconos o fuentes.
  * `components`: Almacena los componentes reutilizables de la interfaz de usuario.
      * `common`: Componentes compartidos y de uso general en toda la aplicación.
      * `dashboard`: Componentes específicos de la sección del dashboard.
      * `layout`: Componentes que definen la estructura general de las páginas.
      * `ui`: Contiene los componentes de interfaz de usuario de **Shadcn UI**, que se utilizan como bloques de construcción básicos.
  * `constants`: Archivos con valores constantes o configuraciones fijas.
  * `hooks`: Contiene los hooks personalizados de React para encapsular lógica reutilizable.
  * `lib`: Librerías y configuraciones específicas del proyecto.
      * `queryClient`: Configuración del cliente de **React Query** para la gestión de datos.
      * `utils`: Funciones de utilidad generales y auxiliares.
  * `pages`: Define las diferentes vistas o pantallas principales de la aplicación.
  * `schemas`: Esquemas de validación, probablemente usando **Zod**.
  * `services`: Lógica para interactuar con el backend (llamadas a la API).
  * `types`: Definiciones de tipos para TypeScript.
  * `utils`: Funciones de utilidad adicionales.

-----

### 3\. Librerías y Dependencias Principales

Las siguientes son las librerías y dependencias clave utilizadas en el proyecto frontend:

  * **React**: Biblioteca principal para la construcción de la interfaz de usuario.
  * **Axios**: Cliente HTTP basado en promesas para realizar solicitudes al backend.
  * **Tailwind CSS**: Framework CSS de utilidad para el diseño rápido y responsivo.
  * **Shadcn UI**: Conjunto de componentes de interfaz de usuario pre-diseñados y accesibles, construidos sobre Tailwind CSS y React.
  * **Zod**: Librería de validación de esquemas para asegurar la integridad de los datos.
  * **Sonner**: Librería para notificaciones y toasts.
  * **React Router DOM**: Librería para el enrutamiento declarativo en aplicaciones React.
  * **Framer Motion**: Librería para animaciones y transiciones de interfaz de usuario.
  * **React Query**: Herramienta para la gestión, caché y sincronización de datos asíncronos.

-----

### 4\. Gestión del Estado

La gestión del estado en la aplicación se realiza mediante una combinación de **React Context API** para el estado global y **`useState`** para el estado local de los componentes. Esto permite una flexibilidad para manejar datos compartidos a nivel de aplicación y datos específicos de cada componente.

-----

### 5\. Consumo de la API del Backend

Las interacciones con el backend se gestionan a través de **Axios**. Se ha configurado un interceptor global en el archivo `src/utils/api.ts` para manejar la estrategia de **Access Token y Refresh Token** utilizando **HTTP-only cookies**. Este interceptor se encarga de:

  * Adjuntar automáticamente el Access Token en las solicitudes salientes.
  * Detectar respuestas de no autorización (ej. 401 Unauthorized).
  * Utilizar el Refresh Token para obtener un nuevo Access Token cuando el actual expire, asegurando una experiencia de usuario ininterrumpida sin necesidad de reautenticación manual.

-----

### 6\. Sistema de Rutas

El enrutamiento de la aplicación se implementa utilizando **React Router DOM**. Las rutas principales actualmente definidas son:

  * `authPage`: Maneja las rutas relacionadas con la autenticación (ej. login, registro).
  * `dashboardPage`: Engloba las rutas y funcionalidades principales una vez el usuario ha iniciado sesión.

-----

### 7\. Estilización

La estilización de la interfaz de usuario se logra mediante el uso de **Tailwind CSS** y los componentes de **Shadcn UI**. Tailwind CSS proporciona clases de utilidad de bajo nivel para construir diseños personalizados de forma rápida, mientras que Shadcn UI ofrece componentes bien diseñados y accesibles que se integran perfectamente con Tailwind.

-----

### 8\. Componentes Reutilizables

El proyecto aprovecha la filosofía de componentes reutilizables, siguiendo la estructura y la convención de **Shadcn UI**. Los componentes de la carpeta `components/ui` son los bloques fundamentales de la interfaz de usuario, permitiendo la construcción consistente y eficiente de nuevas funcionalidades.

-----

### 9\. Autenticación y Autorización

La gestión de la autenticación se realiza mediante **HTTP-only cookies**. El **Access Token** se almacena como `auth_session` y el **Refresh Token** como `auth_persist`. Esta estrategia mejora la seguridad al hacer que las cookies sean inaccesibles desde el lado del cliente (JavaScript), mitigando ataques como Cross-Site Scripting (XSS).

-----

### 10\. Despliegue (Estado Actual)

Actualmente, el frontend se aloja en un **servidor Windows** y se ejecuta en modo de desarrollo utilizando `npm run host` con **Vite**. La aplicación se expone directamente desde este entorno. Se planea una transición futura a un entorno **Linux** donde la aplicación será construida y desplegada en su versión de producción. Este enfoque actual es para facilitar el desarrollo y las pruebas continuas.

-----

### 11\. Proceso de Construcción

El proyecto utiliza **Vite** para el proceso de construcción y desarrollo. Sin embargo, en el momento actual, la aplicación no se está construyendo para producción debido a las fases de desarrollo y pruebas activas. La construcción completa se realizará una vez que la aplicación alcance una etapa de mayor estabilidad y madurez.

-----

### 12\. Pruebas Unitarias/Integración

Actualmente, no se han implementado pruebas unitarias o de integración. Esto se debe a que el código se encuentra en constante modificación y evolución. Se planea introducir un conjunto de pruebas una vez que la aplicación alcance una etapa de mayor estabilidad y madurez.

-----

¡Disculpa la confusión\! Entendido, te refieres al punto 13 del frontend. Aquí tienes la explicación ampliada para el comando `npm run host` en la documentación de tu frontend.

-----

### 13\. Instalación y Ejecución del Proyecto

Para instalar y ejecutar el proyecto del frontend, sigue los siguientes pasos:

#### Requisitos Previos

Asegúrate de tener instalado [Node.js](https://nodejs.org/) (se recomienda la versión LTS) y [npm](https://www.npmjs.com/) (que viene con Node.js) o [Yarn](https://yarnpkg.com/).

#### Pasos de Instalación

1.  **Clona el repositorio:**

    ```bash
    git clone https://github.com/joeebw/neogenesys-client.git
    cd <nombre_del_directorio_clonado>
    ```

    *(**Nota:** Reemplaza `https://github.com/joeebw/neogenesys-client.git` con la URL real de tu repositorio y `<nombre_del_directorio_clonado>` con el nombre de la carpeta de tu proyecto.)*

2.  **Configura las variables de entorno:**

    Copia el archivo `.env.example` a `.env` y configura las variables necesarias:

    ```bash
    cp .env.example .env
    ```

    **Importante:** La variable `SCARF_ANALYTICS=false` está configurada para deshabilitar la recopilación de análisis del paquete `@scarf/scarf` (utilizado por `swagger-client`). Esto evita intentos de conexión a `scarf.sh` que pueden ser bloqueados por el firewall.

3.  **Instala las dependencias:**

    ```bash
    npm install
    # o si usas yarn
    # yarn install
    ```

#### Ejecución del Proyecto

1.  **Ejecuta la aplicación en modo desarrollo:**

    ```bash
    npm run dev
    ```

    Este comando inicia el servidor de desarrollo de Vite. La aplicación estará disponible en `http://localhost:5173` (o el puerto que se muestre en tu consola). Es ideal para el desarrollo local, ya que solo es accesible desde tu propia máquina.

2.  **Ejecuta la aplicación exponiéndola en la red local (para pruebas en otros dispositivos o en un servidor Windows):**

    ```bash
    npm run host
    ```

    Este comando también inicia el servidor de desarrollo de Vite, pero con una configuración que permite que la aplicación sea **accesible desde otras máquinas en la misma red local o desde un servidor remoto** (como el servidor Windows que mencionaste). Esto es particularmente útil para pruebas en diferentes dispositivos (móviles, tabletas) o cuando necesitas que la aplicación sea accesible desde una IP específica más allá de `localhost`. La URL para acceder a la aplicación generalmente incluirá la dirección IP de la máquina donde se ejecuta el servidor.

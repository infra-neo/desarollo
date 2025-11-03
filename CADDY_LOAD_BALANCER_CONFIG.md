# Configuración del Balanceador de Carga con Caddy

## Autor: Ing. Benjamín Frías — DevOps & Cloud Specialist

---

## Resumen

Este documento describe la configuración del balanceador de carga Caddy para el proyecto Desarollo, configurado para servir la aplicación a través del dominio **gate.kapp4.com**.

## Arquitectura

La aplicación está completamente containerizada con Docker y utiliza Caddy como reverse proxy/load balancer:

```
Internet
    ↓
gate.kapp4.com (Caddy - Puerto 80/443)
    ↓
    ├─→ /front → frontend:8080 (React App Principal con Auth)
    ├─→ /auth → backend:8000 (FastAPI Backend)
    ├─→ /api → backend:8000 (FastAPI Backend)
    └─→ /builder → builder-frontend:3000 (Infrastructure Builder)
```

## Servicios Containerizados

### 1. Frontend Principal (Puerto 8080)
- **Container**: `desarollo-frontend`
- **Ruta**: `/front`
- **Descripción**: Aplicación React principal con autenticación
- **Puerto Interno**: 80 (nginx)
- **Puerto Expuesto**: 8080

### 2. Backend API (Puerto 8000)
- **Container**: `desarollo-backend`
- **Rutas**: `/auth`, `/api`
- **Descripción**: API FastAPI con endpoints de autenticación
- **Puerto**: 8000

### 3. Infrastructure Builder Frontend (Puerto 3000)
- **Container**: `desarollo-builder-frontend`
- **Ruta**: `/builder`
- **Descripción**: Frontend del constructor visual de infraestructura
- **Puerto Interno**: 80 (nginx)
- **Puerto Expuesto**: 3000

### 4. Caddy Load Balancer
- **Container**: `desarollo-caddy`
- **Puertos**: 80 (HTTP), 443 (HTTPS), 443/UDP (HTTP/3)
- **Descripción**: Reverse proxy con HTTPS automático

## Instalación y Despliegue

### Prerequisitos

- Docker Engine 20.10+
- Docker Compose 1.29+
- Acceso al servidor con IP 34.68.124.46
- DNS configurado para apuntar gate.kapp4.com a 34.68.124.46

### Paso 1: Configurar DNS

Asegúrate de que el dominio `gate.kapp4.com` apunte a la IP del servidor:

```bash
# Verificar DNS
dig gate.kapp4.com
nslookup gate.kapp4.com
```

El registro A debe apuntar a: `34.68.124.46`

### Paso 2: Clonar el Repositorio

```bash
git clone https://github.com/infra-neo/desarollo.git
cd desarollo
```

### Paso 3: Construir las Imágenes Docker

```bash
# Construir todas las imágenes
docker-compose build

# O construir individualmente
docker-compose build frontend
docker-compose build backend
docker-compose build builder-frontend
```

### Paso 4: Iniciar los Servicios

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f caddy
docker-compose logs -f frontend
docker-compose logs -f backend
```

### Paso 5: Verificar el Despliegue

```bash
# Verificar que todos los contenedores estén corriendo
docker-compose ps

# Verificar salud de los servicios
docker-compose ps
curl http://localhost/health
curl http://localhost:8080/health
curl http://localhost:8000/health
```

## Acceso a la Aplicación

Una vez desplegado, la aplicación estará disponible en:

- **Frontend Principal**: https://gate.kapp4.com/front
- **Autenticación**: https://gate.kapp4.com/auth
- **API Backend**: https://gate.kapp4.com/api
- **Infrastructure Builder**: https://gate.kapp4.com/builder

## Características de Caddy

### HTTPS Automático
Caddy obtiene y renueva automáticamente certificados SSL de Let's Encrypt:
- No requiere configuración manual de certificados
- Renovación automática antes del vencimiento
- Soporte para HTTP/3 (QUIC)

### Headers de Seguridad
Caddy está configurado con headers de seguridad:
- **HSTS**: Fuerza HTTPS
- **X-Frame-Options**: Previene clickjacking
- **X-Content-Type-Options**: Previene MIME sniffing
- **X-XSS-Protection**: Protección contra XSS
- **Referrer-Policy**: Control de información de referrer

### Logging
Los logs se envían a stdout en formato JSON para facilitar el análisis.

## Configuración de Etapas Pendientes

### Etapa 2: Headscale + Remote Management
Para integrar Headscale (VPN mesh network) para gestión remota:

```yaml
# Agregar al docker-compose.yml
  headscale:
    image: headscale/headscale:latest
    container_name: desarollo-headscale
    ports:
      - "8080:8080"
      - "50443:50443"
    volumes:
      - ./config/headscale:/etc/headscale
      - headscale-data:/var/lib/headscale
    networks:
      - app-network
```

Actualizar Caddyfile:
```
    handle /headscale* {
        reverse_proxy headscale:8080
    }
```

### Etapa 3: Authentik + LDAP + TSPlus
Para autenticación corporativa:

```yaml
# Agregar al docker-compose.yml
  authentik-server:
    image: ghcr.io/goauthentik/server:latest
    container_name: desarollo-authentik
    command: server
    environment:
      - AUTHENTIK_SECRET_KEY=${AUTHENTIK_SECRET_KEY}
      - AUTHENTIK_POSTGRESQL__HOST=postgresql
      - AUTHENTIK_REDIS__HOST=redis
    ports:
      - "9000:9000"
      - "9443:9443"
    depends_on:
      - postgresql
      - redis
    networks:
      - app-network

  postgresql:
    image: postgres:15-alpine
    container_name: desarollo-postgres
    environment:
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_USER=authentik
      - POSTGRES_DB=authentik
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    container_name: desarollo-redis
    networks:
      - app-network

  openldap:
    image: osixia/openldap:latest
    container_name: desarollo-ldap
    environment:
      - LDAP_ORGANISATION="Mi Empresa"
      - LDAP_DOMAIN=kapp4.com
      - LDAP_ADMIN_PASSWORD=${LDAP_ADMIN_PASSWORD}
    volumes:
      - ldap-data:/var/lib/ldap
      - ldap-config:/etc/ldap/slapd.d
    networks:
      - app-network
```

### Etapa 4: Remotely + Websoft9
Para gestión remota y catálogo de aplicaciones:

```yaml
# Agregar al docker-compose.yml
  remotely:
    image: immense/remotely:latest
    container_name: desarollo-remotely
    ports:
      - "5000:5000"
    environment:
      - ApplicationOptions__DbProvider=PostgreSQL
      - ConnectionStrings__PostgreSQL=${REMOTELY_DB_CONNECTION}
    networks:
      - app-network

  guacamole:
    image: guacamole/guacamole:latest
    container_name: desarollo-guacamole
    environment:
      - GUACD_HOSTNAME=guacd
      - POSTGRESQL_HOSTNAME=postgresql
      - POSTGRESQL_DATABASE=guacamole
      - POSTGRESQL_USER=guacamole
      - POSTGRESQL_PASSWORD=${GUACAMOLE_DB_PASSWORD}
    ports:
      - "8081:8080"
    depends_on:
      - guacd
      - postgresql
    networks:
      - app-network

  guacd:
    image: guacamole/guacd:latest
    container_name: desarollo-guacd
    networks:
      - app-network
```

## Comandos Útiles

### Gestión de Contenedores

```bash
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Reiniciar un servicio específico
docker-compose restart caddy

# Ver logs en tiempo real
docker-compose logs -f

# Reconstruir y reiniciar servicios
docker-compose up -d --build

# Escalar un servicio (si aplica)
docker-compose up -d --scale frontend=3
```

### Mantenimiento

```bash
# Ver uso de recursos
docker stats

# Limpiar imágenes no utilizadas
docker image prune -a

# Limpiar volúmenes no utilizados
docker volume prune

# Ver certificados SSL de Caddy
docker exec desarollo-caddy caddy list-certificates
```

### Debugging

```bash
# Acceder a shell de un contenedor
docker exec -it desarollo-frontend sh
docker exec -it desarollo-backend sh
docker exec -it desarollo-caddy sh

# Verificar configuración de Caddy
docker exec desarollo-caddy caddy validate --config /etc/caddy/Caddyfile

# Recargar configuración de Caddy sin downtime
docker exec desarollo-caddy caddy reload --config /etc/caddy/Caddyfile
```

## Monitoreo y Observabilidad

Los servicios de observabilidad (Grafana, Loki, Promtail) se pueden agregar:

```bash
# Iniciar stack de observabilidad
docker stack deploy -c workloads/stacks/observability-stack.yml monitoring
```

Acceso:
- **Grafana**: http://34.68.124.46:3000 (admin/admin)
- **Loki**: http://34.68.124.46:3100

## Troubleshooting

### Problema: Caddy no obtiene certificados SSL

**Solución**:
1. Verificar que el DNS esté correctamente configurado
2. Verificar que los puertos 80 y 443 estén abiertos en el firewall
3. Revisar logs: `docker-compose logs caddy`

### Problema: Frontend no carga

**Solución**:
1. Verificar que el contenedor esté corriendo: `docker ps`
2. Revisar logs: `docker-compose logs frontend`
3. Verificar build: `docker-compose build frontend`

### Problema: Backend no responde

**Solución**:
1. Verificar conectividad: `docker exec -it desarollo-caddy wget -O- http://backend:8000/health`
2. Revisar logs: `docker-compose logs backend`
3. Verificar variables de entorno

### Problema: Error de red entre contenedores

**Solución**:
```bash
# Recrear la red
docker-compose down
docker network prune
docker-compose up -d
```

## Seguridad

### Recomendaciones

1. **Variables de Entorno**: Usar archivo `.env` para secrets
2. **Firewall**: Configurar firewall para exponer solo puertos necesarios
3. **Actualizaciones**: Mantener imágenes Docker actualizadas
4. **Backups**: Respaldar volúmenes regularmente
5. **SSL/TLS**: Caddy maneja automáticamente, pero verificar configuración

### Ejemplo .env

```env
# Backend
VITE_URL_API=https://gate.kapp4.com/api

# Authentik (Etapa 3)
AUTHENTIK_SECRET_KEY=change-this-to-a-random-string
POSTGRES_PASSWORD=change-this-password

# LDAP (Etapa 3)
LDAP_ADMIN_PASSWORD=change-this-password

# Remotely (Etapa 4)
REMOTELY_DB_CONNECTION=Host=postgresql;Database=remotely;Username=remotely;Password=change-this

# Guacamole (Etapa 4)
GUACAMOLE_DB_PASSWORD=change-this-password
```

## Próximos Pasos

1. ✅ Configurar balanceador de carga Caddy
2. ✅ Containerizar aplicaciones
3. ⏳ Implementar Etapa 2: Headscale + Remote Management
4. ⏳ Implementar Etapa 3: Authentik + LDAP + TSPlus
5. ⏳ Implementar Etapa 4: Remotely + Websoft9

---

**Autor**: Ing. Benjamín Frías — DevOps & Cloud Specialist  
**Fecha**: Noviembre 2025  
**Versión**: 1.0

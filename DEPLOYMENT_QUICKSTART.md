# Guía Rápida de Despliegue - Configuración con Caddy

## Resumen del Nuevo Requerimiento

El desarrollo ha sido migrado a contenedores Docker. La aplicación ahora funciona completamente containerizada con Caddy como balanceador de carga para el dominio **gate.kapp4.com**.

## Arquitectura de Servicios

```
gate.kapp4.com (Caddy Load Balancer)
│
├─→ /front    → Frontend Principal (Puerto 8080)
├─→ /auth     → Backend API (Puerto 8000)
├─→ /api      → Backend API (Puerto 8000)
└─→ /builder  → Infrastructure Builder (Puerto 3000)
```

## Despliegue Rápido

### Opción 1: Script Automático (Recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/infra-neo/desarollo.git
cd desarollo

# Ejecutar el script de despliegue
./deploy.sh
```

### Opción 2: Manual

```bash
# 1. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 2. Construir las imágenes
docker-compose build

# 3. Iniciar los servicios
docker-compose up -d

# 4. Ver logs
docker-compose logs -f
```

## Verificar el Despliegue

```bash
# Verificar estado de contenedores
docker-compose ps

# Debería mostrar:
# desarollo-caddy           (healthy)
# desarollo-frontend        (healthy)
# desarollo-backend         (healthy)
# desarollo-builder-frontend (running)

# Verificar salud de los servicios
curl http://localhost/health          # Caddy health
curl http://localhost:8080/health     # Frontend health
curl http://localhost:8000/health     # Backend health
```

## URLs de Acceso

### Producción (con dominio)
- Frontend: https://gate.kapp4.com/front
- Auth: https://gate.kapp4.com/auth
- API: https://gate.kapp4.com/api
- Builder: https://gate.kapp4.com/builder

### Testing Local (acceso directo)
- Frontend: http://localhost:8080
- Backend: http://localhost:8000
- Builder: http://localhost:3000
- Caddy: http://localhost (redirige a /front)

## Configuración DNS Requerida

Asegúrate de configurar el DNS antes del despliegue:

```
Tipo: A
Host: gate.kapp4.com
Valor: 34.68.124.46
TTL: 300
```

Verificar:
```bash
dig gate.kapp4.com
# o
nslookup gate.kapp4.com
```

## Etapas del Proyecto

### ✅ Etapa 1: Cloud Connectors
- Frontend y Backend containerizados
- Caddy configurado como load balancer
- HTTPS automático con Let's Encrypt

### ⏳ Etapa 2: Headscale + Remote Management (Pendiente)
Ver `CADDY_LOAD_BALANCER_CONFIG.md` para detalles de implementación

### ⏳ Etapa 3: Authentik + LDAP + TSPlus (Pendiente)
Ver `CADDY_LOAD_BALANCER_CONFIG.md` para detalles de implementación

### ⏳ Etapa 4: Remotely + Websoft9 (Pendiente)
Ver `CADDY_LOAD_BALANCER_CONFIG.md` para detalles de implementación

## Comandos Útiles

```bash
# Detener servicios
docker-compose down

# Reiniciar servicios
docker-compose restart

# Reiniciar servicio específico
docker-compose restart caddy

# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de servicio específico
docker-compose logs -f frontend

# Reconstruir imágenes
docker-compose build --no-cache

# Actualizar y reiniciar
docker-compose up -d --build

# Limpiar todo (cuidado: elimina volúmenes)
docker-compose down -v
```

## Troubleshooting

### Problema: Certificado SSL no se genera

**Causa**: DNS no apunta correctamente o puertos cerrados

**Solución**:
```bash
# Verificar DNS
dig gate.kapp4.com

# Verificar puertos abiertos
sudo netstat -tulpn | grep -E ':80|:443'

# Ver logs de Caddy
docker-compose logs caddy
```

### Problema: Frontend no carga

**Solución**:
```bash
# Verificar contenedor
docker ps | grep frontend

# Ver logs
docker-compose logs frontend

# Reconstruir
docker-compose build frontend
docker-compose up -d frontend
```

### Problema: Backend no responde

**Solución**:
```bash
# Verificar conectividad interna
docker exec -it desarollo-caddy wget -O- http://backend:8000/health

# Ver logs
docker-compose logs backend

# Verificar variables de entorno
docker exec desarollo-backend env
```

## Monitoreo

Para agregar observabilidad (Grafana, Loki):

```bash
# Iniciar stack de monitoreo
docker stack deploy -c workloads/stacks/observability-stack.yml monitoring

# Acceder a Grafana
http://34.68.124.46:3000
# Usuario: admin
# Password: admin
```

## Documentación Adicional

- `CADDY_LOAD_BALANCER_CONFIG.md` - Configuración detallada de Caddy y etapas pendientes
- `BACKEND_INTEGRATION_PLAN.md` - Plan de integración del backend
- `DEPLOYMENT_STATUS.md` - Estado del despliegue en CloudSpace
- `README.md` - Documentación principal del proyecto

## Soporte

**Autor**: Ing. Benjamín Frías — DevOps & Cloud Specialist

Para problemas o preguntas, revisar la documentación completa en `CADDY_LOAD_BALANCER_CONFIG.md`.

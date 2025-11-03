# Configuración de Proveedores Cloud (GCP y LXD)

## Basado en @infra-neo/local_server_poc

Esta guía documenta cómo configurar las conexiones a **Google Cloud Platform (GCP)** y **LXD** en la aplicación.

---

## 📋 Resumen

La aplicación ahora integra la funcionalidad de Apache Libcloud para gestionar múltiples proveedores cloud:
- ✅ **GCP** (Google Cloud Platform) - Totalmente funcional
- ✅ **LXD** (Linux Containers) - Totalmente funcional  
- ⏳ Otros proveedores (AWS, Azure, etc.) - En desarrollo

---

## 🌐 Configuración de GCP (Google Cloud Platform)

### Requisitos Previos

1. **Proyecto en GCP**: Necesitas un proyecto activo en Google Cloud
2. **Service Account**: Crea una cuenta de servicio con permisos de Compute Engine
3. **Habilitar APIs**: Asegúrate de que la API de Compute Engine esté habilitada

### Paso 1: Crear Service Account

```bash
# Crear service account
gcloud iam service-accounts create kolaboree-sa \
    --description="Service account for Kolaboree" \
    --display-name="Kolaboree Service Account"

# Asignar rol de Compute Admin
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:kolaboree-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/compute.admin"

# Generar key JSON
gcloud iam service-accounts keys create credentials/gcp-service-account.json \
    --iam-account=kolaboree-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### Paso 2: Habilitar API de Compute Engine

```bash
gcloud services enable compute.googleapis.com --project=YOUR_PROJECT_ID
```

### Paso 3: Configurar en la Aplicación

En la interfaz web, ve a **Workspace** → **Add Cloud Connection** y usa:

- **Connection Name**: `GCP Production` (o el nombre que prefieras)
- **Provider**: `Google Cloud Platform (GCP)`
- **Service Account JSON**: Pega el contenido completo del archivo `gcp-service-account.json`
- **Region**: `us-central1-a` (o tu región preferida)

#### Ejemplo de Service Account JSON:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "service-account@your-project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

---

## 📦 Configuración de LXD (Linux Containers)

### Requisitos Previos

1. **Servidor LXD**: Un servidor con LXD instalado y configurado
2. **Certificados**: Certificado cliente para autenticación
3. **Conectividad**: Acceso de red al servidor LXD (puerto 8443)

### Paso 1: Generar Certificados Cliente

En tu máquina local (donde corre la aplicación):

```bash
# Crear directorio para credenciales
mkdir -p credentials

# Generar certificado cliente
openssl req -x509 -newkey ec \
    -pkeyopt ec_paramgen_curve:secp384r1 \
    -sha384 -keyout credentials/lxd-client.key \
    -nodes -out credentials/lxd-client.crt \
    -days 3650 -subj "/CN=kolaboree-client"
```

### Paso 2: Agregar Certificado en el Servidor LXD

Conéctate al servidor LXD y ejecuta:

```bash
# Método A: Agregar desde archivo
cat > /tmp/kolaboree-client.crt <<'EOF'
-----BEGIN CERTIFICATE-----
[PEGAR AQUÍ EL CONTENIDO DE credentials/lxd-client.crt]
-----END CERTIFICATE-----
EOF

lxc config trust add /tmp/kolaboree-client.crt --name kolaboree-client

# Método B: Agregar vía trust password (si está configurado)
lxc config set core.trust_password "your-password"

# Verificar que se agregó
lxc config trust list
```

### Paso 3: Configurar Endpoint LXD

En el servidor LXD, asegúrate de que está escuchando en la red:

```bash
# Configurar LXD para escuchar en todas las interfaces
lxc config set core.https_address "[::]:8443"

# O en una IP específica
lxc config set core.https_address "192.168.1.100:8443"

# Verificar configuración
lxc config get core.https_address
```

### Paso 4: Configurar en la Aplicación

En la interfaz web, ve a **Workspace** → **Add Cloud Connection** y usa:

- **Connection Name**: `LXD Local` o `LXD MicroCloud`
- **Provider**: `LXD / LXC`
- **LXD Endpoint**: `https://SERVER_IP:8443` (ej: `https://100.94.245.27:8443`)
- **Client Certificate**: Pega el contenido de `credentials/lxd-client.crt`
- **Client Key**: Pega el contenido de `credentials/lxd-client.key`
- **Verify SSL**: `false` (para certificados autofirmados)

#### Ejemplo de Certificado Cliente:
```
-----BEGIN CERTIFICATE-----
MIIByTCCAU6gAwIBAgIUTeZwZRNXdXOQa7vOTcvjcH2B2+owCgYIKoZIzj0EAwMw
GzEZMBcGA1UEAwwQa29sYWJvcmVlLWNsaWVudDAeFw0yNTEwMTQwOTM5MDVaFw0z
...
-----END CERTIFICATE-----
```

---

## 🔧 Configuración con Tailscale (Recomendado)

Para comunicación segura entre clouds, se recomienda usar **Tailscale**:

### Instalar Tailscale

```bash
# En el servidor LXD
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up

# Obtener la IP de Tailscale
tailscale ip -4
```

### Configurar con IP de Tailscale

Usa la IP de Tailscale como endpoint:
- **LXD Endpoint**: `https://100.94.245.27:8443` (IP de Tailscale)

---

## 🧪 Probar Conexiones

### Probar GCP

```bash
# Instalar Google Cloud SDK (si no está instalado)
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Autenticar con service account
gcloud auth activate-service-account --key-file=credentials/gcp-service-account.json

# Listar instancias
gcloud compute instances list --project=YOUR_PROJECT_ID
```

### Probar LXD

```bash
# Probar conexión con curl
curl -k -X GET https://SERVER_IP:8443/1.0/instances \
  --cert credentials/lxd-client.crt \
  --key credentials/lxd-client.key

# O usar script de prueba del POC
python3 /tmp/local_server_poc/test-cloud-connections.py
```

---

## 📝 Variables de Entorno

Actualiza tu archivo `.env` con:

```env
# GCP Configuration
GCP_PROJECT_ID=your-gcp-project-id
GCP_CREDENTIALS_PATH=./credentials/gcp-service-account.json

# LXD Configuration
LXD_ENDPOINT=https://100.94.245.27:8443
LXD_CERT_PATH=./credentials/lxd-client.crt
LXD_KEY_PATH=./credentials/lxd-client.key
```

---

## 🔒 Seguridad

### Buenas Prácticas

1. **Nunca commits credenciales**: Agrega `credentials/` a `.gitignore`
2. **Usa variables de entorno**: Para producción, usa variables de entorno en lugar de archivos
3. **Rotar credenciales**: Cambia las credenciales regularmente
4. **Permisos mínimos**: Asigna solo los permisos necesarios a las service accounts
5. **Encriptar en reposo**: Si guardas credenciales, encriptalas

### Almacenamiento Seguro

```bash
# Encriptar archivo de credenciales
gpg --symmetric --cipher-algo AES256 credentials/gcp-service-account.json

# Desencriptar cuando se necesite
gpg credentials/gcp-service-account.json.gpg
```

---

## 🐛 Troubleshooting

### GCP: Error 403 Forbidden

**Problema**: La service account no tiene permisos

**Solución**:
```bash
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:SA_EMAIL" \
    --role="roles/compute.admin"
```

### LXD: Error 403 Forbidden

**Problema**: El certificado no está en el trust del servidor

**Solución**:
```bash
# En el servidor LXD
lxc config trust add /path/to/client.crt --name client-name
```

### LXD: Connection Refused

**Problema**: LXD no está escuchando en la red

**Solución**:
```bash
lxc config set core.https_address "[::]:8443"
systemctl restart lxd
```

### Error: Cannot reach LXD server

**Problema**: Firewall bloqueando puerto 8443

**Solución**:
```bash
# UFW
sudo ufw allow 8443/tcp

# iptables
sudo iptables -A INPUT -p tcp --dport 8443 -j ACCEPT
```

---

## 📚 Referencias

- [Documentación del POC](https://github.com/infra-neo/local_server_poc)
- [GCP Compute Engine API](https://cloud.google.com/compute/docs/reference/rest/v1)
- [LXD REST API](https://documentation.ubuntu.com/lxd/en/latest/rest-api/)
- [Apache Libcloud](https://libcloud.apache.org/)
- [Tailscale](https://tailscale.com/kb/1017/install)

---

**Autor**: Ing. Benjamín Frías — DevOps & Cloud Specialist  
**Basado en**: @infra-neo/local_server_poc  
**Fecha**: Noviembre 2025

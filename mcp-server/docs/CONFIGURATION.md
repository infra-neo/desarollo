# MCP Server Configuration Guide

## Table of Contents
1. [Initial Setup](#initial-setup)
2. [Authentik Configuration](#authentik-configuration)
3. [JumpServer Configuration](#jumpserver-configuration)
4. [Infisical Configuration](#infisical-configuration)
5. [WebAsset Controller Configuration](#webasset-controller-configuration)
6. [Traefik Configuration](#traefik-configuration)
7. [Tailscale Configuration](#tailscale-configuration)
8. [PostgreSQL Configuration](#postgresql-configuration)

---

## Initial Setup

### 1. Environment File

Copy and configure the environment file:

```bash
cd mcp-server/docker-compose
cp .env.example .env
```

Edit `.env` with your values:

```bash
# Critical variables to change
DOMAIN=yourdomain.com
ACME_EMAIL=admin@yourdomain.com
POSTGRES_PASSWORD=strong-random-password-here
AUTHENTIK_SECRET_KEY=minimum-50-character-random-string-here
JUMPSERVER_SECRET_KEY=another-random-string
INFISICAL_ENCRYPTION_KEY=32-character-random-key
TS_AUTHKEY=your-tailscale-auth-key
```

### 2. Generate Secure Keys

```bash
# For Authentik secret key (50+ chars)
openssl rand -base64 60

# For JumpServer secret key
openssl rand -base64 40

# For Infisical encryption key (32 chars)
openssl rand -base64 32 | cut -c1-32
```

---

## Authentik Configuration

### Step 1: Initial Access

1. Start services:
   ```bash
   docker-compose up -d
   ```

2. Get bootstrap password:
   ```bash
   docker logs mcp-authentik-server 2>&1 | grep "Bootstrap"
   ```

3. Access: `https://auth.yourdomain.com`
4. Login with `akadmin` and bootstrap password
5. Change password immediately

### Step 2: Create OIDC Providers

Create OIDC providers for all services following the pattern:

1. Navigate to **Applications** → **Providers** → **Create**
2. Select **OAuth2/OIDC Provider**
3. Configure with appropriate redirect URIs
4. Copy Client ID and Secret to `.env`

For detailed OIDC setup, see the full configuration guide in the repository.

---

## JumpServer Configuration

### Initial Login and API Key

1. Access: `https://jump.yourdomain.com`
2. Default: `admin` / `admin` (change immediately)
3. Generate API key in Profile → API Keys
4. Add to `.env` as `JUMPSERVER_API_KEY`

### Run Import Scripts

```bash
cd mcp-server
export JUMPSERVER_URL=http://localhost:8080
export JUMPSERVER_API_KEY=your-api-key

python3 jumpserver/scripts/import_users.py
python3 jumpserver/scripts/import_assets.py
python3 jumpserver/scripts/link_policies.py
```

---

## Infisical Configuration

1. Create organization and project
2. Add secrets for banking sites (format: `banking_<site_key>`)
3. Generate service token
4. Add token to `.env` as `INFISICAL_SERVICE_TOKEN`

---

## Complete Configuration

For complete step-by-step configuration instructions, see the full documentation in the MCP Server repository.

After configuration:

```bash
cd mcp-server/docker-compose
docker-compose down
docker-compose up -d
cd ../scripts
./init.sh
```

---

For additional help, consult the README.md or open an issue on GitHub.

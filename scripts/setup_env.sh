#!/bin/bash

# Environment Setup Script
# Author: Ing. Benjamín Frías — DevOps & Cloud Specialist
# Description: Sets up environment variables with secure random secrets

set -e

ENV_FILE="${1:-.env.stack}"

echo "🔐 Generating MCP Server environment configuration..."
echo "📁 Output file: $ENV_FILE"

# Generate secure random secrets
generate_secret() {
    openssl rand -base64 48 | tr -d "=+/" | cut -c1-32
}

# Create .env file
cat > "$ENV_FILE" << EOF
# MCP Server Stack Environment Configuration
# Generated: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
# Author: Ing. Benjamín Frías — DevOps & Cloud Specialist

# ============================================
# Domain Configuration
# ============================================
DOMAIN=${DOMAIN:-example.com}
ACME_EMAIL=${ACME_EMAIL:-admin@example.com}

# ============================================
# PostgreSQL Configuration
# ============================================
POSTGRES_HOST=${POSTGRES_HOST:-10.0.3.2}
POSTGRES_PORT=5432

# ============================================
# Authentik Configuration
# ============================================
AUTHENTIK_DB_NAME=authentik
AUTHENTIK_DB_USER=authentik
AUTHENTIK_DB_PASSWORD=$(generate_secret)
AUTHENTIK_SECRET_KEY=$(generate_secret)

# ============================================
# Infisical Configuration
# ============================================
INFISICAL_DB_NAME=infisical
INFISICAL_DB_USER=infisical
INFISICAL_DB_PASSWORD=$(generate_secret)
INFISICAL_ENCRYPTION_KEY=$(generate_secret)
INFISICAL_AUTH_SECRET=$(generate_secret)

# ============================================
# JumpServer Configuration
# ============================================
JUMPSERVER_DB_NAME=jumpserver
JUMPSERVER_DB_USER=jumpserver
JUMPSERVER_DB_PASSWORD=$(generate_secret)
JUMPSERVER_SECRET_KEY=$(generate_secret)
JUMPSERVER_BOOTSTRAP_TOKEN=$(generate_secret)
JUMPSERVER_OIDC_CLIENT_ID=jumpserver
JUMPSERVER_OIDC_CLIENT_SECRET=$(generate_secret)
JUMPSERVER_API_TOKEN=$(generate_secret)

# ============================================
# 1Panel Configuration
# ============================================
ONEPANEL_DB_NAME=onepanel
ONEPANEL_DB_USER=onepanel
ONEPANEL_DB_PASSWORD=$(generate_secret)

# ============================================
# WebAsset Controller Configuration
# ============================================
WEBASSET_DB_NAME=webasset
WEBASSET_DB_USER=webasset
WEBASSET_DB_PASSWORD=$(generate_secret)
WEBASSET_IMAGE=ghcr.io/infra-neo/webasset-controller:latest
WEBASSET_OIDC_CLIENT_ID=webasset
WEBASSET_OIDC_CLIENT_SECRET=$(generate_secret)
WEBASSET_INFISICAL_TOKEN=$(generate_secret)

# ============================================
# Banking Sites
# ============================================
BMG_CONSIG_URL=https://www.bmgconsig.com.br/Index.do?method=prepare
ICRED_API_URL=https://api.icred.app/authorization-server/custom-login

# ============================================
# Logging and Monitoring
# ============================================
LOG_LEVEL=info
AUDIT_ENABLED=true

# ============================================
# Security Settings
# ============================================
SESSION_TIMEOUT=1800
KIOSK_MODE=true
EOF

chmod 600 "$ENV_FILE"

echo "✅ Environment file generated: $ENV_FILE"
echo ""
echo "⚠️  IMPORTANT:"
echo "   1. Review and update DOMAIN and POSTGRES_HOST"
echo "   2. Store this file securely"
echo "   3. Never commit to git"
echo "   4. Use with: docker stack deploy --env-file $ENV_FILE ..."
echo ""
echo "🔑 All secrets have been randomly generated"

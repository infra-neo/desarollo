#!/bin/bash
# MCP Server Initialization Script
# This script initializes all services and imports data

set -e

echo "=============================================="
echo "MCP Server Initialization Script"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Please copy .env.example to .env and configure it"
    exit 1
fi

# Load environment variables
source .env

echo -e "${GREEN}✓${NC} Environment variables loaded"
echo ""

# Wait for services to be ready
echo "Waiting for services to start..."
echo ""

# Wait for PostgreSQL
echo -n "Waiting for PostgreSQL..."
until docker exec mcp-postgresql pg_isready -U postgres > /dev/null 2>&1; do
    echo -n "."
    sleep 2
done
echo -e " ${GREEN}✓${NC}"

# Wait for Redis
echo -n "Waiting for Redis..."
until docker exec mcp-redis redis-cli ping > /dev/null 2>&1; do
    echo -n "."
    sleep 2
done
echo -e " ${GREEN}✓${NC}"

# Wait for Authentik
echo -n "Waiting for Authentik..."
until curl -s -o /dev/null -w "%{http_code}" http://localhost:9000/api/v3/ | grep -q "200\|401"; do
    echo -n "."
    sleep 5
done
echo -e " ${GREEN}✓${NC}"

# Wait for JumpServer
echo -n "Waiting for JumpServer..."
until curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/health/ | grep -q "200"; do
    echo -n "."
    sleep 5
done
echo -e " ${GREEN}✓${NC}"

# Wait for Infisical
echo -n "Waiting for Infisical..."
until curl -s -o /dev/null -w "%{http_code}" http://localhost:8081/api/status | grep -q "200"; do
    echo -n "."
    sleep 5
done
echo -e " ${GREEN}✓${NC}"

echo ""
echo -e "${GREEN}All services are ready!${NC}"
echo ""

# Check if JUMPSERVER_API_KEY is set
if [ -z "$JUMPSERVER_API_KEY" ]; then
    echo -e "${YELLOW}Warning: JUMPSERVER_API_KEY not set${NC}"
    echo "Please set up JumpServer and generate an API key, then run the import scripts manually:"
    echo "  1. Access JumpServer at http://localhost:8080"
    echo "  2. Login with default credentials (admin/admin)"
    echo "  3. Generate an API key in user settings"
    echo "  4. Add JUMPSERVER_API_KEY to .env"
    echo "  5. Run: ./scripts/setup-jumpserver.sh"
    echo ""
else
    # Run JumpServer setup scripts
    echo "Setting up JumpServer..."
    echo ""
    
    echo "Importing users..."
    python3 ../jumpserver/scripts/import_users.py
    echo ""
    
    echo "Importing assets..."
    python3 ../jumpserver/scripts/import_assets.py
    echo ""
    
    echo "Linking policies..."
    python3 ../jumpserver/scripts/link_policies.py
    echo ""
fi

# Authentik configuration instructions
echo "=============================================="
echo "Next Steps: Configure Authentik SSO"
echo "=============================================="
echo ""
echo "1. Access Authentik at: https://auth.${DOMAIN:-localhost}"
echo "2. Login with default credentials"
echo "3. Create OIDC providers for:"
echo "   - JumpServer"
echo "   - Infisical"
echo "   - WebAsset Controller"
echo "   - 1Panel"
echo ""
echo "4. Update .env with OIDC client IDs and secrets"
echo "5. Restart services: docker-compose restart"
echo ""
echo "For detailed configuration, see: ../docs/CONFIGURATION.md"
echo ""
echo "=============================================="
echo -e "${GREEN}Initialization Complete!${NC}"
echo "=============================================="

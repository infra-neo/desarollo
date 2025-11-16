#!/bin/bash
# MCP Server GCP Instance Startup Script

set -e

echo "Starting MCP Server initialization..."

# Update system
apt-get update
apt-get upgrade -y

# Install required packages
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    python3 \
    python3-pip \
    jq

# Install Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Install Docker Compose standalone
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Enable and start Docker
systemctl enable docker
systemctl start docker

# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Create MCP Server directory
mkdir -p /opt/mcp-server
cd /opt/mcp-server

# Clone the repository (if not already done)
if [ ! -d "/opt/mcp-server/.git" ]; then
    git clone https://github.com/infra-neo/desarollo.git .
    cd mcp-server
fi

# Create .env file from template
if [ ! -f ".env" ]; then
    cp docker-compose/.env.example docker-compose/.env
    
    # Replace placeholders with actual values
    sed -i "s|DOMAIN=example.com|DOMAIN=${domain}|g" docker-compose/.env
    sed -i "s|TS_AUTHKEY=|TS_AUTHKEY=${tailscale_key}|g" docker-compose/.env
    sed -i "s|AUTHENTIK_SECRET_KEY=.*|AUTHENTIK_SECRET_KEY=${authentik_secret}|g" docker-compose/.env
fi

# Create required directories
mkdir -p docker-compose/traefik/dynamic
mkdir -p postgresql
mkdir -p scripts

# Set proper permissions
chown -R ubuntu:ubuntu /opt/mcp-server

# Configure firewall
ufw --force enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 41641/udp  # Tailscale

# Install Python dependencies for scripts
pip3 install requests

# Create systemd service for MCP Server
cat > /etc/systemd/system/mcp-server.service <<'EOF'
[Unit]
Description=MCP Server Docker Compose
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/mcp-server/docker-compose
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable mcp-server.service

echo "MCP Server initialization completed!"
echo "To start services, run: cd /opt/mcp-server/docker-compose && docker-compose up -d"

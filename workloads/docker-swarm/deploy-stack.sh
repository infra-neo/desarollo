#!/bin/bash
set -e

# Docker Stack Deployment Script
# Author: Ing. Benjamín Frías — DevOps & Cloud Specialist

STACK_NAME="${1:-desarollo}"
COMPOSE_FILE="${2:-/opt/desarollo/docker-compose.yml}"

echo "=== Docker Stack Deployment ==="
echo "Stack name: $STACK_NAME"
echo "Compose file: $COMPOSE_FILE"

# Check if Docker Swarm is active
if ! docker info 2>/dev/null | grep -q "Swarm: active"; then
    echo "Error: Docker Swarm is not active. Please initialize Swarm first."
    exit 1
fi

# Check if compose file exists
if [ ! -f "$COMPOSE_FILE" ]; then
    echo "Error: Compose file not found: $COMPOSE_FILE"
    exit 1
fi

# Deploy or update the stack
echo "Deploying stack..."
docker stack deploy -c "$COMPOSE_FILE" "$STACK_NAME"

if [ $? -eq 0 ]; then
    echo "✓ Stack deployed successfully"
    
    # Wait for services to be ready
    echo ""
    echo "Waiting for services to start..."
    sleep 5
    
    # Display stack services
    echo ""
    echo "=== Stack Services ==="
    docker stack services "$STACK_NAME"
    
    echo ""
    echo "=== Service Status ==="
    docker stack ps "$STACK_NAME" --no-trunc
    
    echo ""
    echo "✓ Deployment completed"
else
    echo "Error: Failed to deploy stack"
    exit 1
fi

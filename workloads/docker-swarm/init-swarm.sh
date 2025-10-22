#!/bin/bash
set -e

# Docker Swarm Initialization Script
# Author: Ing. Benjamín Frías — DevOps & Cloud Specialist

echo "=== Docker Swarm Initialization ==="
echo "Starting Docker Swarm setup..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Swarm is already initialized
if docker info 2>/dev/null | grep -q "Swarm: active"; then
    echo "Docker Swarm is already initialized"
    docker node ls
    exit 0
fi

# Initialize Docker Swarm
echo "Initializing Docker Swarm..."
SWARM_ADVERTISE_ADDR=$(hostname -I | awk '{print $1}')

docker swarm init --advertise-addr "$SWARM_ADVERTISE_ADDR"

if [ $? -eq 0 ]; then
    echo "✓ Docker Swarm initialized successfully"
    echo "Manager node: $(hostname)"
    echo "Advertise address: $SWARM_ADVERTISE_ADDR"
    
    # Display join token for workers
    echo ""
    echo "=== Worker Join Token ==="
    docker swarm join-token worker
    
    # Create overlay network for services
    echo ""
    echo "Creating overlay networks..."
    docker network create --driver overlay --attachable app-network || echo "Network already exists"
    docker network create --driver overlay --attachable monitoring-network || echo "Network already exists"
    
    echo ""
    echo "✓ Docker Swarm setup completed successfully"
    echo ""
    echo "Node status:"
    docker node ls
else
    echo "Error: Failed to initialize Docker Swarm"
    exit 1
fi

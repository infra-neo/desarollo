#!/bin/bash
# Deploy script for Desarollo application with Caddy load balancer
# Author: Ing. Benjamín Frías — DevOps & Cloud Specialist

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

print_info "Starting deployment of Desarollo application..."

# Check if .env file exists
if [ ! -f .env ]; then
    print_warn ".env file not found. Creating from .env.example..."
    cp .env.example .env
    print_warn "Please edit .env file with your configuration if needed."
fi

# Build image
print_info "Building Docker image..."
docker build -t desarollo-app:latest .

# Stop existing containers if any
print_info "Stopping existing containers..."
docker compose down 2>/dev/null || true

# Start services
print_info "Starting services..."
docker compose up -d

# Wait for services to be healthy
print_info "Waiting for services to be healthy..."
sleep 10

# Check service status
print_info "Checking service status..."
docker compose ps

# Display service URLs
echo ""
print_info "Deployment completed successfully!"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "Service URLs:"
echo "═══════════════════════════════════════════════════════════"
echo "Main Application:      https://gate.kapp4.com"
echo "With /front prefix:    https://gate.kapp4.com/front"
echo "Authentication:        https://gate.kapp4.com/auth"
echo "Health Check:          https://gate.kapp4.com/health"
echo ""
echo "Direct Access (for testing):"
echo "Application:           http://localhost:8080"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Show logs
print_info "Showing container logs (press Ctrl+C to exit)..."
docker compose logs -f

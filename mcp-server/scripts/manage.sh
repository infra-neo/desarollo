#!/bin/bash
# MCP Server Management Script
# Provides common operations for managing the MCP Server stack

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_DIR="$(dirname "$SCRIPT_DIR")/docker-compose"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running in correct directory
check_directory() {
    if [ ! -f "$COMPOSE_DIR/docker-compose.yml" ]; then
        log_error "docker-compose.yml not found. Please run from mcp-server directory."
        exit 1
    fi
}

# Start services
start_services() {
    log_info "Starting MCP Server services..."
    cd "$COMPOSE_DIR"
    docker-compose up -d
    log_success "Services started"
    show_status
}

# Stop services
stop_services() {
    log_info "Stopping MCP Server services..."
    cd "$COMPOSE_DIR"
    docker-compose down
    log_success "Services stopped"
}

# Restart services
restart_services() {
    log_info "Restarting MCP Server services..."
    cd "$COMPOSE_DIR"
    docker-compose restart
    log_success "Services restarted"
}

# Show status
show_status() {
    log_info "MCP Server Status:"
    cd "$COMPOSE_DIR"
    docker-compose ps
}

# Show logs
show_logs() {
    local service=$1
    cd "$COMPOSE_DIR"
    if [ -z "$service" ]; then
        docker-compose logs -f --tail=100
    else
        docker-compose logs -f --tail=100 "$service"
    fi
}

# Health check
health_check() {
    log_info "Performing health check..."
    cd "$COMPOSE_DIR"
    
    services=("postgresql" "redis" "authentik-server" "jumpserver-core" "infisical" "traefik")
    
    for service in "${services[@]}"; do
        if docker-compose ps | grep -q "$service.*Up"; then
            log_success "$service is running"
        else
            log_error "$service is not running"
        fi
    done
}

# Backup database
backup_database() {
    log_info "Creating PostgreSQL backup..."
    
    BACKUP_DIR="$SCRIPT_DIR/../backups"
    mkdir -p "$BACKUP_DIR"
    
    BACKUP_FILE="$BACKUP_DIR/postgres-$(date +%Y%m%d-%H%M%S).sql"
    
    cd "$COMPOSE_DIR"
    docker exec mcp-postgresql pg_dumpall -U postgres > "$BACKUP_FILE"
    
    if [ -f "$BACKUP_FILE" ]; then
        log_success "Backup created: $BACKUP_FILE"
        
        # Compress backup
        gzip "$BACKUP_FILE"
        log_success "Backup compressed: ${BACKUP_FILE}.gz"
        
        # Clean old backups (keep last 7 days)
        find "$BACKUP_DIR" -name "postgres-*.sql.gz" -mtime +7 -delete
        log_info "Cleaned old backups (>7 days)"
    else
        log_error "Backup failed"
        exit 1
    fi
}

# Restore database
restore_database() {
    local backup_file=$1
    
    if [ -z "$backup_file" ]; then
        log_error "Please specify backup file: $0 restore <backup-file>"
        exit 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        log_error "Backup file not found: $backup_file"
        exit 1
    fi
    
    log_warning "This will restore the database from backup."
    read -p "Are you sure? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        log_info "Restore cancelled"
        exit 0
    fi
    
    log_info "Restoring database from: $backup_file"
    
    cd "$COMPOSE_DIR"
    
    # Decompress if needed
    if [[ "$backup_file" == *.gz ]]; then
        gunzip -c "$backup_file" | docker exec -i mcp-postgresql psql -U postgres
    else
        docker exec -i mcp-postgresql psql -U postgres < "$backup_file"
    fi
    
    log_success "Database restored"
}

# Update services
update_services() {
    log_info "Updating MCP Server services..."
    cd "$COMPOSE_DIR"
    
    log_info "Pulling latest images..."
    docker-compose pull
    
    log_info "Recreating services..."
    docker-compose up -d
    
    log_success "Services updated"
    show_status
}

# Clean up
cleanup() {
    log_warning "This will remove stopped containers, unused networks, and dangling images."
    read -p "Continue? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        log_info "Cleanup cancelled"
        exit 0
    fi
    
    log_info "Cleaning up Docker resources..."
    docker system prune -f
    log_success "Cleanup complete"
}

# View service URLs
show_urls() {
    if [ -f "$COMPOSE_DIR/.env" ]; then
        source "$COMPOSE_DIR/.env"
        
        log_info "Service URLs:"
        echo ""
        echo -e "  Authentik:  ${GREEN}https://auth.${DOMAIN}${NC}"
        echo -e "  JumpServer: ${GREEN}https://jump.${DOMAIN}${NC}"
        echo -e "  Infisical:  ${GREEN}https://vault.${DOMAIN}${NC}"
        echo -e "  WebAsset:   ${GREEN}https://web.${DOMAIN}${NC}"
        echo -e "  1Panel:     ${GREEN}https://panel.${DOMAIN}${NC}"
        echo -e "  Traefik:    ${GREEN}https://traefik.${DOMAIN}${NC}"
        echo ""
    else
        log_error ".env file not found"
    fi
}

# Import data
import_data() {
    log_info "Importing users, assets, and policies..."
    
    if [ -z "$JUMPSERVER_API_KEY" ]; then
        log_error "JUMPSERVER_API_KEY not set. Please configure it in .env"
        exit 1
    fi
    
    export JUMPSERVER_URL=${JUMPSERVER_URL:-http://localhost:8080}
    export JUMPSERVER_API_KEY
    
    log_info "Importing 50 users..."
    python3 "$SCRIPT_DIR/../jumpserver/scripts/import_users.py"
    
    log_info "Importing 25 banking sites..."
    python3 "$SCRIPT_DIR/../jumpserver/scripts/import_assets.py"
    
    log_info "Linking policies..."
    python3 "$SCRIPT_DIR/../jumpserver/scripts/link_policies.py"
    
    log_success "Data import complete"
}

# Show help
show_help() {
    cat << EOF
MCP Server Management Script

Usage: $0 <command>

Commands:
  start       Start all services
  stop        Stop all services
  restart     Restart all services
  status      Show service status
  logs        Show logs (optionally specify service name)
  health      Perform health check
  backup      Backup PostgreSQL database
  restore     Restore database from backup
  update      Pull latest images and update services
  cleanup     Clean up Docker resources
  urls        Show service URLs
  import      Import users, assets, and policies
  help        Show this help message

Examples:
  $0 start
  $0 logs
  $0 logs authentik-server
  $0 backup
  $0 restore backups/postgres-20240115-120000.sql.gz

EOF
}

# Main script
check_directory

case "${1:-help}" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs "$2"
        ;;
    health)
        health_check
        ;;
    backup)
        backup_database
        ;;
    restore)
        restore_database "$2"
        ;;
    update)
        update_services
        ;;
    cleanup)
        cleanup
        ;;
    urls)
        show_urls
        ;;
    import)
        import_data
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        log_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac

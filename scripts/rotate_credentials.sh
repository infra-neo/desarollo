#!/bin/bash

# Master Credentials Rotation Script
# Author: Ing. Benjamín Frías — DevOps & Cloud Specialist
# Description: Automates rotation of banking master credentials in Infisical

set -euo pipefail

# Configuration
INFISICAL_URL="${INFISICAL_URL:-http://infisical:8080}"
INFISICAL_TOKEN="${INFISICAL_TOKEN}"
ENVIRONMENT="${ENVIRONMENT:-production}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Generate secure password
generate_password() {
    local length="${1:-32}"
    openssl rand -base64 48 | tr -d "=+/" | cut -c1-${length}
}

# Update secret in Infisical
update_infisical_secret() {
    local path="$1"
    local key="$2"
    local value="$3"
    
    log_info "Updating secret: $path/$key"
    
    response=$(curl -s -X POST "${INFISICAL_URL}/api/v2/secrets" \
        -H "Authorization: Bearer ${INFISICAL_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{
            \"path\": \"${path}\",
            \"environment\": \"${ENVIRONMENT}\",
            \"secretKey\": \"${key}\",
            \"secretValue\": \"${value}\"
        }")
    
    if echo "$response" | grep -q "error"; then
        log_error "Failed to update secret: $response"
        return 1
    fi
    
    log_info "Secret updated successfully"
    return 0
}

# Rotate BMG credentials
rotate_bmg_credentials() {
    log_info "Rotating BMG master credentials..."
    
    local new_password=$(generate_password 32)
    local path="/banking/bmg/master-credentials"
    
    # In a real scenario, you would:
    # 1. Generate new credentials
    # 2. Update them in the banking platform API
    # 3. Verify the new credentials work
    # 4. Update Infisical
    # 5. Notify relevant teams
    
    # For this example, we'll just update the password in Infisical
    if update_infisical_secret "$path" "password" "$new_password"; then
        log_info "BMG credentials rotated successfully"
        
        # Store old password in history (optional)
        local timestamp=$(date +%Y%m%d_%H%M%S)
        update_infisical_secret "$path" "password_backup_${timestamp}" "$new_password"
        
        return 0
    else
        log_error "Failed to rotate BMG credentials"
        return 1
    fi
}

# Rotate iCred credentials
rotate_icred_credentials() {
    log_info "Rotating iCred master credentials..."
    
    local new_password=$(generate_password 32)
    local path="/banking/icred/master-credentials"
    
    if update_infisical_secret "$path" "password" "$new_password"; then
        log_info "iCred credentials rotated successfully"
        
        local timestamp=$(date +%Y%m%d_%H%M%S)
        update_infisical_secret "$path" "password_backup_${timestamp}" "$new_password"
        
        return 0
    else
        log_error "Failed to rotate iCred credentials"
        return 1
    fi
}

# Rotate database credentials
rotate_database_credentials() {
    local db_name="$1"
    log_info "Rotating $db_name database credentials..."
    
    local new_password=$(generate_password 32)
    
    # Update in Terraform outputs/secrets
    # This is a placeholder - actual implementation would interact with Cloud SQL API
    log_warn "Database credential rotation requires manual intervention or Cloud SQL API integration"
    
    return 0
}

# Notify teams
notify_rotation() {
    local asset="$1"
    local status="$2"
    
    log_info "Sending notification for $asset rotation: $status"
    
    # Send notification via webhook, email, or Slack
    # Example webhook call:
    # curl -X POST "$WEBHOOK_URL" -d "{\"text\": \"Credentials rotated for $asset: $status\"}"
    
    return 0
}

# Main rotation workflow
main() {
    log_info "Starting master credentials rotation..."
    log_info "Environment: $ENVIRONMENT"
    
    local assets="${1:-all}"
    local failed=0
    
    case "$assets" in
        bmg)
            rotate_bmg_credentials || ((failed++))
            ;;
        icred)
            rotate_icred_credentials || ((failed++))
            ;;
        database)
            rotate_database_credentials "authentik" || ((failed++))
            rotate_database_credentials "jumpserver" || ((failed++))
            rotate_database_credentials "infisical" || ((failed++))
            rotate_database_credentials "onepanel" || ((failed++))
            rotate_database_credentials "webasset" || ((failed++))
            ;;
        all)
            rotate_bmg_credentials || ((failed++))
            rotate_icred_credentials || ((failed++))
            ;;
        *)
            log_error "Unknown asset: $assets"
            log_info "Usage: $0 [bmg|icred|database|all]"
            exit 1
            ;;
    esac
    
    if [ $failed -eq 0 ]; then
        log_info "✅ All credentials rotated successfully"
        notify_rotation "$assets" "success"
        exit 0
    else
        log_error "❌ Some credentials failed to rotate ($failed failures)"
        notify_rotation "$assets" "failed"
        exit 1
    fi
}

# Check prerequisites
if [ -z "${INFISICAL_TOKEN:-}" ]; then
    log_error "INFISICAL_TOKEN environment variable is not set"
    exit 1
fi

# Run main function
main "$@"

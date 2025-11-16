.PHONY: help init build up down restart logs ps clean deploy test lint format

# Variables
COMPOSE_FILE := docker-compose.yml
PROJECT_NAME := mcp-server-2

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)MCP Server 2 - Available Commands$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

# Setup and Installation
init: ## Initialize the project (first time setup)
	@echo "$(BLUE)Initializing MCP Server 2...$(NC)"
	@if [ ! -f .env ]; then \
		echo "$(YELLOW)Creating .env from .env.example...$(NC)"; \
		cp .env.example .env; \
		echo "$(RED)⚠️  Please edit .env with your values before continuing!$(NC)"; \
	fi
	@mkdir -p data/{postgres,redis,authentik,kasm,infisical,onepanel,traefik,tailscale,webasset}
	@chmod +x scripts/*.py
	@chmod +x configs/postgres/init-databases.sh
	@echo "$(GREEN)✓ Initialization complete!$(NC)"

check-env: ## Check if .env file exists and is configured
	@if [ ! -f .env ]; then \
		echo "$(RED)Error: .env file not found!$(NC)"; \
		echo "Run 'make init' first."; \
		exit 1; \
	fi
	@if grep -q "changeme" .env; then \
		echo "$(YELLOW)Warning: .env contains default values!$(NC)"; \
		echo "Please update with real credentials."; \
	fi

# Docker Operations
build: check-env ## Build all Docker images
	@echo "$(BLUE)Building Docker images...$(NC)"
	docker-compose -f $(COMPOSE_FILE) build
	@echo "$(GREEN)✓ Build complete!$(NC)"

up: check-env ## Start all services
	@echo "$(BLUE)Starting all services...$(NC)"
	docker-compose -f $(COMPOSE_FILE) up -d
	@echo "$(GREEN)✓ Services started!$(NC)"
	@echo ""
	@echo "$(BLUE)Access your services:$(NC)"
	@echo "  Authentik:      https://auth.$$(grep DOMAIN .env | cut -d'=' -f2)"
	@echo "  KasmWeb:        https://kasm.$$(grep DOMAIN .env | cut -d'=' -f2)"
	@echo "  Infisical:      https://vault.$$(grep DOMAIN .env | cut -d'=' -f2)"
	@echo "  1Panel:         https://panel.$$(grep DOMAIN .env | cut -d'=' -f2)"
	@echo "  WebAsset:       https://web.$$(grep DOMAIN .env | cut -d'=' -f2)"
	@echo "  Traefik:        https://traefik.$$(grep DOMAIN .env | cut -d'=' -f2)"

down: ## Stop all services
	@echo "$(BLUE)Stopping all services...$(NC)"
	docker-compose -f $(COMPOSE_FILE) down
	@echo "$(GREEN)✓ Services stopped!$(NC)"

restart: ## Restart all services
	@echo "$(BLUE)Restarting all services...$(NC)"
	docker-compose -f $(COMPOSE_FILE) restart
	@echo "$(GREEN)✓ Services restarted!$(NC)"

# Monitoring and Logs
logs: ## View logs from all services
	docker-compose -f $(COMPOSE_FILE) logs -f

logs-service: ## View logs from specific service (usage: make logs-service SERVICE=webasset-controller)
	@if [ -z "$(SERVICE)" ]; then \
		echo "$(RED)Error: SERVICE not specified!$(NC)"; \
		echo "Usage: make logs-service SERVICE=webasset-controller"; \
		exit 1; \
	fi
	docker-compose -f $(COMPOSE_FILE) logs -f $(SERVICE)

ps: ## List running containers
	@docker-compose -f $(COMPOSE_FILE) ps

status: ## Show service status and health
	@echo "$(BLUE)Service Status:$(NC)"
	@docker-compose -f $(COMPOSE_FILE) ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

health: ## Check health of all services
	@echo "$(BLUE)Checking service health...$(NC)"
	@curl -s http://localhost:5000/health | jq '.' || echo "WebAsset Controller not responding"

# Database Operations
db-backup: ## Backup PostgreSQL databases
	@echo "$(BLUE)Backing up databases...$(NC)"
	@mkdir -p backups/$$(date +%Y%m%d)
	@docker exec mcp-postgres pg_dumpall -U mcpserver > backups/$$(date +%Y%m%d)/postgres.sql
	@echo "$(GREEN)✓ Backup saved to backups/$$(date +%Y%m%d)/postgres.sql$(NC)"

db-restore: ## Restore PostgreSQL databases (usage: make db-restore BACKUP=backups/20250116/postgres.sql)
	@if [ -z "$(BACKUP)" ]; then \
		echo "$(RED)Error: BACKUP not specified!$(NC)"; \
		echo "Usage: make db-restore BACKUP=backups/20250116/postgres.sql"; \
		exit 1; \
	fi
	@echo "$(BLUE)Restoring database from $(BACKUP)...$(NC)"
	@docker exec -i mcp-postgres psql -U mcpserver < $(BACKUP)
	@echo "$(GREEN)✓ Database restored!$(NC)"

db-shell: ## Open PostgreSQL shell
	docker exec -it mcp-postgres psql -U mcpserver -d authentik

# User and Workspace Management
import-users: ## Import users from Authentik to KasmWeb
	@echo "$(BLUE)Importing users from Authentik...$(NC)"
	@python3 scripts/import_users_kasm.py \
		--kasm-url $$(grep KASM_URL .env | cut -d'=' -f2) \
		--api-key $$(grep KASM_API_KEY .env | cut -d'=' -f2) \
		--api-secret $$(grep KASM_API_SECRET .env | cut -d'=' -f2) \
		--source authentik \
		--authentik-url $$(grep AUTHENTIK_URL .env | cut -d'=' -f2) \
		--authentik-token $$(grep AUTHENTIK_TOKEN .env | cut -d'=' -f2)

create-workspaces: ## Create KasmWeb workspaces for banking sites
	@echo "$(BLUE)Creating banking workspaces...$(NC)"
	@python3 scripts/create_workspaces.py \
		--kasm-url $$(grep KASM_URL .env | cut -d'=' -f2) \
		--api-key $$(grep KASM_API_KEY .env | cut -d'=' -f2) \
		--api-secret $$(grep KASM_API_SECRET .env | cut -d'=' -f2) \
		--config configs/webasset/banking_sites.yml

# Development
dev: ## Start services in development mode
	@echo "$(BLUE)Starting in development mode...$(NC)"
	docker-compose -f $(COMPOSE_FILE) up

shell: ## Open shell in WebAsset Controller container
	docker exec -it mcp-webasset /bin/bash

lint: ## Lint Python code
	@echo "$(BLUE)Linting Python code...$(NC)"
	cd webasset-controller && \
		flake8 app/ --max-line-length=120 && \
		black --check app/ && \
		isort --check-only app/
	@echo "$(GREEN)✓ Lint passed!$(NC)"

format: ## Format Python code
	@echo "$(BLUE)Formatting Python code...$(NC)"
	cd webasset-controller && \
		black app/ && \
		isort app/
	@echo "$(GREEN)✓ Code formatted!$(NC)"

# Testing
test: ## Run tests
	@echo "$(BLUE)Running tests...$(NC)"
	cd webasset-controller && pytest tests/
	@echo "$(GREEN)✓ Tests passed!$(NC)"

test-e2e: ## Run end-to-end tests
	@echo "$(BLUE)Running E2E tests...$(NC)"
	@echo "$(YELLOW)Testing service endpoints...$(NC)"
	@curl -k https://auth.$$(grep DOMAIN .env | cut -d'=' -f2) || echo "Authentik: ✗"
	@curl -k https://kasm.$$(grep DOMAIN .env | cut -d'=' -f2) || echo "KasmWeb: ✗"
	@curl -k https://vault.$$(grep DOMAIN .env | cut -d'=' -f2) || echo "Infisical: ✗"
	@curl -k https://web.$$(grep DOMAIN .env | cut -d'=' -f2) || echo "WebAsset: ✗"

# Terraform
tf-init: ## Initialize Terraform
	@echo "$(BLUE)Initializing Terraform...$(NC)"
	cd terraform && terraform init
	@echo "$(GREEN)✓ Terraform initialized!$(NC)"

tf-plan: ## Run Terraform plan
	@echo "$(BLUE)Running Terraform plan...$(NC)"
	cd terraform && terraform plan

tf-apply: ## Apply Terraform changes
	@echo "$(BLUE)Applying Terraform changes...$(NC)"
	cd terraform && terraform apply

tf-destroy: ## Destroy Terraform resources
	@echo "$(RED)⚠️  This will destroy all infrastructure!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		cd terraform && terraform destroy; \
	fi

# Maintenance
clean: ## Clean up Docker resources
	@echo "$(BLUE)Cleaning up Docker resources...$(NC)"
	docker-compose -f $(COMPOSE_FILE) down -v
	@echo "$(YELLOW)Removing dangling images...$(NC)"
	docker image prune -f
	@echo "$(GREEN)✓ Cleanup complete!$(NC)"

clean-all: ## Clean everything including volumes and images
	@echo "$(RED)⚠️  This will remove all data!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose -f $(COMPOSE_FILE) down -v --rmi all; \
		rm -rf data/*; \
		echo "$(GREEN)✓ Full cleanup complete!$(NC)"; \
	fi

update: ## Update all Docker images
	@echo "$(BLUE)Updating Docker images...$(NC)"
	docker-compose -f $(COMPOSE_FILE) pull
	@echo "$(GREEN)✓ Images updated!$(NC)"
	@echo "$(YELLOW)Run 'make restart' to use new images$(NC)"

# Security
security-scan: ## Scan images for vulnerabilities
	@echo "$(BLUE)Scanning images for vulnerabilities...$(NC)"
	@command -v trivy >/dev/null 2>&1 || { echo "$(RED)trivy not installed!$(NC)"; exit 1; }
	trivy image mcp-server-2-webasset:latest

audit: ## Run security audit
	@echo "$(BLUE)Running security audit...$(NC)"
	@echo "$(YELLOW)Checking for exposed secrets...$(NC)"
	@grep -r "password\|secret\|key" .env || true
	@echo "$(YELLOW)Checking Docker security...$(NC)"
	@docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image --severity HIGH,CRITICAL mcp-server-2-webasset:latest

# Backup and Restore
backup-all: ## Backup all data
	@echo "$(BLUE)Creating full backup...$(NC)"
	@mkdir -p backups/$$(date +%Y%m%d)
	@make db-backup
	@tar czf backups/$$(date +%Y%m%d)/recordings.tar.gz data/kasm/recordings/
	@tar czf backups/$$(date +%Y%m%d)/configs.tar.gz configs/
	@echo "$(GREEN)✓ Full backup complete!$(NC)"

# Information
info: ## Show system information
	@echo "$(BLUE)MCP Server 2 - System Information$(NC)"
	@echo ""
	@echo "$(BLUE)Version:$(NC)"
	@git describe --tags --always 2>/dev/null || echo "Unknown"
	@echo ""
	@echo "$(BLUE)Docker:$(NC)"
	@docker --version
	@docker-compose --version
	@echo ""
	@echo "$(BLUE)System Resources:$(NC)"
	@docker system df
	@echo ""
	@echo "$(BLUE)Service URLs:$(NC)"
	@if [ -f .env ]; then \
		echo "  Authentik:  https://auth.$$(grep DOMAIN .env | cut -d'=' -f2)"; \
		echo "  KasmWeb:    https://kasm.$$(grep DOMAIN .env | cut -d'=' -f2)"; \
		echo "  Infisical:  https://vault.$$(grep DOMAIN .env | cut -d'=' -f2)"; \
		echo "  1Panel:     https://panel.$$(grep DOMAIN .env | cut -d'=' -f2)"; \
		echo "  WebAsset:   https://web.$$(grep DOMAIN .env | cut -d'=' -f2)"; \
		echo "  Traefik:    https://traefik.$$(grep DOMAIN .env | cut -d'=' -f2)"; \
	fi

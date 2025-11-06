# TodoPro DevOps Makefile - Optimized
# Usage: make <target>

.PHONY: help setup build test deploy clean validate

# Colors for output
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[1;33m
BLUE=\033[0;34m
NC=\033[0m # No Color

# Default target
help: ## Show this help message
	@echo "$(BLUE)TodoPro DevOps Commands:$(NC)"
	@echo "$(BLUE)========================$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

# Validation
validate: ## Validate all configurations
	@echo "$(YELLOW)🔍 Validating configurations...$(NC)"
	@docker-compose config > /dev/null && echo "$(GREEN)✅ Docker Compose valid$(NC)" || echo "$(RED)❌ Docker Compose invalid$(NC)"
	@kubectl --dry-run=client apply -k k8s/base/ > /dev/null && echo "$(GREEN)✅ Kubernetes manifests valid$(NC)" || echo "$(RED)❌ Kubernetes manifests invalid$(NC)"

# Environment setup
setup: validate ## Setup development environment
	@echo "$(YELLOW)🚀 Setting up TodoPro development environment...$(NC)"
	@if not exist .env copy .env.example .env 2>nul || echo "$(YELLOW)⚠️ .env already exists$(NC)"
	@docker-compose pull
	@docker-compose build --no-cache
	@echo "$(GREEN)✅ Environment setup complete!$(NC)"

# Generate secure keys
generate-keys: ## Generate secure application keys
	@echo "$(YELLOW)🔑 Generating secure keys...$(NC)"
	@powershell -Command "$$key = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString().Replace('-','')[0..31] -join '')); Write-Host 'APP_KEY=base64:'$$key"
	@powershell -Command "$$jwt = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$$_}); Write-Host 'JWT_SECRET='$$jwt"
	@powershell -Command "$$db = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$$_}); Write-Host 'DB_PASSWORD='$$db"

# Build and test
build: ## Build Docker images
	@echo "$(YELLOW)🔨 Building Docker images...$(NC)"
	@docker-compose build --parallel
	@echo "$(GREEN)✅ Build complete!$(NC)"

test: ## Run all tests
	@echo "$(YELLOW)🧪 Running tests...$(NC)"
	@docker-compose up -d postgres redis
	@timeout /t 10 > nul
	@docker-compose run --rm backend php artisan test
	@docker-compose run --rm frontend npm test -- --watchAll=false --coverage
	@docker-compose down
	@echo "$(GREEN)✅ Tests complete!$(NC)"

# Development
dev: ## Start development environment
	@echo "$(YELLOW)🚀 Starting development environment...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)✅ Development environment started!$(NC)"
	@echo "$(BLUE)📱 Frontend: http://localhost:3000$(NC)"
	@echo "$(BLUE)🔧 Backend: http://localhost:8000$(NC)"
	@echo "$(BLUE)🗄️ Database: localhost:5432$(NC)"
	@echo "$(BLUE)🔴 Redis: localhost:6379$(NC)"

logs: ## Show application logs
	@docker-compose logs -f --tail=100

stop: ## Stop development environment
	@echo "$(YELLOW)⏹️ Stopping development environment...$(NC)"
	@docker-compose down
	@echo "$(GREEN)✅ Environment stopped!$(NC)"

# Production deployment
deploy-k8s: validate ## Deploy to Kubernetes
	@echo "$(YELLOW)☸️ Deploying to Kubernetes...$(NC)"
	@kubectl apply -k k8s/base/
	@kubectl rollout status deployment/frontend -n todopro --timeout=300s
	@kubectl rollout status deployment/backend -n todopro --timeout=300s
	@kubectl rollout status deployment/redis -n todopro --timeout=300s
	@kubectl rollout status statefulset/postgres -n todopro --timeout=300s
	@echo "$(GREEN)✅ Kubernetes deployment complete!$(NC)"

deploy-monitoring: ## Deploy monitoring stack
	@echo "$(YELLOW)📊 Deploying monitoring stack...$(NC)"
	@kubectl apply -f k8s/monitoring/namespace.yaml
	@kubectl apply -f k8s/monitoring/prometheus.yaml
	@kubectl apply -f k8s/monitoring/grafana.yaml
	@kubectl rollout status deployment/prometheus -n monitoring --timeout=300s
	@kubectl rollout status deployment/grafana -n monitoring --timeout=300s
	@echo "$(GREEN)✅ Monitoring stack deployed!$(NC)"
	@echo "$(BLUE)📊 Grafana: kubectl port-forward svc/grafana 3000:3000 -n monitoring$(NC)"
	@echo "$(BLUE)📈 Prometheus: kubectl port-forward svc/prometheus 9090:9090 -n monitoring$(NC)"

# Maintenance
clean: ## Clean up Docker resources
	@echo "$(YELLOW)🧹 Cleaning up Docker resources...$(NC)"
	@docker-compose down -v --remove-orphans
	@docker system prune -af --volumes
	@echo "$(GREEN)✅ Cleanup complete!$(NC)"

backup-db: ## Backup database
	@echo "$(YELLOW)💾 Creating database backup...$(NC)"
	@powershell -Command "$$timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'; docker-compose exec -T postgres pg_dump -U todo_user todo_db > \"backup_$$timestamp.sql\"; Write-Host \"Backup created: backup_$$timestamp.sql\""
	@echo "$(GREEN)✅ Database backup complete!$(NC)"

restore-db: ## Restore database from backup (Usage: make restore-db FILE=backup.sql)
	@echo "$(YELLOW)📥 Restoring database from $(FILE)...$(NC)"
	@docker-compose exec -T postgres psql -U todo_user -d todo_db < $(FILE)
	@echo "$(GREEN)✅ Database restore complete!$(NC)"

# Health checks
health: ## Check application health
	@echo "$(YELLOW)🏥 Checking application health...$(NC)"
	@curl -f http://localhost:8000/api/health > nul 2>&1 && echo "$(GREEN)✅ Backend healthy$(NC)" || echo "$(RED)❌ Backend unhealthy$(NC)"
	@curl -f http://localhost:3000/health > nul 2>&1 && echo "$(GREEN)✅ Frontend healthy$(NC)" || echo "$(RED)❌ Frontend unhealthy$(NC)"
	@docker-compose ps

# Security
security-scan: ## Run security scan
	@echo "$(YELLOW)🔒 Running security scan...$(NC)"
	@docker run --rm -v $(PWD):/app aquasec/trivy fs /app --severity HIGH,CRITICAL
	@echo "$(GREEN)✅ Security scan complete!$(NC)"

# Kubernetes utilities
k8s-status: ## Show Kubernetes status
	@echo "$(YELLOW)☸️ Kubernetes Status:$(NC)"
	@kubectl get pods -n todopro
	@kubectl get services -n todopro
	@kubectl get ingress -n todopro

k8s-logs: ## Show Kubernetes logs
	@kubectl logs -f deployment/backend -n todopro --tail=100

k8s-shell: ## Get shell in backend pod
	@kubectl exec -it deployment/backend -n todopro -- /bin/bash

# Quick commands
quick-start: setup dev ## Quick start (setup + dev)
quick-deploy: build deploy-k8s ## Quick deploy (build + deploy)
full-reset: clean setup dev ## Full reset (clean + setup + dev)
production-deploy: validate build deploy-k8s deploy-monitoring ## Full production deployment

# Development helpers
dev-backend: ## Start only backend services
	@docker-compose up -d postgres redis backend

dev-frontend: ## Start only frontend
	@docker-compose up -d frontend

restart-backend: ## Restart backend service
	@docker-compose restart backend

restart-frontend: ## Restart frontend service
	@docker-compose restart frontend
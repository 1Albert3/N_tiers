.PHONY: help build up down logs clean test

help: ## Affiche l'aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Construit les images Docker
	docker-compose build --no-cache

up: ## Démarre l'application
	docker-compose up -d

down: ## Arrête l'application
	docker-compose down

logs: ## Affiche les logs
	docker-compose logs -f

clean: ## Nettoie les containers et volumes
	docker-compose down -v --remove-orphans
	docker system prune -f

test: ## Lance les tests
	docker-compose exec backend php artisan test
	docker-compose exec frontend npm test -- --coverage --watchAll=false

install: ## Installation complète
	@echo "🚀 Installation de l'environnement Todo App..."
	@make build
	@make up
	@echo "✅ Application disponible sur:"
	@echo "   Frontend: http://localhost:3000"
	@echo "   Backend:  http://localhost:8000/api"
	@echo "   DB:       localhost:5432"

restart: ## Redémarre l'application
	@make down
	@make up

status: ## Affiche le statut des services
	docker-compose ps
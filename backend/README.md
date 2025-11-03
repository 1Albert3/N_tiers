# API de Gestion des Tâches (Todo API)

## Description
API RESTful complète pour la gestion des tâches avec authentification JWT, développée avec Laravel.

## Fonctionnalités
- ✅ Authentification JWT (register, login, logout, refresh)
- ✅ CRUD complet des tâches
- ✅ Toggle statut des tâches (complété/non complété)
- ✅ Filtrage et recherche des tâches
- ✅ Pagination optimisée
- ✅ Validation des données
- ✅ Gestion des erreurs
- ✅ Tests automatisés
- ✅ Architecture modulaire (Repository Pattern)

## Installation

### Prérequis
- PHP 8.1+
- Composer
- MySQL/PostgreSQL ou SQLite
- Node.js (optionnel)

### Étapes d'installation
```bash
# Cloner le projet
git clone <repository-url>
cd todo-api

# Installer les dépendances
composer install

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Générer la clé JWT
php artisan jwt:secret

# Configurer la base de données dans .env
# Exécuter les migrations
php artisan migrate

# Démarrer le serveur
php artisan serve
```

## Endpoints API

### Authentification
```
POST /api/auth/register    - Inscription
POST /api/auth/login       - Connexion
POST /api/auth/logout      - Déconnexion
POST /api/auth/refresh     - Rafraîchir le token
GET  /api/auth/me          - Profil utilisateur
```

### Tâches (Authentification requise)
```
GET    /api/tasks              - Liste des tâches
POST   /api/tasks              - Créer une tâche
GET    /api/tasks/{id}         - Détails d'une tâche
PUT    /api/tasks/{id}         - Modifier une tâche
DELETE /api/tasks/{id}         - Supprimer une tâche
PATCH  /api/tasks/{id}/toggle  - Toggle statut complété
```

### Paramètres de filtrage
- `status`: completed|pending
- `priority`: low|medium|high
- `search`: recherche dans titre/description
- `per_page`: nombre d'éléments par page (max 50)

## Exemples d'utilisation

### Inscription
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

### Créer une tâche
```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ma nouvelle tâche",
    "description": "Description de la tâche",
    "priority": "high",
    "due_date": "2024-12-31 23:59:59"
  }'
```

## Tests
```bash
# Exécuter tous les tests
php artisan test

# Tests spécifiques
php artisan test --filter TaskApiTest
```

## Architecture

### Structure des dossiers
```
app/
├── Http/
│   ├── Controllers/Api/
│   │   ├── AuthController.php
│   │   └── TaskController.php
│   └── Requests/
│       └── TaskRequest.php
├── Models/
│   ├── User.php
│   └── Task.php
└── Repositories/
    └── TaskRepository.php
```

### Patterns utilisés
- **Repository Pattern**: Séparation de la logique métier
- **Request Validation**: Validation centralisée
- **JWT Authentication**: Authentification stateless
- **Resource Controllers**: Structure RESTful

## Sécurité

### Mesures implémentées
- Authentification JWT avec expiration
- Validation stricte des entrées
- Protection CORS configurée
- Isolation des données par utilisateur
- Soft deletes pour les tâches

### Configuration de production
```env
APP_ENV=production
APP_DEBUG=false
JWT_TTL=60
DB_CONNECTION=mysql
CACHE_DRIVER=redis
```

## Performance

### Optimisations
- Index sur les colonnes fréquemment utilisées
- Pagination limitée (max 50 éléments)
- Eager loading des relations
- Cache Redis recommandé

### Monitoring recommandé
- Logs d'erreurs
- Métriques de performance
- Monitoring des requêtes DB

## Déploiement

### Docker (recommandé)
```dockerfile
FROM php:8.1-fpm
# Configuration Docker...
```

### Serveur traditionnel
1. Configurer le serveur web (Nginx/Apache)
2. Installer PHP 8.1+ avec extensions requises
3. Configurer la base de données
4. Déployer le code et exécuter les migrations

## Support
- Laravel 10.x
- PHP 8.1+
- MySQL 8.0+ / PostgreSQL 13+ / SQLite 3.x
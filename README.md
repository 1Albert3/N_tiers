# 🚀 TodoPro - Application 3-Tiers

> Application Todo List moderne avec React, Laravel et PostgreSQL

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   React + TS    │◄──►│   Laravel API   │◄──►│   PostgreSQL    │
│   Port: 3000    │    │   Port: 8000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## ⚡ Démarrage Rapide

```bash
docker-compose up -d
```

## 🔗 URLs

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000/api
- **Health Check**: http://localhost:8000/api/health

## 🛠️ Commandes Docker

```bash
# Démarrer
docker-compose up -d

# Arrêter
docker-compose down

# Logs
docker-compose logs -f

# Reconstruire
docker-compose build --no-cache
docker-compose up -d

# Nettoyer
docker-compose down -v
```

## 💻 Développement Local

### Backend
```bash
cd todo-api-Backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 📁 Structure

```
.
├── frontend/           # React + TypeScript
├── todo-api-Backend/   # Laravel API
└── docker-compose.yml  # Configuration Docker
```
# 🚀 TodoPro - Application 3-Tiers

> Application Todo List moderne avec React, Laravel et PostgreSQL containerisée avec Docker

## 📋 Description de l'Application

**TodoPro** est une application de gestion de tâches complète construite avec une architecture 3-tiers moderne :

- **Frontend React** : Interface utilisateur moderne avec animations, formulaires stylés et design responsive
- **Backend Laravel** : API REST sécurisée avec authentification Sanctum et gestion des tâches
- **Base de données PostgreSQL** : Stockage persistant des utilisateurs et tâches

### ✨ Fonctionnalités
- 🔐 **Authentification** : Inscription/Connexion avec validation
- 📝 **Gestion des tâches** : Créer, modifier, supprimer, marquer comme terminé
- 🎨 **Interface moderne** : Design professionnel avec animations CSS
- 📱 **Responsive** : Fonctionne sur desktop, tablette et mobile
- 🔄 **Temps réel** : Synchronisation instantanée des données

## 🏗️ Architecture Docker

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   React + TS    │◄──►│   Laravel API   │◄──►│   PostgreSQL    │
│   Port: 3000    │    │   Port: 8000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**3 conteneurs Docker** orchestrés avec Docker Compose :
- **Frontend** : Serveur de développement React
- **Backend** : Serveur PHP Laravel avec extensions PostgreSQL
- **Database** : PostgreSQL 15 Alpine avec volume persistant

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

## 🚨 Problèmes Rencontrés et Solutions

### 1. **Problème de connexion PostgreSQL**
**Symptôme** : Backend ne démarre pas, erreur de connexion DB
```
backend-1 | Waiting for database...
backend-1 | Database not ready, waiting...
```
**Solution** : 
- Simplification du script d'entrée Docker
- Ajout d'un délai d'attente fixe (10s)
- Utilisation de PostgreSQL 15 Alpine officiel

### 2. **Fichier .env.example manquant**
**Symptôme** : 
```
backend-1 | cp: can't stat '.env.example': No such file or directory
```
**Solution** : Création du fichier `.env.example` avec la configuration PostgreSQL

### 3. **Erreurs de construction Docker**
**Symptôme** : Échec d'installation des dépendances Alpine
```
ERROR: gcc-14.2.0-r6: IO ERROR
ERROR: DNS lookup error
```
**Solution** : 
- Simplification du Dockerfile
- Installation uniquement des dépendances essentielles
- Utilisation d'images de base stables

### 4. **Problème de CORS**
**Symptôme** : Frontend ne peut pas accéder à l'API
**Solution** : 
- Configuration CORS dans Laravel
- Middleware personnalisé pour les en-têtes
- Configuration des origines autorisées

### 5. **Conflit avec XAMPP**
**Symptôme** : PostgreSQL Docker en conflit avec MySQL XAMPP
**Solution** : 
- Utilisation de ports différents
- Configuration spécifique pour PostgreSQL
- Isolation des services Docker

## 💻 Développement Local (sans Docker)

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

## 📁 Structure du Projet

```
.
├── frontend/              # Application React TypeScript
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── pages/         # Pages principales
│   │   └── contexts/      # Contextes React
│   ├── Dockerfile         # Image Docker frontend
│   └── package.json       # Dépendances Node.js
├── todo-api-Backend/      # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/  # Contrôleurs API
│   │   └── Models/        # Modèles Eloquent
│   ├── routes/api.php     # Routes API
│   ├── Dockerfile         # Image Docker backend
│   └── composer.json      # Dépendances PHP
├── docker-compose.yml     # Orchestration des services
└── README.md             # Documentation
```

## 🔧 Configuration Docker

### Services définis dans docker-compose.yml :
- **Frontend** : React dev server (port 3000)
- **Backend** : Laravel API (port 8000) 
- **PostgreSQL** : Base de données (port 5432)

### Volumes persistants :
- `postgres_data` : Données PostgreSQL persistantes

### Réseau :
- `todo-network` : Réseau bridge pour communication inter-services

## 🎯 Contraintes Techniques

1. **Docker requis** : L'application nécessite Docker et Docker Compose
2. **Ports utilisés** : 3000, 8000, 5432 doivent être libres
3. **Ressources** : Minimum 2GB RAM pour les 3 conteneurs
4. **Temps de démarrage** : ~2 minutes pour la première construction
5. **PostgreSQL uniquement** : Pas de support MySQL dans cette version
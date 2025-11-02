# 🚀 Todo App - Architecture 3-Tiers Containerisée

> Application Todo List complète avec architecture microservices containerisée

## 📋 Vue d'ensemble

Application Todo List moderne construite avec une architecture 3-tiers :
- **Frontend** : React + TypeScript + Nginx
- **Backend** : Laravel API + JWT Auth
- **Database** : PostgreSQL

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   React + TS    │◄──►│   Laravel API   │◄──►│   PostgreSQL    │
│   Port: 3000    │    │   Port: 8000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## ⚡ Installation Rapide

### Windows (PowerShell)
```powershell
.\install.ps1
```

### Linux/Mac (Make)
```bash
make install
```

### Manuel
```bash
git clone <votre-repo>
cd todo-api-main
docker-compose up -d
```

## 🔗 URLs d'accès

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Interface utilisateur |
| Backend | http://localhost:8000/api | API REST |
| Database | localhost:5432 | PostgreSQL |

## 🛠️ Commandes Utiles

### Gestion des containers
```bash
# Démarrer
docker-compose up -d

# Arrêter
docker-compose down

# Voir les logs
docker-compose logs -f

# Reconstruire
docker-compose build --no-cache

# Nettoyer
docker-compose down -v --remove-orphans
```

### Avec Make (Linux/Mac)
```bash
make up      # Démarrer
make down    # Arrêter
make logs    # Voir logs
make test    # Lancer tests
make clean   # Nettoyer
```

## 💻 Développement Local

### Backend (Laravel)
```bash
cd todo-api-Backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend (React)
```bash
cd frontend
npm install
npm start
```

## Tests

### Backend
```bash
cd todo-api-Backend
php artisan test
```

### Frontend
```bash
cd frontend
npm test
```

## Déploiement

L'application utilise GitHub Actions pour le CI/CD avec le workflow suivant :

1. **Test** : Exécution des tests backend et frontend
2. **Build** : Construction des images Docker
3. **Push** : Publication des images sur Docker Hub
4. **Deploy** : Déploiement sur Kubernetes

### Configuration Kubernetes

Les fichiers de configuration Kubernetes se trouvent dans le dossier `k8s/` et incluent :
- Deployments pour frontend et backend
- StatefulSet pour PostgreSQL
- Services pour l'exposition des applications
- ConfigMaps et Secrets pour la configuration

Pour déployer sur Kubernetes :
```bash
kubectl apply -f k8s/deployment.yaml
```

## Pipeline CI/CD

Le pipeline CI/CD est configuré dans `.github/workflows/ci-cd.yml` et comprend :

1. **Tests** :
   - Tests PHPUnit pour le backend
   - Tests Jest pour le frontend

2. **Build et Push** :
   - Construction des images Docker
   - Publication sur Docker Hub

3. **Déploiement** :
   - Déploiement automatique sur Kubernetes

## Structure du Projet

```
.
├── frontend/               # Application React
├── todo-api-Backend/      # API Laravel
├── k8s/                   # Configuration Kubernetes
└── .github/workflows/     # Pipeline CI/CD
```

## Variables d'Environnement

### Backend
- `DB_CONNECTION=pgsql`
- `DB_HOST=postgres`
- `DB_PORT=5432`
- `DB_DATABASE=todo_db`
- `DB_USERNAME=todo_user`
- `DB_PASSWORD=todo_password`

### Frontend
- `REACT_APP_API_URL=http://localhost:8000/api`

## Sécurité

- Authentification JWT pour l'API
- CORS configuré pour la sécurité
- Variables sensibles stockées dans des secrets Kubernetes
- HTTPS en production

## Monitoring et Logs

- Logs Laravel stockés dans `storage/logs/`
- Logs Docker accessibles via `docker logs`
- Métriques Kubernetes via kubectl

## Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub.
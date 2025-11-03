# TodoPro - Application 3-tiers avec Docker et Kubernetes

## Architecture

Application Todo List composée de 3 tiers :
- **Frontend** : React avec Nginx
- **Backend** : Laravel API  
- **Database** : PostgreSQL

## Conteneurisation Docker

### 1. Build des images

```bash
# Frontend
docker build -t your-dockerhub-username/todo-frontend:latest ./frontend/

# Backend  
docker build -t your-dockerhub-username/todo-backend:latest ./todo-api-Backend/

# Database
docker build -t your-dockerhub-username/todo-database:latest ./database-tier/
```

### 2. Test local avec Docker Compose

```bash
docker-compose up -d
```

## Déploiement Kubernetes

### 1. Prérequis
- Cluster Kubernetes configuré
- kubectl installé

### 2. Déploiement

```bash
# Appliquer tous les manifests
kubectl apply -k k8s/base/

# Vérifier le déploiement
kubectl get pods -n todopro
kubectl get services -n todopro
```

### 3. Accès à l'application

```bash
# Port forwarding pour tester
kubectl port-forward svc/frontend-service 3000:3000 -n todopro
kubectl port-forward svc/backend-service 8000:8000 -n todopro
```

## Structure des fichiers

```
├── frontend/
│   └── Dockerfile
├── todo-api-Backend/
│   └── Dockerfile  
├── database-tier/
│   └── Dockerfile
├── k8s/base/
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── db-statefulset.yaml
│   ├── db-service.yaml
│   └── kustomization.yaml
└── docker-compose.yml
```

## Configuration

Modifier les images dans les fichiers de déploiement :
- Remplacer `your-dockerhub-username` par votre nom d'utilisateur Docker Hub
- Ajuster les variables d'environnement dans `configmap.yaml` et `secret.yaml`
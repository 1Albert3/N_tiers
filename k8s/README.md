# 🚢 TodoPro Kubernetes Deployment

> Configuration Kubernetes pour déployer TodoPro en production

## 📋 Vue d'ensemble

Cette configuration K8s déploie l'application TodoPro avec :
- **Frontend React** (2 replicas)
- **Backend Laravel** (2 replicas) 
- **PostgreSQL** (1 replica avec stockage persistant)

## 🏗️ Architecture K8s

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Ingress       │    │   Services      │    │   Deployments   │
│   HTTPS/TLS     │◄──►│   ClusterIP     │◄──►│   Pods          │
│   Load Balancer │    │   Internal DNS  │    │   Containers    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Déploiement

### Prérequis
- Cluster Kubernetes fonctionnel
- kubectl configuré
- Images Docker buildées et pushées

### Commandes de déploiement

```bash
# Appliquer la configuration
kubectl apply -k k8s/base/

# Vérifier le déploiement
kubectl get pods -n todopro
kubectl get services -n todopro
kubectl get ingress -n todopro

# Voir les logs
kubectl logs -f deployment/backend -n todopro
kubectl logs -f deployment/frontend -n todopro
```

### Test de la configuration

```bash
# Lancer les tests
kubectl apply -f k8s/test-k8s.yaml

# Voir les résultats
kubectl logs todopro-test -n todopro

# Nettoyer le test
kubectl delete pod todopro-test -n todopro
```

## 📦 Composants

### ConfigMap
- Variables d'environnement non sensibles
- Configuration PostgreSQL
- URLs d'API

### Secret
- Mots de passe base de données
- Clés JWT et APP_KEY
- Credentials sécurisés

### Deployments
- **Frontend** : 2 replicas React
- **Backend** : 2 replicas Laravel avec health checks

### StatefulSet
- **PostgreSQL** : 1 replica avec volume persistant 10Gi

### Services
- **frontend-service** : ClusterIP port 80
- **backend-service** : ClusterIP port 8000
- **postgres-service** : Headless service port 5432

### Ingress
- **HTTPS/TLS** avec Let's Encrypt
- **Domaines** : todopro.example.com, api.todopro.example.com

## 🔧 Configuration

### Variables d'environnement

**ConfigMap (todopro-config):**
- APP_ENV=production
- DB_CONNECTION=pgsql
- DB_HOST=postgres-service
- REACT_APP_API_URL=https://api.todopro.example.com

**Secret (todopro-secrets):**
- DB_USERNAME=todo_user
- DB_PASSWORD=todo_password_secure_k8s
- APP_KEY=base64:...
- JWT_SECRET=...

### Ressources

**Frontend:**
- Requests: 256Mi RAM, 250m CPU
- Limits: 512Mi RAM, 500m CPU

**Backend:**
- Requests: 512Mi RAM, 500m CPU  
- Limits: 1Gi RAM, 1000m CPU

**PostgreSQL:**
- Requests: 512Mi RAM, 500m CPU
- Limits: 1Gi RAM, 1000m CPU
- Storage: 10Gi persistant

## 🔍 Monitoring

### Health Checks

**Backend:**
- Liveness: GET /api/health (60s delay, 30s interval)
- Readiness: GET /api/health (30s delay, 10s interval)

**Frontend:**
- Liveness: GET / (30s delay, 10s interval)
- Readiness: GET / (5s delay, 5s interval)

**PostgreSQL:**
- Liveness: pg_isready (30s delay, 10s interval)
- Readiness: pg_isready (5s delay, 5s interval)

## 🛠️ Maintenance

### Mise à jour des images

```bash
# Mettre à jour l'image backend
kubectl set image deployment/backend backend=todopro-backend:v1.1.0 -n todopro

# Mettre à jour l'image frontend  
kubectl set image deployment/frontend frontend=todopro-frontend:v1.1.0 -n todopro

# Vérifier le rollout
kubectl rollout status deployment/backend -n todopro
```

### Scaling

```bash
# Scaler le backend
kubectl scale deployment backend --replicas=3 -n todopro

# Scaler le frontend
kubectl scale deployment frontend --replicas=4 -n todopro
```

### Backup PostgreSQL

```bash
# Créer un backup
kubectl exec -it postgres-0 -n todopro -- pg_dump -U todo_user todo_db > backup.sql

# Restaurer un backup
kubectl exec -i postgres-0 -n todopro -- psql -U todo_user todo_db < backup.sql
```

## 🚨 Troubleshooting

### Problèmes courants

1. **Pods en CrashLoopBackOff**
   ```bash
   kubectl describe pod <pod-name> -n todopro
   kubectl logs <pod-name> -n todopro
   ```

2. **Base de données non accessible**
   ```bash
   kubectl exec -it postgres-0 -n todopro -- psql -U todo_user todo_db
   ```

3. **Ingress non fonctionnel**
   ```bash
   kubectl describe ingress todopro-ingress -n todopro
   ```

## 🔒 Sécurité

- **TLS/HTTPS** activé avec Let's Encrypt
- **Secrets** chiffrés dans etcd
- **Network Policies** recommandées
- **RBAC** à configurer selon l'environnement
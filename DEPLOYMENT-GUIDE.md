# 🚀 Guide de Déploiement TodoPro - Architecture Optimisée

## ✅ **Corrections Appliquées**

### 🔧 **Problèmes Résolus**
- ✅ **Architecture unifiée** - Database intégrée au backend
- ✅ **Frontend stable** - Erreurs React DOM éliminées
- ✅ **Sécurité renforcée** - Rate limiting, validation robuste
- ✅ **Docker optimisé** - Multi-stage builds, health checks
- ✅ **Kubernetes production-ready** - HPA, NetworkPolicy, Secrets

### 🏗️ **Nouvelle Structure**
```
todopro/
├── frontend/                 # React TypeScript optimisé
├── backend/                  # Laravel avec DB intégrée
├── k8s/                     # Manifests Kubernetes
├── .github/workflows/       # CI/CD Pipeline complet
├── docker-compose.yml       # Développement
├── docker-compose.production.yml # Production
└── README.md
```

## 🚀 **Déploiement**

### **1. Développement Local**
```bash
# Démarrer Docker Desktop
docker-compose up -d

# Vérifier les services
docker-compose ps
curl http://localhost:3000
curl http://localhost:8000/api/health
```

### **2. Production Docker**
```bash
# Variables d'environnement
export APP_KEY=$(php artisan key:generate --show)
export JWT_SECRET=$(openssl rand -base64 32)
export DB_PASSWORD=$(openssl rand -base64 32)

# Déploiement
docker-compose -f docker-compose.production.yml up -d
```

### **3. Kubernetes**
```bash
# Activer Kubernetes dans Docker Desktop
# Settings > Kubernetes > Enable Kubernetes

# Construire les images
docker build -t todopro-frontend:latest ./frontend
docker build -t todopro-backend:latest ./backend

# Charger dans minikube (si utilisé)
minikube image load todopro-frontend:latest
minikube image load todopro-backend:latest

# Déployer
kubectl apply -k k8s/base/

# Vérifier
kubectl get pods -n todopro
kubectl get svc -n todopro

# Accès
minikube service frontend-service -n todopro
```

## 🔒 **Sécurité**

### **Secrets à Configurer**
```bash
# GitHub Secrets pour CI/CD
GITHUB_TOKEN=ghp_xxx
SONAR_TOKEN=xxx
KUBE_CONFIG_STAGING=base64_encoded_kubeconfig
KUBE_CONFIG_PROD=base64_encoded_kubeconfig
SLACK_WEBHOOK_URL=https://hooks.slack.com/xxx

# Kubernetes Secrets
kubectl create secret generic todopro-secrets \
  --from-literal=APP_KEY="base64:$(openssl rand -base64 32)" \
  --from-literal=JWT_SECRET="$(openssl rand -base64 32)" \
  --from-literal=DB_PASSWORD="$(openssl rand -base64 32)" \
  -n todopro
```

## 📊 **Monitoring & Observabilité**

### **Métriques Disponibles**
- **Health Checks** : `/api/health`
- **Logs centralisés** : Docker logs + Kubernetes logs
- **Performance** : Redis cache, PostgreSQL optimisé
- **Sécurité** : Rate limiting, validation stricte

### **Commandes de Debug**
```bash
# Logs Docker
docker-compose logs -f backend
docker-compose logs -f frontend

# Logs Kubernetes
kubectl logs -f deployment/backend -n todopro
kubectl logs -f deployment/frontend -n todopro

# Métriques
kubectl top pods -n todopro
kubectl describe hpa -n todopro
```

## 🧪 **Tests**

### **Frontend**
```bash
cd frontend
npm test                    # Unit tests
npm run test:coverage      # Coverage
npm run test:e2e          # E2E tests
npm run lint              # ESLint
```

### **Backend**
```bash
cd backend
php artisan test          # PHPUnit
vendor/bin/phpstan analyse # Static analysis
vendor/bin/php-cs-fixer fix # Code style
```

## 🔄 **CI/CD Pipeline**

### **Déclencheurs**
- **Push sur `main`** → Tests + Build + Deploy Production
- **Push sur `develop`** → Tests + Build + Deploy Staging  
- **Pull Request** → Tests uniquement

### **Étapes**
1. **Security Scan** (Trivy, SonarCloud)
2. **Tests** (Frontend Jest + Backend PHPUnit)
3. **Build Images** (Docker multi-stage)
4. **Deploy** (Kubernetes rolling update)
5. **Smoke Tests** (Health checks)

## 🎯 **Performance**

### **Optimisations Appliquées**
- **Frontend** : Code splitting, lazy loading, memoization
- **Backend** : OPcache, Redis cache, query optimization
- **Database** : Indexes, connection pooling, read replicas
- **Infrastructure** : Resource limits, HPA, CDN ready

### **Métriques Cibles**
- **Response Time** : < 200ms (API)
- **First Paint** : < 1.5s (Frontend)
- **Availability** : 99.9%
- **Error Rate** : < 0.1%

## 🆘 **Troubleshooting**

### **Problèmes Courants**

#### **1. Erreur de connexion DB**
```bash
# Vérifier PostgreSQL
kubectl exec -it postgres-0 -n todopro -- psql -U todo_user -d todo_db -c "SELECT 1;"

# Recréer les secrets
kubectl delete secret todopro-secrets -n todopro
kubectl apply -k k8s/base/
```

#### **2. Images non trouvées**
```bash
# Reconstruire
docker build --no-cache -t todopro-frontend:latest ./frontend
docker build --no-cache -t todopro-backend:latest ./backend

# Charger dans minikube
minikube image load todopro-frontend:latest
minikube image load todopro-backend:latest
```

#### **3. Pods en CrashLoop**
```bash
# Diagnostiquer
kubectl describe pod <pod-name> -n todopro
kubectl logs <pod-name> -n todopro --previous

# Redémarrer
kubectl rollout restart deployment/backend -n todopro
```

## 📈 **Roadmap**

### **Phase 2 - Observabilité**
- [ ] Prometheus + Grafana
- [ ] Jaeger tracing
- [ ] ELK Stack logging
- [ ] Alerting (PagerDuty)

### **Phase 3 - Scalabilité**
- [ ] Multi-region deployment
- [ ] CDN integration
- [ ] Database sharding
- [ ] Microservices migration

### **Phase 4 - Sécurité Avancée**
- [ ] OAuth2/OIDC
- [ ] Vault secrets management
- [ ] Network policies
- [ ] Security scanning automation

---

**🎉 TodoPro est maintenant production-ready avec une architecture DevOps moderne !**
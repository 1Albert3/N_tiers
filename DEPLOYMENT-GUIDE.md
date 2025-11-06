# 🚀 TodoPro - Guide de Déploiement DevOps

## 📋 Prérequis

### Environnement Local
- **Docker Desktop** 4.20+ avec Kubernetes activé
- **kubectl** 1.28+
- **Make** (optionnel, pour les commandes automatisées)
- **Git** 2.40+

### Environnement Production
- **Cluster Kubernetes** 1.28+
- **Ingress Controller** (nginx recommandé)
- **Storage Class** pour les volumes persistants
- **Registry Docker** (Docker Hub ou privé)

## 🔧 Installation Rapide

### 1. Clonage et Configuration
```bash
git clone <repository-url>
cd todopro
make setup
```

### 2. Génération des Clés Sécurisées
```bash
make generate-keys
# Copier les clés générées dans .env
```

### 3. Démarrage Local
```bash
make dev
```

**URLs d'accès :**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Health: http://localhost:8000/api/health

## ☸️ Déploiement Kubernetes

### 1. Préparation des Secrets
```bash
# Créer les secrets Kubernetes
kubectl create secret generic todopro-secrets \
  --from-literal=DB_USERNAME=todo_user \
  --from-literal=DB_PASSWORD=<secure-password> \
  --from-literal=APP_KEY=<generated-key> \
  --from-literal=JWT_SECRET=<generated-secret> \
  -n todopro

# Créer le secret pour le registry Docker
kubectl create secret docker-registry todopro-registry-secret \
  --docker-server=docker.io \
  --docker-username=<username> \
  --docker-password=<token> \
  -n todopro
```

### 2. Déploiement
```bash
# Déploiement complet
make deploy-k8s

# Ou manuellement
kubectl apply -k k8s/base/
```

### 3. Vérification
```bash
kubectl get pods -n todopro
kubectl get services -n todopro
make health
```

## 📊 Monitoring

### Déploiement du Stack de Monitoring
```bash
make deploy-monitoring
```

### Accès aux Interfaces
```bash
# Grafana
kubectl port-forward svc/grafana 3000:3000 -n monitoring
# Accès: http://localhost:3000 (admin/admin123)

# Prometheus
kubectl port-forward svc/prometheus 9090:9090 -n monitoring
# Accès: http://localhost:9090
```

## 🔄 Pipeline CI/CD

### Configuration GitHub Actions

1. **Secrets à configurer dans GitHub :**
```
DOCKER_USERNAME=<dockerhub-username>
DOCKER_PASSWORD=<dockerhub-token>
KUBE_CONFIG_STAGING=<base64-encoded-kubeconfig>
KUBE_CONFIG_PROD=<base64-encoded-kubeconfig>
```

2. **Workflow automatique :**
- **Push sur `develop`** → Tests + Build + Deploy Staging
- **Push sur `main`** → Tests + Build + Deploy Production
- **Pull Request** → Tests uniquement

### Commandes Manuelles
```bash
# Tests locaux
make test

# Scan de sécurité
make security-scan

# Build et push des images
docker build -t todopro-frontend:latest ./frontend
docker build -t todopro-backend:latest ./backend
```

## 🗄️ Gestion de la Base de Données

### Backup
```bash
make backup-db
```

### Restauration
```bash
make restore-db FILE=backup_20240101_120000.sql
```

### Migration
```bash
# En local
docker-compose exec backend php artisan migrate

# En Kubernetes
kubectl exec -it deployment/backend -n todopro -- php artisan migrate
```

## 🔒 Sécurité

### Bonnes Pratiques Appliquées
- ✅ **Secrets chiffrés** dans Kubernetes
- ✅ **NetworkPolicies** pour isoler les services
- ✅ **Non-root containers** 
- ✅ **Scan de vulnérabilités** automatique
- ✅ **HTTPS/TLS** via Ingress
- ✅ **RBAC** pour Prometheus

### Rotation des Secrets
```bash
# Générer de nouveaux secrets
make generate-keys

# Mettre à jour dans Kubernetes
kubectl patch secret todopro-secrets -n todopro -p='{"data":{"APP_KEY":"<new-key>"}}'
kubectl rollout restart deployment/backend -n todopro
```

## 🚨 Dépannage

### Problèmes Courants

#### 1. Pods en CrashLoopBackOff
```bash
kubectl describe pod <pod-name> -n todopro
kubectl logs <pod-name> -n todopro
```

#### 2. Base de données inaccessible
```bash
kubectl exec -it statefulset/postgres -n todopro -- psql -U todo_user -d todo_db
```

#### 3. Images non trouvées
```bash
# Vérifier les secrets du registry
kubectl get secret todopro-registry-secret -n todopro -o yaml

# Reconstruire les images
make build
```

### Commandes de Debug
```bash
# Logs en temps réel
make logs

# État des ressources
kubectl get all -n todopro

# Événements récents
kubectl get events -n todopro --sort-by='.lastTimestamp'
```

## 📈 Scaling et Performance

### Scaling Horizontal
```bash
# Manuel
kubectl scale deployment backend --replicas=5 -n todopro

# Automatique (HPA configuré)
kubectl get hpa -n todopro
```

### Optimisation des Ressources
```yaml
# Ajuster dans les deployments
resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
  limits:
    memory: "1Gi"
    cpu: "500m"
```

## 🔄 Mise à Jour

### Rolling Update
```bash
# Nouvelle version
kubectl set image deployment/backend backend=todopro-backend:v2.0.0 -n todopro
kubectl rollout status deployment/backend -n todopro
```

### Rollback
```bash
kubectl rollout undo deployment/backend -n todopro
```

## 📞 Support

### Logs et Métriques
- **Grafana**: Dashboards de monitoring
- **Prometheus**: Métriques et alertes
- **Kubernetes Events**: `kubectl get events`

### Contacts
- **DevOps Team**: devops@company.com
- **Documentation**: Ce README et les commentaires dans le code
- **Issues**: GitHub Issues du projet

---

## ✅ Checklist de Déploiement

### Pré-déploiement
- [ ] Secrets générés et configurés
- [ ] Images Docker buildées et pushées
- [ ] Cluster Kubernetes accessible
- [ ] Storage classes configurées
- [ ] Ingress controller déployé

### Post-déploiement
- [ ] Tous les pods sont Running
- [ ] Health checks passent
- [ ] Base de données accessible
- [ ] Monitoring fonctionnel
- [ ] Tests de bout en bout réussis

### Production
- [ ] Backup automatique configuré
- [ ] Alertes configurées
- [ ] Documentation à jour
- [ ] Équipe formée sur les procédures
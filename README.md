# 🚀 TodoPro - Application 3-Tiers DevOps

> **Application Todo List complète avec architecture DevOps moderne : Docker, Kubernetes, CI/CD + Monitoring**

## 📋 Table des matières

- [🎯 Vue d'ensemble](#-vue-densemble)
- [🏗️ Architecture](#️-architecture)
- [⚙️ Installation et Configuration](#️-installation-et-configuration)
- [🐳 Déploiement Docker](#-déploiement-docker)
- [📊 Monitoring Prometheus/Grafana](#-monitoring-prometheusgrafana)
- [☸️ Déploiement Kubernetes](#️-déploiement-kubernetes)
- [🔄 Pipeline CI/CD](#-pipeline-cicd)
- [🛠️ Dépannage](#️-dépannage)

---

## 🎯 Vue d'ensemble

**TodoPro** est une application de gestion de tâches moderne développée avec une architecture 3-tiers :

- **Frontend** : React + TypeScript avec interface moderne
- **Backend** : Laravel API avec authentification JWT
- **Base de données** : PostgreSQL avec persistance des données
- **Monitoring** : Prometheus + Grafana + cAdvisor

### ✨ Fonctionnalités

- ✅ Authentification utilisateur sécurisée
- ✅ Gestion complète des tâches (CRUD)
- ✅ Interface utilisateur responsive
- ✅ API REST documentée
- ✅ Conteneurisation Docker
- ✅ Monitoring complet (CPU, RAM, métriques app)
- ✅ Orchestration Kubernetes
- ✅ Pipeline CI/CD automatisé

---

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   React + TS    │◄──►│   Laravel API   │◄──►│   PostgreSQL    │
│   Port: 3000    │    │   Port: 8000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Monitoring    │
                    │ Prometheus:9090 │
                    │ Grafana:3001    │
                    │ cAdvisor:8080   │
                    └─────────────────┘
```

---

## ⚙️ Installation et Configuration

### 🚀 Démarrage Rapide

```bash
# 1. Cloner le projet
git clone https://github.com/votre-repo/todopro.git
cd todopro

# 2. Démarrer avec monitoring complet
update-monitoring.bat

# 3. Accéder aux services
# Application: http://localhost:3000
# Grafana: http://localhost:3001 (admin/admin)
```

### 📋 Prérequis

- Docker Desktop (Windows 10/11)
- WSL 2 activé
- 8GB RAM recommandé
- Git pour Windows

---

## 🐳 Déploiement Docker

### 🚀 Commandes essentielles

```bash
# Démarrage standard
docker-compose up -d

# Démarrage avec monitoring
docker-compose -f docker-compose.monitoring.yml up -d

# Vérifier le statut
docker-compose ps

# Voir les logs
docker-compose logs -f
```

### 📊 Services disponibles

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Interface utilisateur React |
| **Backend** | http://localhost:8000 | API Laravel |
| **Database** | localhost:5432 | PostgreSQL (accès interne) |

---

## 📊 Monitoring Prometheus/Grafana

### 🚀 Démarrage du Monitoring

```bash
# Démarrer l'application avec monitoring complet
update-monitoring.bat
```

### 🔗 URLs d'Accès

| Service | URL | Identifiants |
|---------|-----|-------------|
| **Application** | http://localhost:3000 | - |
| **API Backend** | http://localhost:8000 | - |
| **Prometheus** | http://localhost:9090 | - |
| **Grafana** | http://localhost:3001 | admin / admin |
| **cAdvisor** | http://localhost:8080 | - |
| **Métriques API** | http://localhost:8000/api/metrics | - |

### 📈 Dashboard Grafana Complet

#### Métriques Application
- **Total Users** - Nombre d'utilisateurs enregistrés
- **Total Tasks** - Nombre total de tâches

#### Métriques Système
- **CPU Usage %** - Utilisation CPU en temps réel
- **Memory Usage %** - Utilisation RAM en temps réel
- **CPU Usage Over Time** - Graphique historique CPU
- **Memory Usage Over Time** - Graphique historique RAM

#### Sources de Données
- **Backend API** : Métriques applicatives
- **cAdvisor** : Métriques conteneurs Docker

### 🛠️ Commandes Monitoring

```bash
# Test des métriques
test-metrics.bat

# Vérification complète
check-monitoring.bat

# Redémarrage backend uniquement
restart-backend.bat
```

---

## ☸️ Déploiement Kubernetes

### 📋 Prérequis Kubernetes

```bash
# Activer Kubernetes dans Docker Desktop
kubectl version --client
kubectl cluster-info
```

### 🚀 Déploiement

```bash
# Déployer tous les composants
kubectl apply -k k8s/base/

# Vérifier le déploiement
kubectl get pods -n todopro
kubectl get services -n todopro

# Accéder à l'application
kubectl port-forward svc/frontend-service 3000:3000 -n todopro
```

---

## 🔄 Pipeline CI/CD

### 🔧 Configuration GitHub Actions

Le pipeline CI/CD est configuré dans `.github/workflows/ci-cd.yml`.

#### 📋 Secrets GitHub requis

```bash
DOCKER_USERNAME=votre-username-dockerhub
DOCKER_PASSWORD=votre-token-dockerhub
KUBE_CONFIG_STAGING=base64-encoded-kubeconfig
KUBE_CONFIG_PROD=base64-encoded-kubeconfig
```

#### 🔄 Workflow automatique

| Événement | Actions |
|-----------|---------|
| **Push sur `main`** | Tests → Build → Deploy Production |
| **Push sur `develop`** | Tests → Build → Deploy Staging |
| **Pull Request** | Tests uniquement |

---

## 🛠️ Dépannage

### ❌ Problèmes courants

#### **Docker ne démarre pas**
```bash
# Vérifier Docker Desktop
docker --version

# Redémarrer si nécessaire
# Vérifier les ressources (RAM > 4GB)
```

#### **Port déjà utilisé**
```bash
# Trouver le processus
netstat -ano | findstr :3000

# Tuer le processus
taskkill /PID 1234 /F
```

#### **Monitoring ne fonctionne pas**
```bash
# Redémarrer le monitoring
update-monitoring.bat

# Vérifier les métriques
test-metrics.bat
```

### 🔍 Logs et Debugging

```bash
# Logs détaillés
docker-compose -f docker-compose.monitoring.yml logs -f

# Logs d'un service spécifique
docker-compose logs backend
docker-compose logs prometheus
docker-compose logs grafana
```

---

## 📄 Licence

Ce projet est sous licence MIT.

---

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

---

**🎉 TodoPro est maintenant opérationnel avec monitoring complet !**
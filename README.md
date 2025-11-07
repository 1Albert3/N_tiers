# 🚀 TodoPro - Application 3-Tiers DevOps

> **Application Todo List complète avec architecture DevOps moderne : Docker, Kubernetes, CI/CD + Monitoring**

## 📋 Table des matières

- [🎯 Vue d'ensemble](#-vue-densemble)
- [🏗️ Architecture](#️-architecture)
- [⚙️ Installation et Configuration](#️-installation-et-configuration)
- [🐳 Déploiement Docker](#-déploiement-docker)
- [☸️ Déploiement Kubernetes](#️-déploiement-kubernetes)
- [📊 Monitoring Prometheus/Grafana](#-monitoring-prometheusgrafana)
- [🔄 Pipeline CI/CD](#-pipeline-cicd)
- [⚠️ Difficultés Rencontrées et Solutions](#️-difficultés-rencontrées-et-solutions)
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

### 📋 Prérequis

- Docker Desktop (Windows 10/11)
- Kubernetes activé dans Docker Desktop
- WSL 2 activé
- 8GB RAM recommandé
- Git pour Windows

### 🚀 Démarrage Rapide

```bash
# 1. Cloner le projet
git clone https://github.com/votre-repo/todopro.git
cd todopro

# 2. Choisir votre méthode de déploiement
```

---

## 🐳 Déploiement Docker

### 🚀 Démarrage Automatique (Recommandé)

```bash
# Démarrer avec monitoring complet
docker-start.bat

# Arrêter l'application
docker-stop.bat
```

### 📊 Services disponibles

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Interface utilisateur React |
| **Backend** | http://localhost:8000 | API Laravel |
| **Prometheus** | http://localhost:9090 | Métriques système |
| **Grafana** | http://localhost:3001 | Dashboards (admin/admin) |
| **cAdvisor** | http://localhost:8080 | Métriques conteneurs |

### 🔧 Commandes manuelles

```bash
# Démarrage avec monitoring
docker-compose -f docker-compose.monitoring.yml up -d

# Arrêt
docker-compose -f docker-compose.monitoring.yml down

# Voir les logs
docker-compose logs -f backend
```

---

## ☸️ Déploiement Kubernetes

### 🚀 Démarrage Automatique (Recommandé)

```bash
# Démarrer avec Kubernetes
k8s-start.bat

# Arrêter l'application
k8s-stop.bat
```

Le script `k8s-start.bat` :
- ✅ Déploie tous les composants (app + monitoring)
- ✅ Lance automatiquement les port-forwards en arrière-plan
- ✅ Accès sur les mêmes ports que Docker (3000, 8000, 9090, 3001)

### 📊 Services disponibles

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Interface utilisateur React |
| **Backend** | http://localhost:8000 | API Laravel |
| **Prometheus** | http://localhost:9090 | Métriques système |
| **Grafana** | http://localhost:3001 | Dashboards (admin/admin) |

### 🔧 Commandes manuelles

```bash
# Déploiement complet
kubectl apply -k k8s/

# Vérifier les pods
kubectl get pods -n todopro
kubectl get pods -n monitoring

# Port-forwards manuels (si nécessaire)
kubectl port-forward svc/frontend-service 3000:3000 -n todopro
kubectl port-forward svc/backend-service 8000:8000 -n todopro
kubectl port-forward svc/prometheus 9090:9090 -n monitoring
kubectl port-forward svc/grafana 3001:3000 -n monitoring

# Suppression
kubectl delete -k k8s/
```

---

## 📊 Monitoring Prometheus/Grafana

### 📈 Dashboard Grafana Complet

#### Métriques Application
- **Total Users** - Nombre d'utilisateurs enregistrés
- **Total Tasks** - Nombre total de tâches
- **Temps de réponse HTTP** - Performance API

#### Métriques Système
- **CPU Usage %** - Utilisation CPU en temps réel
- **Memory Usage** - Utilisation RAM
- **Trafic Réseau** - Entrant/Sortant

#### Sources de Données
- **Backend API** : Métriques applicatives (`/api/metrics`)
- **cAdvisor** : Métriques conteneurs Docker
- **Prometheus** : Métriques Kubernetes

---

## 🔄 Pipeline CI/CD

### 🔧 Configuration GitHub Actions

Le pipeline CI/CD est configuré dans `.github/workflows/ci-cd.yml`.

#### 📋 Secrets GitHub requis

```bash
DOCKERHUB_USERNAME=votre-username-dockerhub
DOCKERHUB_TOKEN=votre-token-dockerhub
```

#### 🔄 Workflow automatique

| Événement | Actions |
|-----------|---------|
| **Push sur `main`** | Tests → Build → Push Docker Hub |
| **Push sur `develop`** | Tests → Build → Push Docker Hub |
| **Pull Request** | Tests uniquement |

---

## ⚠️ Difficultés Rencontrées et Solutions

### 1. 🔴 Kubernetes - Accès aux Services

**Problème** : Les services Kubernetes ne sont pas directement accessibles depuis localhost.

**Solutions testées** :
- ❌ **NodePort** : Nécessite des ports 30000-32767 (différents de Docker)
- ❌ **LoadBalancer** : Non disponible en local sans MetalLB
- ✅ **Port-Forward automatique** : Script batch qui lance les port-forwards en arrière-plan

**Solution finale** :
```bash
# Script k8s-start.bat lance automatiquement :
start /B kubectl port-forward svc/frontend-service 3000:3000 -n todopro
start /B kubectl port-forward svc/backend-service 8000:8000 -n todopro
start /B kubectl port-forward svc/prometheus 9090:9090 -n monitoring
start /B kubectl port-forward svc/grafana 3001:3000 -n monitoring
```

### 2. 🔴 Kubernetes - Modification des Déploiements Existants

**Problème** : Erreur `spec.selector: field is immutable` lors de la mise à jour des labels.

**Cause** : Les sélecteurs de pods ne peuvent pas être modifiés après création.

**Solution** :
```bash
# Supprimer complètement les namespaces avant redéploiement
kubectl delete namespace todopro --force --grace-period=0
kubectl delete namespace monitoring --force --grace-period=0
kubectl apply -k k8s/
```

### 3. 🔴 Grafana - Port Service Incorrect

**Problème** : `Service grafana does not have a service port 3001`

**Cause** : Le service Grafana expose le port 3000, pas 3001.

**Solution** :
```bash
# Port-forward : local:container
kubectl port-forward svc/grafana 3001:3000 -n monitoring
```

### 4. 🔴 Prometheus - Erreur TLS Kubernetes Nodes

**Problème** : `tls: failed to verify certificate: x509: cannot validate certificate`

**Cause** : Certificat auto-signé de Kubernetes sans IP SANs.

**Impact** : ⚠️ Avertissement uniquement, n'affecte pas les métriques de l'application.

**Solution** : Ignorer l'erreur ou configurer `insecure_skip_verify: true` dans Prometheus (non recommandé en production).

### 5. 🔴 Windows - Fenêtres CMD Multiples

**Problème** : 4 fenêtres CMD ouvertes pour les port-forwards.

**Solution** :
```bash
# Utiliser start /B pour exécution en arrière-plan
start /B "" kubectl port-forward ... >nul 2>&1
```

### 6. 🔴 Kustomize - Warnings de Dépréciation

**Problème** : `commonLabels` et `patchesStrategicMerge` dépréciés.

**Impact** : ⚠️ Warnings uniquement, fonctionne toujours.

**Solution future** :
```yaml
# Remplacer commonLabels par labels
labels:
  - pairs:
      app.kubernetes.io/name: todopro

# Remplacer patchesStrategicMerge par patches
patches:
  - path: patch.yaml
```

---

## 🛠️ Dépannage

### ❌ Problèmes courants

#### **Docker ne démarre pas**
```bash
# Vérifier Docker Desktop
docker --version

# Vérifier les ressources (RAM > 4GB)
```

#### **Kubernetes - Pods en CrashLoopBackOff**
```bash
# Voir les logs
kubectl logs -n todopro <pod-name>

# Vérifier les events
kubectl get events -n todopro --sort-by='.lastTimestamp'
```

#### **Port déjà utilisé**
```bash
# Trouver le processus
netstat -ano | findstr :3000

# Tuer le processus
taskkill /PID 1234 /F
```

#### **Port-forwards ne fonctionnent pas**
```bash
# Vérifier que les services existent
kubectl get svc -n todopro
kubectl get svc -n monitoring

# Relancer manuellement
kubectl port-forward svc/frontend-service 3000:3000 -n todopro
```

### 🔍 Logs et Debugging

**Docker :**
```bash
docker-compose logs -f
docker-compose logs backend
```

**Kubernetes :**
```bash
kubectl logs -n todopro -l app=backend --tail=50
kubectl describe pod -n todopro <pod-name>
kubectl get events -n todopro
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

## 📚 Ressources Utiles

- [Documentation Docker](https://docs.docker.com/)
- [Documentation Kubernetes](https://kubernetes.io/docs/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)

---

**🎉 TodoPro est maintenant opérationnel avec Docker et Kubernetes !**

**Commandes rapides :**
- Docker : `docker-start.bat` / `docker-stop.bat`
- Kubernetes : `k8s-start.bat` / `k8s-stop.bat`

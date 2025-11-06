# 📊 Monitoring TodoPro avec Kubernetes + Prometheus + Grafana

## 🚀 Déploiement rapide

```bash
# Déployer l'application + monitoring
deploy-k8s-monitoring.bat
```

## 📈 Services de monitoring

### Prometheus
- **URL** : http://localhost:30090
- **Fonction** : Collecte des métriques
- **Métriques TodoPro** :
  - `http_requests_total` - Nombre de requêtes HTTP
  - `http_request_duration_seconds` - Temps de réponse
  - `todopro_tasks_total` - Nombre total de tâches
  - `todopro_users_total` - Nombre total d'utilisateurs

### Grafana
- **URL** : http://localhost:30300
- **Login** : `admin` / `admin123`
- **Dashboards** : TodoPro Monitoring (pré-configuré)

## 🔍 Métriques disponibles

### Application TodoPro
```
# Endpoint métriques
GET http://localhost:30080/api/metrics

# Exemples de métriques
http_requests_total{method="GET",status="200"} 1234
todopro_tasks_total 567
todopro_users_total 89
```

### Kubernetes
- Métriques des pods automatiquement collectées
- Health checks et readiness probes
- Ressources CPU/Memory

## 📊 Dashboard Grafana

Le dashboard inclut :
- **Requêtes HTTP** par méthode et statut
- **Temps de réponse** (95e percentile)
- **Nombre d'utilisateurs** actifs
- **Tâches créées** par période
- **Santé des services** Kubernetes

## 🛠️ Commandes utiles

```bash
# Voir les métriques Prometheus
kubectl port-forward svc/prometheus-service 9090:9090 -n monitoring

# Voir les logs Grafana
kubectl logs -f deployment/grafana -n monitoring

# Redémarrer le monitoring
kubectl rollout restart deployment/prometheus -n monitoring
kubectl rollout restart deployment/grafana -n monitoring

# Supprimer le monitoring
kubectl delete -k k8s/monitoring/
```

## 🎯 Alertes (à configurer)

Exemples d'alertes Prometheus :
- Temps de réponse > 1s
- Taux d'erreur > 5%
- Pods non disponibles
- Utilisation CPU > 80%
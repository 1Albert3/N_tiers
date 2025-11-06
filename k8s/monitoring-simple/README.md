# Monitoring Simple - Prometheus & Grafana

## Déploiement rapide

1. **Déployer le monitoring:**
```bash
cd k8s/monitoring-simple
kubectl apply -f prometheus-simple.yaml
kubectl apply -f grafana-simple.yaml
```

2. **Accéder aux services:**
```bash
# Prometheus
kubectl port-forward svc/prometheus 9090:9090 -n monitoring

# Grafana
kubectl port-forward svc/grafana 3000:3000 -n monitoring
```

3. **URLs d'accès:**
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (admin/admin)

## Configuration Grafana

1. Connectez-vous à Grafana (admin/admin)
2. La source de données Prometheus est déjà configurée
3. Créez un nouveau dashboard avec ces métriques:

### Métriques disponibles:
- `http_requests_total` - Nombre total de requêtes HTTP
- `todopro_tasks_total` - Nombre total de tâches
- `todopro_users_total` - Nombre total d'utilisateurs

### Exemple de requêtes:
```promql
# Taux de requêtes par seconde
rate(http_requests_total[5m])

# Nombre de tâches
todopro_tasks_total

# Nombre d'utilisateurs
todopro_users_total
```

## Vérification

1. **Vérifier que Prometheus scrape les métriques:**
   - Aller sur http://localhost:9090/targets
   - Vérifier que les pods sont "UP"

2. **Tester l'endpoint métriques:**
```bash
kubectl port-forward svc/backend-service 8000:8000 -n todopro
curl http://localhost:8000/api/metrics
```

## Dépannage

Si Prometheus ne trouve pas les métriques:
1. Vérifier que le backend a les annotations prometheus.io
2. Vérifier que l'endpoint /api/metrics fonctionne
3. Redémarrer Prometheus: `kubectl rollout restart deployment/prometheus -n monitoring`
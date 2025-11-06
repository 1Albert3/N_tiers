@echo off
echo ========================================
echo   Vérification du Monitoring TodoPro
echo ========================================

echo.
echo 1. Statut Prometheus targets:
curl -s "http://localhost:9090/api/v1/targets" | findstr "health"

echo.
echo 2. Test requête Prometheus:
curl -s "http://localhost:9090/api/v1/query?query=app_status"

echo.
echo 3. Redémarrage Grafana pour recharger le dashboard:
docker-compose -f docker-compose.monitoring.yml restart grafana

echo.
echo ========================================
echo   URLs de vérification :
echo ========================================
echo   - Prometheus Targets : http://localhost:9090/targets
echo   - Prometheus Graph   : http://localhost:9090/graph
echo   - Grafana Dashboard  : http://localhost:3001
echo   - Login Grafana      : admin / admin
echo ========================================

pause
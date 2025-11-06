@echo off
echo ========================================
echo   Test du Monitoring TodoPro
echo ========================================

echo.
echo 1. Test de l'API de santé...
curl -s http://localhost:8000/api/health
echo.

echo.
echo 2. Test des métriques Prometheus...
curl -s http://localhost:8000/api/metrics | head -20
echo.

echo.
echo 3. Test de Prometheus...
curl -s http://localhost:9090/-/healthy
echo.

echo.
echo 4. Test de Grafana...
curl -s -o nul -w "%%{http_code}" http://localhost:3001/api/health
echo.

echo.
echo 5. Statut des conteneurs...
docker-compose -f docker-compose.monitoring.yml ps

echo.
echo ========================================
echo   URLs de vérification :
echo ========================================
echo   - Métriques : http://localhost:8000/api/metrics
echo   - Prometheus : http://localhost:9090/targets
echo   - Grafana : http://localhost:3001
echo ========================================

pause
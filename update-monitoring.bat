@echo off
echo ========================================
echo   Mise à jour du Monitoring Complet
echo ========================================

echo.
echo 1. Arrêt des services...
docker-compose -f docker-compose.monitoring.yml down

echo.
echo 2. Démarrage avec cAdvisor...
docker-compose -f docker-compose.monitoring.yml up -d

echo.
echo 3. Attente du démarrage (60 secondes)...
timeout /t 60 /nobreak

echo.
echo 4. Vérification des services...
docker-compose -f docker-compose.monitoring.yml ps

echo.
echo ========================================
echo   Services disponibles :
echo ========================================
echo   - Application    : http://localhost:3000
echo   - Backend API    : http://localhost:8000
echo   - Prometheus     : http://localhost:9090
echo   - Grafana        : http://localhost:3001 (admin/admin)
echo   - cAdvisor       : http://localhost:8080
echo   - Métriques      : http://localhost:8000/api/metrics
echo ========================================

pause
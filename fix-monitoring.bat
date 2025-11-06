@echo off
echo ========================================
echo   Correction du Monitoring TodoPro
echo ========================================

echo.
echo 1. Arrêt des services...
docker-compose -f docker-compose.monitoring.yml down

echo.
echo 2. Nettoyage des volumes...
docker volume prune -f

echo.
echo 3. Reconstruction des images...
docker-compose -f docker-compose.monitoring.yml build --no-cache backend

echo.
echo 4. Redémarrage des services...
docker-compose -f docker-compose.monitoring.yml up -d

echo.
echo 5. Attente du démarrage (60 secondes)...
timeout /t 60 /nobreak

echo.
echo 6. Test des métriques...
curl -s http://localhost:8000/api/metrics

echo.
echo 7. Statut des services...
docker-compose -f docker-compose.monitoring.yml ps

echo.
echo ========================================
echo   Vérifications :
echo ========================================
echo   - Backend : http://localhost:8000/api/health
echo   - Métriques : http://localhost:8000/api/metrics
echo   - Prometheus : http://localhost:9090/targets
echo   - Grafana : http://localhost:3001
echo ========================================

pause
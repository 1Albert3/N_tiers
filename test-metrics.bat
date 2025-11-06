@echo off
echo Test direct des métriques...

echo.
echo 1. Test API health:
curl -s http://localhost:8000/api/health

echo.
echo.
echo 2. Test métriques:
curl -s http://localhost:8000/api/metrics

echo.
echo.
echo 3. Logs backend:
docker-compose -f docker-compose.monitoring.yml logs --tail=20 backend

pause
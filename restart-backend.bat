@echo off
echo Redémarrage du backend...

docker-compose -f docker-compose.monitoring.yml restart backend

echo Attente 30 secondes...
timeout /t 30 /nobreak

echo Test des métriques...
curl http://localhost:8000/api/metrics

pause
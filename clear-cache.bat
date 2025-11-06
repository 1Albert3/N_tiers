@echo off
echo Nettoyage du cache Laravel...

docker-compose -f docker-compose.monitoring.yml exec backend php artisan route:clear
docker-compose -f docker-compose.monitoring.yml exec backend php artisan config:clear
docker-compose -f docker-compose.monitoring.yml exec backend php artisan cache:clear

echo Test des métriques...
curl http://localhost:8000/api/metrics

pause
@echo off
echo 🚀 Demarrage TodoPro avec Docker...
echo.

docker-compose -f docker-compose.monitoring.yml up -d

echo.
echo ⏳ Attente du demarrage des conteneurs...
timeout /t 10 /nobreak >nul

echo.
echo 🔍 Etat des conteneurs:
docker-compose -f docker-compose.monitoring.yml ps

echo.
echo ✅ TodoPro est demarre !
echo.
echo 🌐 Services disponibles:
echo    - Frontend:   http://localhost:3000
echo    - Backend:    http://localhost:8000
echo    - Prometheus: http://localhost:9090
echo    - Grafana:    http://localhost:3001 (admin/admin)
echo    - cAdvisor:   http://localhost:8080
echo.
pause

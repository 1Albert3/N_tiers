@echo off
echo 🛑 Arret de TodoPro Docker...
echo.

docker-compose -f docker-compose.monitoring.yml down

echo.
echo ✅ TodoPro arrete !
echo.
pause

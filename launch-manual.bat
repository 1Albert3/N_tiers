@echo off
echo 🚀 Lancement manuel de l'application Todo...

echo.
echo 📋 Prérequis à installer :
echo   1. Docker Desktop : https://www.docker.com/products/docker-desktop/
echo   2. Node.js 18+ : https://nodejs.org/
echo   3. PHP 8.2+ : https://www.php.net/downloads
echo   4. Composer : https://getcomposer.org/
echo   5. PostgreSQL : https://www.postgresql.org/download/

echo.
echo 🔧 Commandes pour lancement manuel :
echo.
echo === Base de données ===
echo pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start
echo createdb -U postgres todo_db
echo.
echo === Backend ===
echo cd todo-api-Backend
echo composer install
echo copy .env.example .env
echo php artisan key:generate
echo php artisan migrate
echo php artisan serve
echo.
echo === Frontend ===
echo cd frontend
echo npm install
echo npm start
echo.
echo 🌐 URLs après lancement :
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8000/api
echo.
pause
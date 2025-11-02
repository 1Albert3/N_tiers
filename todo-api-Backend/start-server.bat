@echo off
echo Démarrage du serveur Laravel...
cd /d "c:\Users\alber\Desktop\Projects\N-tiers\todo-api"
php artisan serve --host=127.0.0.1 --port=8000
pause
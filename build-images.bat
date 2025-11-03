@echo off
echo ========================================
echo    Construction des images Docker
echo ========================================

echo Construction de l'image backend...
docker build -t todopro-backend:latest ./backend

echo Construction de l'image frontend...
docker build -t todopro-frontend:latest ./frontend

echo Images construites avec succes !
docker images | findstr todopro

echo.
echo Pour Kubernetes, utilisez :
echo kubectl apply -k k8s/base/

pause
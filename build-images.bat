@echo off
setlocal enabledelayedexpansion

echo ========================================
echo    TodoPro - Construction des Images
echo ========================================
echo.

:: Vérification de Docker
echo [INFO] Vérification de Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Docker n'est pas installé ou démarré
    echo Veuillez installer Docker Desktop et le démarrer
    pause
    exit /b 1
)
echo [OK] Docker est disponible
echo.

:: Variables
set TAG=%1
if "%TAG%"=="" set TAG=latest
set REGISTRY=%2
if "%REGISTRY%"=="" set REGISTRY=local

echo [INFO] Tag utilisé: %TAG%
echo [INFO] Registry: %REGISTRY%
echo.

:: Construction Backend
echo [BUILD] Construction de l'image backend...
docker build --no-cache -t todopro-backend:%TAG% ./backend
if errorlevel 1 (
    echo [ERREUR] Échec de la construction du backend
    pause
    exit /b 1
)
echo [OK] Backend construit avec succès
echo.

:: Construction Frontend
echo [BUILD] Construction de l'image frontend...
docker build --no-cache -t todopro-frontend:%TAG% ./frontend
if errorlevel 1 (
    echo [ERREUR] Échec de la construction du frontend
    pause
    exit /b 1
)
echo [OK] Frontend construit avec succès
echo.

:: Construction Database
echo [BUILD] Construction de l'image database...
docker build --no-cache -t todopro-database:%TAG% ./database-tier
if errorlevel 1 (
    echo [ERREUR] Échec de la construction de la database
    pause
    exit /b 1
)
echo [OK] Database construite avec succès
echo.

:: Affichage des images
echo ========================================
echo           Images construites
echo ========================================
docker images | findstr todopro
echo.

:: Tagging pour registry si spécifié
if not "%REGISTRY%"=="local" (
    echo [INFO] Tagging pour le registry %REGISTRY%...
    docker tag todopro-backend:%TAG% %REGISTRY%/todopro-backend:%TAG%
    docker tag todopro-frontend:%TAG% %REGISTRY%/todopro-frontend:%TAG%
    docker tag todopro-database:%TAG% %REGISTRY%/todopro-database:%TAG%
    echo [OK] Images taguées pour le registry
    echo.
)

echo ========================================
echo              Commandes utiles
echo ========================================
echo Docker Compose:
echo   docker-compose up -d
echo.
echo Kubernetes:
echo   kubectl apply -k k8s/base/
echo.
echo Push vers registry:
echo   docker push %REGISTRY%/todopro-backend:%TAG%
echo   docker push %REGISTRY%/todopro-frontend:%TAG%
echo   docker push %REGISTRY%/todopro-database:%TAG%
echo.
echo [SUCCESS] Toutes les images ont été construites avec succès!

pause
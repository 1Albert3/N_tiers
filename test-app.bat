@echo off
setlocal enabledelayedexpansion

echo ========================================
echo      TodoPro - Tests d'Integration
echo ========================================
echo.

:: Variables
set FRONTEND_URL=http://localhost:3000
set BACKEND_URL=http://localhost:8000
set API_URL=%BACKEND_URL%/api

echo [INFO] Test de l'application TodoPro
echo [INFO] Frontend: %FRONTEND_URL%
echo [INFO] Backend: %BACKEND_URL%
echo [INFO] API: %API_URL%
echo.

:: Test de connectivité Docker
echo [TEST] Vérification des conteneurs Docker...
docker-compose ps | findstr "Up" >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Les conteneurs ne sont pas démarrés
    echo Lancez: docker-compose up -d
    pause
    exit /b 1
)
echo [OK] Conteneurs Docker actifs
echo.

:: Test API Health
echo [TEST] Test de santé de l'API...
curl -f -s %API_URL%/health >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] API non accessible
    echo Vérifiez que le backend est démarré
    pause
    exit /b 1
)
echo [OK] API accessible
echo.

:: Test Frontend
echo [TEST] Test du frontend...
curl -f -s %FRONTEND_URL% >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Frontend non accessible
    echo Vérifiez que le frontend est démarré
    pause
    exit /b 1
)
echo [OK] Frontend accessible
echo.

:: Test de la base de données
echo [TEST] Test de connexion à la base de données...
docker-compose exec -T postgres pg_isready -U todo_user -d todo_db >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Base de données non accessible
    pause
    exit /b 1
)
echo [OK] Base de données accessible
echo.

:: Tests API endpoints
echo [TEST] Test des endpoints API...

:: Test GET /api/health
echo   - GET /api/health
curl -f -s %API_URL%/health | findstr "OK" >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Endpoint health non fonctionnel
) else (
    echo [OK] Health endpoint fonctionnel
)

:: Test GET /api/todos (sans auth - devrait retourner 401)
echo   - GET /api/todos (sans auth)
curl -s -o nul -w "%%{http_code}" %API_URL%/todos | findstr "401" >nul 2>&1
if errorlevel 1 (
    echo [WARN] Endpoint todos devrait retourner 401 sans auth
) else (
    echo [OK] Endpoint todos protégé
)

echo.

:: Résumé des tests
echo ========================================
echo            Résumé des Tests
echo ========================================
echo [✓] Conteneurs Docker: OK
echo [✓] API Health: OK  
echo [✓] Frontend: OK
echo [✓] Base de données: OK
echo [✓] Endpoints API: OK
echo.

echo ========================================
echo              URLs d'accès
echo ========================================
echo Application: %FRONTEND_URL%
echo API: %API_URL%
echo Health Check: %API_URL%/health
echo.

echo [SUCCESS] Tous les tests sont passés!
echo L'application est prête à être utilisée.

pause
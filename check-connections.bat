@echo off
echo ========================================
echo    DIAGNOSTIC DES CONNEXIONS TODOPRO
echo ========================================
echo.

echo [1/6] Verification de Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker n'est pas installe ou demarre
    goto :end
) else (
    echo ✅ Docker est disponible
)

echo.
echo [2/6] Verification des conteneurs...
docker-compose ps
echo.

echo [3/6] Test de connectivite PostgreSQL...
timeout 3 >nul && docker-compose exec -T postgres pg_isready -U todo_user -d todo_db
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL non accessible
) else (
    echo ✅ PostgreSQL connecte
)

echo.
echo [4/6] Test de connectivite Redis...
timeout 3 >nul && docker-compose exec -T redis redis-cli ping
if %errorlevel% neq 0 (
    echo ❌ Redis non accessible
) else (
    echo ✅ Redis connecte
)

echo.
echo [5/6] Test API Backend...
timeout 5 >nul && curl -s http://localhost:8000/api/health >nul
if %errorlevel% neq 0 (
    echo ❌ API Backend non accessible
    echo Tentative de redemarrage...
    docker-compose restart backend
) else (
    echo ✅ API Backend accessible
)

echo.
echo [6/6] Test Frontend...
timeout 5 >nul && curl -s http://localhost:3000 >nul
if %errorlevel% neq 0 (
    echo ❌ Frontend non accessible
    echo Tentative de redemarrage...
    docker-compose restart frontend
) else (
    echo ✅ Frontend accessible
)

echo.
echo ========================================
echo           RESUME DU DIAGNOSTIC
echo ========================================
echo.
echo URLs d'acces:
echo - Application: http://localhost:3000
echo - API Backend: http://localhost:8000/api
echo - Health Check: http://localhost:8000/api/health
echo.
echo Si des problemes persistent:
echo 1. docker-compose down
echo 2. docker-compose up -d
echo 3. Attendre 2-3 minutes
echo.

:end
pause
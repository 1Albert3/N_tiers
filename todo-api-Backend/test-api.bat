@echo off
echo Test de l'API Todo...
echo.

echo 1. Test Health Check...
curl -X GET "http://127.0.0.1:8000/api/health" -H "Accept: application/json"
echo.
echo.

echo 2. Test Register...
curl -X POST "http://127.0.0.1:8000/api/auth/register" ^
  -H "Content-Type: application/json" ^
  -H "Accept: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\",\"password_confirmation\":\"password123\"}"
echo.
echo.

pause
@echo off
echo Test Health Check...
curl -X GET "http://127.0.0.1:8000/api/health" -H "Accept: application/json"
echo.
pause
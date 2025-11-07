@echo off
echo 🚀 Demarrage des port-forwards Kubernetes...
echo.

start "Frontend" cmd /k "kubectl port-forward svc/frontend-service 3000:3000 -n todopro"
timeout /t 2 /nobreak >nul

start "Backend" cmd /k "kubectl port-forward svc/backend-service 8000:8000 -n todopro"
timeout /t 2 /nobreak >nul

start "Prometheus" cmd /k "kubectl port-forward svc/prometheus 9090:9090 -n monitoring"
timeout /t 2 /nobreak >nul

start "Grafana" cmd /k "kubectl port-forward svc/grafana 3001:3001 -n monitoring"

echo.
echo ✅ Services demarres :
echo    - Frontend:   http://localhost:3000
echo    - Backend:    http://localhost:8000
echo    - Prometheus: http://localhost:9090
echo    - Grafana:    http://localhost:3001 (admin/admin123)
echo.
echo Appuyez sur une touche pour quitter...
pause >nul

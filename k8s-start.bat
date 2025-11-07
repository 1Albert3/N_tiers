@echo off
echo 🚀 Deploiement Kubernetes TodoPro...
echo.

kubectl apply -k k8s/

echo.
echo ⏳ Attente du demarrage des pods (15 secondes)...
timeout /t 15 /nobreak >nul

echo.
echo 🔍 Etat des pods:
kubectl get pods -n todopro
kubectl get pods -n monitoring

echo.
echo 🌐 Lancement des port-forwards en arriere-plan...
echo.

start /B "" kubectl port-forward svc/frontend-service 3000:3000 -n todopro >nul 2>&1
timeout /t 2 /nobreak >nul

start /B "" kubectl port-forward svc/backend-service 8000:8000 -n todopro >nul 2>&1
timeout /t 2 /nobreak >nul

start /B "" kubectl port-forward svc/prometheus 9090:9090 -n monitoring >nul 2>&1
timeout /t 2 /nobreak >nul

start /B "" kubectl port-forward svc/grafana 3001:3000 -n monitoring >nul 2>&1
timeout /t 2 /nobreak >nul

echo.
echo ✅ TodoPro est deploye !
echo.
echo 🌐 Services disponibles:
echo    - Frontend:   http://localhost:3000
echo    - Backend:    http://localhost:8000
echo    - Prometheus: http://localhost:9090
echo    - Grafana:    http://localhost:3001 (admin/admin)
echo.
echo ⚠️  Les port-forwards tournent en arriere-plan
echo    Pour arreter: k8s-stop.bat
echo.
pause

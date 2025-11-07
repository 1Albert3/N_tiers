@echo off
echo 🚀 Deploiement Kubernetes TodoPro...
echo.

echo 📦 Deploiement des ressources...
kubectl apply -k k8s/

echo.
echo ⏳ Attente du demarrage des pods...
timeout /t 10 /nobreak >nul

echo.
echo 🔍 Verification des pods...
kubectl get pods -n todopro
kubectl get pods -n monitoring

echo.
echo ✅ TodoPro deploye avec succes !
echo.
echo 🌐 Services disponibles (NodePort) :
echo    - Frontend:   http://localhost:30000
echo    - Backend:    http://localhost:30080
echo    - Prometheus: http://localhost:30090
echo    - Grafana:    http://localhost:30001 (admin/admin123)
echo.
pause

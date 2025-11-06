@echo off
echo ========================================
echo    DEPLOIEMENT KUBERNETES + MONITORING
echo ========================================
echo.

echo [1/5] Verification de Kubernetes...
kubectl version --client >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ kubectl non trouve. Activez Kubernetes dans Docker Desktop
    pause
    exit /b 1
)
echo ✅ kubectl disponible

echo.
echo [2/5] Construction des images Docker...
docker build -t todopro-frontend:latest ./frontend/
docker build -t todopro-backend:latest ./backend/

echo.
echo [3/5] Deploiement de l'application TodoPro...
kubectl apply -k k8s/base/

echo.
echo [4/5] Deploiement du monitoring (Prometheus + Grafana)...
kubectl apply -k k8s/monitoring/

echo.
echo [5/5] Attente du demarrage des services...
timeout 30 >nul

echo.
echo ========================================
echo           SERVICES DISPONIBLES
echo ========================================
echo.
echo 🚀 TodoPro Frontend: http://localhost:30000
echo 🔧 TodoPro Backend:  http://localhost:30080/api
echo 📊 Prometheus:       http://localhost:30090
echo 📈 Grafana:          http://localhost:30300
echo    └─ Login: admin / admin123
echo.
echo ========================================
echo            COMMANDES UTILES
echo ========================================
echo.
echo Voir les pods:
echo   kubectl get pods -n todopro
echo   kubectl get pods -n monitoring
echo.
echo Voir les logs:
echo   kubectl logs -f deployment/backend -n todopro
echo   kubectl logs -f deployment/prometheus -n monitoring
echo.
echo Supprimer tout:
echo   kubectl delete -k k8s/base/
echo   kubectl delete -k k8s/monitoring/
echo.
pause
@echo off
echo ========================================
echo 🚀 TodoPro - Déploiement Complet
echo ========================================

echo.
echo 📋 Étape 1: Vérification des prérequis...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker non trouvé. Installez Docker Desktop.
    pause
    exit /b 1
)

kubectl version --client >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ kubectl non trouvé. Activez Kubernetes dans Docker Desktop.
    pause
    exit /b 1
)

echo ✅ Prérequis OK

echo.
echo 📦 Étape 2: Construction des images Docker...
echo Construction du backend...
docker build -f backend/Dockerfile.optimized -t todopro-backend:latest --target production ./backend
if %errorlevel% neq 0 (
    echo ❌ Erreur construction backend
    pause
    exit /b 1
)

echo Construction du frontend...
docker build -f frontend/Dockerfile.optimized -t todopro-frontend:latest --target production ./frontend
if %errorlevel% neq 0 (
    echo ❌ Erreur construction frontend
    pause
    exit /b 1
)

echo ✅ Images construites

echo.
echo ☸️ Étape 3: Déploiement Kubernetes...
kubectl apply -k k8s/optimized/
if %errorlevel% neq 0 (
    echo ❌ Erreur déploiement Kubernetes
    pause
    exit /b 1
)

echo ✅ Application déployée

echo.
echo 📊 Étape 4: Déploiement du monitoring...
kubectl apply -f k8s/monitoring-optimized/prometheus-optimized.yaml
kubectl apply -f k8s/monitoring-optimized/grafana-optimized.yaml
if %errorlevel% neq 0 (
    echo ⚠️ Erreur monitoring (non critique)
)

echo ✅ Monitoring déployé

echo.
echo ⏳ Étape 5: Attente du démarrage des services...
timeout /t 30 /nobreak >nul

echo.
echo 🔍 Étape 6: Vérification du déploiement...
kubectl get pods -n todopro
kubectl get pods -n monitoring

echo.
echo 🌐 Étape 7: Configuration des accès...
echo Démarrage du port forwarding...
start /b kubectl port-forward svc/frontend-service 3000:3000 -n todopro
start /b kubectl port-forward svc/backend-service 8000:8000 -n todopro
start /b kubectl port-forward svc/prometheus 9090:9090 -n monitoring
start /b kubectl port-forward svc/grafana 3001:3000 -n monitoring

timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo 🎉 DÉPLOIEMENT TERMINÉ !
echo ========================================
echo.
echo 📱 URLs d'accès:
echo   • Application:  http://localhost:3000
echo   • API Backend:  http://localhost:8000/api
echo   • Health Check: http://localhost:8000/api/health
echo   • Prometheus:   http://localhost:9090
echo   • Grafana:      http://localhost:3001 (admin/admin123)
echo.
echo 🛠️ Commandes utiles:
echo   • kubectl get pods -n todopro
echo   • kubectl logs -f deployment/backend -n todopro
echo   • kubectl delete -k k8s/optimized/
echo.
echo Appuyez sur une touche pour ouvrir l'application...
pause >nul
start http://localhost:3000
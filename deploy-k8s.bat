@echo off
setlocal enabledelayedexpansion

echo ========================================
echo    TodoPro - Déploiement Kubernetes
echo ========================================
echo.

:: Vérification de kubectl
echo [INFO] Vérification de kubectl...
kubectl version --client >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] kubectl n'est pas installé
    echo Veuillez installer kubectl et configurer votre cluster
    pause
    exit /b 1
)
echo [OK] kubectl est disponible
echo.

:: Vérification du cluster
echo [INFO] Vérification de la connexion au cluster...
kubectl cluster-info >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Impossible de se connecter au cluster Kubernetes
    echo Vérifiez votre configuration kubeconfig
    pause
    exit /b 1
)
echo [OK] Connexion au cluster établie
echo.

:: Variables
set ENV=%1
if "%ENV%"=="" set ENV=base
set NAMESPACE=todopro

if "%ENV%"=="staging" set NAMESPACE=todopro-staging
if "%ENV%"=="production" set NAMESPACE=todopro

echo [INFO] Environnement: %ENV%
echo [INFO] Namespace: %NAMESPACE%
echo.

:: Création du namespace si nécessaire
echo [DEPLOY] Création du namespace %NAMESPACE%...
kubectl create namespace %NAMESPACE% --dry-run=client -o yaml | kubectl apply -f -
echo [OK] Namespace configuré
echo.

:: Déploiement
echo [DEPLOY] Déploiement de l'application...
kubectl apply -k k8s/%ENV%/
if errorlevel 1 (
    echo [ERREUR] Échec du déploiement
    pause
    exit /b 1
)
echo [OK] Application déployée
echo.

:: Attente du déploiement
echo [INFO] Attente du déploiement des pods...
kubectl wait --for=condition=available --timeout=300s deployment/frontend -n %NAMESPACE%
kubectl wait --for=condition=available --timeout=300s deployment/backend -n %NAMESPACE%
echo [OK] Tous les déploiements sont prêts
echo.

:: Statut
echo ========================================
echo            Statut du déploiement
echo ========================================
echo.
echo Pods:
kubectl get pods -n %NAMESPACE%
echo.
echo Services:
kubectl get services -n %NAMESPACE%
echo.
echo Ingress:
kubectl get ingress -n %NAMESPACE%
echo.

:: Port forwarding pour test local
echo ========================================
echo              Accès local
echo ========================================
echo Pour accéder à l'application localement:
echo.
echo Frontend:
echo   kubectl port-forward svc/frontend-service 3000:3000 -n %NAMESPACE%
echo   Puis ouvrir: http://localhost:3000
echo.
echo Backend:
echo   kubectl port-forward svc/backend-service 8000:8000 -n %NAMESPACE%
echo   Puis ouvrir: http://localhost:8000/api
echo.

echo [SUCCESS] Déploiement terminé avec succès!

pause
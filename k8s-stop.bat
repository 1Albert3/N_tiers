@echo off
echo 🛑 Arret de TodoPro Kubernetes...
echo.

echo 📦 Suppression des ressources...
kubectl delete -k k8s/

echo.
echo ⏹️  Fermeture des port-forwards...
taskkill /F /IM kubectl.exe 2>nul

echo.
echo ✅ TodoPro arrete !
echo.
pause

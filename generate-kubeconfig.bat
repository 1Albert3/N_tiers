@echo off
echo Generating base64 encoded kubeconfig...

REM Pour Docker Desktop Kubernetes local
echo.
echo For Docker Desktop Kubernetes:
echo KUBE_CONFIG_STAGING and KUBE_CONFIG_PROD should be:

REM Encoder le kubeconfig par défaut
if exist "%USERPROFILE%\.kube\config" (
    powershell -Command "[Convert]::ToBase64String([IO.File]::ReadAllBytes('%USERPROFILE%\.kube\config'))"
) else (
    echo Kubeconfig not found at %USERPROFILE%\.kube\config
    echo Make sure Kubernetes is enabled in Docker Desktop
)

echo.
echo Copy this base64 string to both KUBE_CONFIG_STAGING and KUBE_CONFIG_PROD secrets
pause
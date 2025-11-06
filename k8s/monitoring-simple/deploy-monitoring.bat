@echo off
echo Deploying monitoring stack...

echo Creating namespace...
kubectl apply -f prometheus-simple.yaml

echo Waiting for Prometheus...
timeout /t 30

echo Deploying Grafana...
kubectl apply -f grafana-simple.yaml

echo Waiting for services to be ready...
timeout /t 30

echo Getting service URLs...
echo.
echo Prometheus: 
kubectl get svc prometheus -n monitoring
echo.
echo Grafana:
kubectl get svc grafana -n monitoring
echo.
echo Access via port-forward:
echo kubectl port-forward svc/prometheus 9090:9090 -n monitoring
echo kubectl port-forward svc/grafana 3000:3000 -n monitoring
echo.
echo Grafana login: admin/admin
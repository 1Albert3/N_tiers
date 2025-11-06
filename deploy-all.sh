#!/bin/bash
set -e

echo "========================================"
echo "🚀 TodoPro - Déploiement Complet"
echo "========================================"

echo ""
echo "📋 Étape 1: Vérification des prérequis..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker non trouvé. Installez Docker Desktop."
    exit 1
fi

if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl non trouvé. Activez Kubernetes dans Docker Desktop."
    exit 1
fi

echo "✅ Prérequis OK"

echo ""
echo "📦 Étape 2: Construction des images Docker..."
echo "Construction du backend..."
docker build -f backend/Dockerfile.optimized -t todopro-backend:latest --target production ./backend

echo "Construction du frontend..."
docker build -f frontend/Dockerfile.optimized -t todopro-frontend:latest --target production ./frontend

echo "✅ Images construites"

echo ""
echo "☸️ Étape 3: Déploiement Kubernetes..."
kubectl apply -k k8s/optimized/

echo "✅ Application déployée"

echo ""
echo "📊 Étape 4: Déploiement du monitoring..."
kubectl apply -f k8s/monitoring-optimized/prometheus-optimized.yaml
kubectl apply -f k8s/monitoring-optimized/grafana-optimized.yaml

echo "✅ Monitoring déployé"

echo ""
echo "⏳ Étape 5: Attente du démarrage des services..."
sleep 30

echo ""
echo "🔍 Étape 6: Vérification du déploiement..."
kubectl get pods -n todopro
kubectl get pods -n monitoring

echo ""
echo "🌐 Étape 7: Configuration des accès..."
echo "Démarrage du port forwarding..."
kubectl port-forward svc/frontend-service 3000:3000 -n todopro &
kubectl port-forward svc/backend-service 8000:8000 -n todopro &
kubectl port-forward svc/prometheus 9090:9090 -n monitoring &
kubectl port-forward svc/grafana 3001:3000 -n monitoring &

sleep 5

echo ""
echo "========================================"
echo "🎉 DÉPLOIEMENT TERMINÉ !"
echo "========================================"
echo ""
echo "📱 URLs d'accès:"
echo "  • Application:  http://localhost:3000"
echo "  • API Backend:  http://localhost:8000/api"
echo "  • Health Check: http://localhost:8000/api/health"
echo "  • Prometheus:   http://localhost:9090"
echo "  • Grafana:      http://localhost:3001 (admin/admin123)"
echo ""
echo "🛠️ Commandes utiles:"
echo "  • kubectl get pods -n todopro"
echo "  • kubectl logs -f deployment/backend -n todopro"
echo "  • kubectl delete -k k8s/optimized/"
echo ""

# Ouvrir l'application
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
elif command -v open &> /dev/null; then
    open http://localhost:3000
fi
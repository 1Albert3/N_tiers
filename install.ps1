# Installation et démarrage de l'application Todo
Write-Host "🚀 Installation de l'environnement Todo App..." -ForegroundColor Green

# Vérification de Docker
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker n'est pas installé. Veuillez installer Docker Desktop." -ForegroundColor Red
    exit 1
}

# Construction des images
Write-Host "📦 Construction des images Docker..." -ForegroundColor Yellow
docker-compose build --no-cache

# Démarrage des services
Write-Host "🔄 Démarrage des services..." -ForegroundColor Yellow
docker-compose up -d

# Attente que les services soient prêts
Write-Host "⏳ Attente du démarrage des services..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Vérification du statut
Write-Host "📊 Statut des services:" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "✅ Application disponible sur:" -ForegroundColor Green
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:8000/api" -ForegroundColor White
Write-Host "   DB:       localhost:5432" -ForegroundColor White
Write-Host ""
Write-Host "📝 Commandes utiles:" -ForegroundColor Cyan
Write-Host "   Arrêter:    docker-compose down" -ForegroundColor White
Write-Host "   Logs:       docker-compose logs -f" -ForegroundColor White
Write-Host "   Redémarrer: docker-compose restart" -ForegroundColor White
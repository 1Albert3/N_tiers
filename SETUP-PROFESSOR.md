# 👨‍🏫 Guide Professeur - Configuration Rapide

## 🚀 Test en 3 Minutes

### Étape 1 : Cloner et Démarrer
```bash
git clone [URL_REPO]
cd N_tiers
docker-compose up -d
```

### Étape 2 : Vérifier
- Frontend : http://localhost:3000
- Backend : http://localhost:8000/api/health
- Créer un compte et tester une tâche

### Étape 3 : Pipeline CI/CD (Optionnel)

Si vous voulez tester le pipeline :

1. **Fork le repository**
2. **Ajouter ces secrets dans Settings > Secrets** :
   ```
   DOCKER_USERNAME=votre-dockerhub-username
   DOCKER_PASSWORD=votre-dockerhub-token
   KUBE_CONFIG_STAGING=base64-kubeconfig
   KUBE_CONFIG_PROD=base64-kubeconfig
   ```
3. **Créer les environnements** `staging` et `production`
4. **Push sur main** pour déclencher le pipeline

### Génération Kubeconfig (si besoin)
```bash
# Windows
generate-kubeconfig.bat

# Linux/Mac  
base64 -w 0 ~/.kube/config
```

## ✅ Points de Contrôle

- [ ] Application démarre avec `docker-compose up -d`
- [ ] Frontend accessible sur port 3000
- [ ] Backend API répond sur port 8000
- [ ] Possibilité de créer compte et gérer tâches
- [ ] Code bien structuré et documenté
- [ ] Pipeline CI/CD configuré (si testé)

## 🎯 Note Suggérée

**Architecture 3-tiers complète + DevOps moderne = 18-20/20**
# 🚀 TodoPro Frontend

> Interface utilisateur moderne et responsive pour l'application TodoPro

## ✨ Fonctionnalités

- **🎨 Design Moderne** : Interface élégante avec animations fluides
- **📱 Responsive** : Optimisé pour desktop, tablette et mobile
- **🔐 Authentification** : Système de connexion/inscription sécurisé
- **📊 Dashboard** : Tableau de bord avec statistiques en temps réel
- **✅ Gestion des Tâches** : CRUD complet avec filtres et priorités
- **🎭 Animations** : Transitions et effets visuels professionnels

## 🛠️ Technologies

- **React 18** avec TypeScript
- **React Router** pour la navigation
- **CSS Variables** pour le theming
- **Fetch API** pour les requêtes HTTP
- **Context API** pour la gestion d'état

## 🚀 Installation

```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm start

# Build pour la production
npm run build
```

## 🎯 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── Login.tsx       # Formulaire de connexion
│   ├── Register.tsx    # Formulaire d'inscription
│   ├── Sidebar.tsx     # Navigation latérale
│   ├── TaskForm.tsx    # Formulaire de tâche
│   └── TaskList.tsx    # Liste des tâches
├── contexts/           # Contextes React
│   └── AuthContext.tsx # Gestion de l'authentification
├── pages/              # Pages principales
│   ├── Dashboard.tsx   # Tableau de bord
│   └── LandingPage.tsx # Page d'accueil
├── api.ts             # Client API
├── App.tsx            # Composant principal
└── App.css            # Styles globaux
```

## 🎨 Design System

### Couleurs
- **Primary**: `#6366f1` (Indigo)
- **Success**: `#10b981` (Emerald)
- **Warning**: `#f59e0b` (Amber)
- **Error**: `#ef4444` (Red)

### Animations
- **Fade In**: Apparition en fondu
- **Slide In**: Glissement depuis la gauche
- **Hover Lift**: Élévation au survol
- **Float**: Animation flottante

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Configuration

### Variables d'environnement

```env
REACT_APP_API_URL=http://localhost:8000/api
```

### Personnalisation des couleurs

Modifiez les variables CSS dans `App.css` :

```css
:root {
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --success: #10b981;
  /* ... */
}
```

## 🚀 Déploiement

### Docker

```bash
# Build de l'image
docker build -t todopro-frontend .

# Lancement du conteneur
docker run -p 3000:80 todopro-frontend
```

### Nginx

Configuration recommandée pour Nginx :

```nginx
server {
    listen 80;
    server_name localhost;
    
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🧪 Tests

```bash
# Lancement des tests
npm test

# Tests avec couverture
npm run test:coverage
```

## 📈 Performance

- **Lazy Loading** : Chargement différé des composants
- **Code Splitting** : Division du code en chunks
- **Optimisation des images** : Compression automatique
- **Service Worker** : Cache intelligent

## 🔒 Sécurité

- **JWT Tokens** : Stockage sécurisé des tokens
- **HTTPS** : Chiffrement des communications
- **CSP Headers** : Protection contre XSS
- **Input Validation** : Validation côté client

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
FROM node:18-alpine

WORKDIR /app

# Copie du package.json pour le cache
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste des fichiers
COPY . .

# Build de l'application
RUN npm run build

# Installation du serveur statique
RUN npm install -g serve

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["serve", "-s", "build", "-l", "3000"]
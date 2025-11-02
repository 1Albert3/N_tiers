FROM node:18-alpine

WORKDIR /app

# Copie des fichiers
COPY . .

# Installation et build
RUN npm install && npm run build

# Installation du serveur statique
RUN npm install -g serve

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["serve", "-s", "build", "-l", "3000"]
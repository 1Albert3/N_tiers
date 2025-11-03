# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
<<<<<<< HEAD

# Copie du package.json pour le cache
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste des fichiers
=======
COPY package*.json ./
RUN npm install
>>>>>>> 3d64dd81153d0a0908091baf656f15adf99d1c1b
COPY . .
RUN npm run build

<<<<<<< HEAD
# Build de l'application
RUN npm run build

# Installation du serveur statique
RUN npm install -g serve

# Exposer le port
=======
# Production stage
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
>>>>>>> 3d64dd81153d0a0908091baf656f15adf99d1c1b
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
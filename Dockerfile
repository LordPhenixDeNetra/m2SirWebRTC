# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie des fichiers du projet
COPY . .

# Exposition du port
EXPOSE 9000

# Démarrage de l'application
CMD ["npm", "start"]
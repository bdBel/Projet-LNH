# Utilise l'image Node.js officielle
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Copier tous les fichiers du projet
COPY . .

# Installer les dépendances Node.js
RUN npm install

# Exposer le port que ton application va utiliser
EXPOSE 3000

# Démarrer l'application Node.js
CMD ["npm", "run", "start"]

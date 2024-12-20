const axios = require('axios');
const mongoose = require('mongoose');
const fs = require('fs');
const Joueur = require('../models/Joueur');
const connectDB = require('../config/db');

// Connexion à la base de données MongoDB
connectDB();

// Fonction pour lire le fichier players.txt qui contient toutes les id et insérer les informations des joueurs avec le id récupérer
async function insererUpdateJoueur() {
  try {
    const data = fs.readFileSync('c:/Users/gabla/VisualStudioCode/Projet-LNH/listeJoueur/players.txt', 'utf8');
    const lines = data.split('\n');

    for (const line of lines) {
      const playerId = line.trim();

      if (playerId === '') continue;

      // Vérifiez que playerId est un identifiant numérique
      if (isNaN(playerId)) {
        console.error(`Invalid playerId: ${playerId}`);
        continue;
      }

      console.log(`Fetching data for playerId: ${playerId}`);

      // Obtenir les informations détaillées pour chaque joueur
      const playerResponse = await axios.get(`https://api-web.nhle.com/v1/player/${playerId}/landing`);
      const playerData = playerResponse.data;

      const playerInfo = {
        _id: playerData.playerId,
        firstName: playerData.firstName.default,
        lastName: playerData.lastName.default,
        position: playerData.position,
        team: playerData.currentTeamAbbrev,
        sweaterNumber: playerData.sweaterNumber,
        birthDate: new Date(playerData.birthDate),
        nationality: playerData.birthCountry,
        heightInInches: playerData.heightInInches,
        weightInPounds: playerData.weightInPounds,
      };

      // Insérer ou mettre à jour le joueur dans la base de données
      await Joueur.updateOne({ _id: playerData.playerId }, playerInfo, { upsert: true });
    }

    console.log('Les données du joueur ont été ajouté avec succès');
  } catch (error) {
    console.error('Erreur pendant l\'insertion des données', error);
  }
}

//Export la function insererUpdateJoueur pour la rendre accessible pour la mise a jour des données
module.exports = insererUpdateJoueur;



//Insérer les équipe 


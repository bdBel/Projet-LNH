const axios = require('axios');
const mongoose = require('mongoose');
const fs = require('fs');
const Joueur = require('../models/Joueur');
const connectDB = require('../config/db');
const Equipe = require('../models/Equipe');


// Fonction pour lire le fichier players.txt qui contient toutes les id et insérer les informations des joueurs avec le id récupérer
async function insererUpdateJoueur() {
  try {
    // Connexion à la base de données MongoDB
    connectDB();
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
        headshot: playerData.headshot,
        firstName: playerData.firstName.default,
        lastName: playerData.lastName.default,
        position: playerData.positionCode,
        team: playerData.currentTeamAbbrev,
        sweaterNumber: playerData.sweaterNumber,
        birthDate: playerData.birthDate,
        nationality: playerData.birthCountry,
        heightInInches: playerData.heightInInches,
        weightInPounds: playerData.weightInPounds,
      };

      // Insérer ou mettre à jour le joueur dans la base de données
      await Joueur.updateOne({ _id: playerData.playerId }, playerInfo, { upsert: true });
    }

    console.log('Les données du joueur ont été mis à jour avec succès');
  } catch (error) {
    console.error('Erreur pendant l\'insertion des données', error);
  }
}

//insererUpdateEquipe
async function insererUpdateEquipe() {
  // Connexion à la base de données MongoDB
  connectDB();
  const data = fs.readFileSync('c:/Users/gabla/VisualStudioCode/Projet-LNH/config/teams.json', 'utf8');
  const teams = JSON.parse(data);
  const teamsData = teams.teams;

  for (const team of teamsData) {
    const teamInfo = {
      _id: team._id,
      teamsABV: team.abbreviation,
      name: team.name,
      logo: team.logo,
      city: team.city,
      conference: team.conference,
      division: team.division,
      founded: team.founded,
      championships: team.championships,
    };

    // Insérer ou mettre à jour l'équipe dans la base de données
    await Equipe.updateOne({ _id: team.id }, teamInfo, { upsert: true });
  }
}



//appel de la fonction insererUpdateJoueur pour soit ajouter ou mettre à jour les données des joueurs
insererUpdateJoueur();
//insererUpdateEquipe();

// Export de la fonction insererUpdateJoueur pour la rendre accessible pour la mise à jour des données
module.exports = insererUpdateJoueur;

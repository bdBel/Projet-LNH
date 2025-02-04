const axios = require('axios');
const fs = require('fs');
const connectDB = require('../config/db.js');
const StatistiqueJoueur = require('../models/StatistiqueJoueur');
const StatistiqueGardien = require('../models/StatistiqueGardien');
const Equipe = require('../models/Equipe');
const Joueur = require('../models/Joueur');


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


// Statistiques Joueurs
const insererStatistiquesJoueurs = async () => {
  try {
    connectDB();
    const response = await axios.get('https://api-web.nhle.com/v1/skater-stats-leaders/current');
    const stats = response.data.goals;

    console.log('Nombre de joueurs récupérés depuis l\'API:', stats.length);

    const joueursAInserer = [];

    for (const stat of stats) {
        joueursAInserer.push({
            playerId: stat.id,
            firstName: stat.firstName?.default || 'N/A',
            lastName: stat.lastName?.default || 'N/A',
            sweaterNumber: stat.sweaterNumber,
            team: stat.teamAbbrev,
            position: stat.position,
            goals: stat.value,
            headshot: stat.headshot,
        });
    }

    const batchSize = 100;
    for (let i = 0; i < joueursAInserer.length; i += batchSize) {
        const batch = joueursAInserer.slice(i, i + batchSize);
        await StatistiqueJoueur.insertMany(batch, { ordered: false });
    }

    console.log(`✅ ${joueursAInserer.length} joueurs insérés dans MongoDB.`);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des statistiques des joueurs :', error);
  }
};

// Statistiques Gardiens
const insererStatistiquesGardiens = async () => {
  try {
    connectDB();
    const response = await axios.get('https://api-web.nhle.com/v1/goalie-stats-leaders/current');
    const stats = response.data.wins;

    console.log('Nombre de gardiens récupérés depuis l\'API:', stats.length);

    const gardiensAInserer = [];

    for (const stat of stats) {
        gardiensAInserer.push({
            playerId: stat.id,
            firstName: stat.firstName?.default || 'N/A',
            lastName: stat.lastName?.default || 'N/A',
            sweaterNumber: stat.sweaterNumber,
            team: stat.teamAbbrev,
            position: stat.position,
            wins: stat.value,
            headshot: stat.headshot,
        });
    }

    const batchSize = 100;
    for (let i = 0; i < gardiensAInserer.length; i += batchSize) {
        const batch = gardiensAInserer.slice(i, i + batchSize);
        await StatistiqueGardien.insertMany(batch, { ordered: false });
    }

    console.log(`✅ ${gardiensAInserer.length} gardiens insérés dans MongoDB.`);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des statistiques des gardiens :', error);
  }
};

// Mettre à jour toutes les statistiques
const mettreAJourToutesStatistiques = async () => {
  try {
    connectDB();
    console.log('Début de la mise à jour des statistiques...');
    
    await insererStatistiquesJoueurs();
    await insererStatistiquesGardiens();

    console.log('Mise à jour de toutes les statistiques terminée.');
  } catch (error) {
    console.error('Erreur lors de la mise à jour des statistiques :', error);
  }
};

mettreAJourToutesStatistiques();

module.exports = {
  insererStatistiquesJoueurs,
  insererStatistiquesGardiens,
  mettreAJourToutesStatistiques,
  insererUpdateJoueur,
  insererUpdateEquipe,
};

const axios = require('axios');
const connectDB = require('../config/db.js');
connectDB();
const StatistiqueJoueur = require('../models/StatistiqueJoueur');
const StatistiqueGardien = require('../models/StatistiqueGardien');

// Statistiques Joueurs
const insererStatistiquesJoueurs = async () => {
  try {
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
};

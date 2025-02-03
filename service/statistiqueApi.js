const axios = require('axios');
const connectDB = require('../config/db.js');
connectDB();
const StatistiqueJoueur = require('../models/StatistiqueJoueur');
const StatistiqueGardien = require('../models/StatistiqueGardien');
const StatistiqueEquipe = require('../models/StatistiqueEquipe');

// recuperer stats joueurs depuis api et stocker dans mongodb
const insererStatistiquesJoueurs = async () => {
  try {
    const response = await axios.get('https://api-web.nhle.com/v1/skater-stats-leaders/current');
    const data = response.data;

    let joueursMap = {};

    for (const [categorie, joueurs] of Object.entries(data)) {
      for (const stat of joueurs) {
        const playerId = stat.id;
        
        if (!joueursMap[playerId]) {
          joueursMap[playerId] = {
            playerId,
            firstName: stat.firstName?.default || 'N/A',
            lastName: stat.lastName?.default || 'N/A',
            sweaterNumber: stat.sweaterNumber,
            team: stat.teamAbbrev,
            position: stat.position,
            headshot: stat.headshot
          };
        }

        joueursMap[playerId][categorie] = stat.value;
      }
    }

    for (const joueurData of Object.values(joueursMap)) {
      console.log('insertion mise a jour joueur:', joueurData);

      await StatistiqueJoueur.updateOne(
        { playerId: joueurData.playerId },
        { $set: joueurData },
        { upsert: true, new: true }
      );
    }

    console.log('statistiques joueurs mises a jour avec succes');
  } catch (error) {
    console.error('erreur mise a jour statistiques joueurs :', error);
  }
};

// recuperer stats gardiens depuis api et stocker dans mongodb
const insererStatistiquesGardiens = async () => {
  try {
    const response = await axios.get('https://api-web.nhle.com/v1/goalie-stats-leaders/current');
    const data = response.data;

    let gardiensMap = {};

    for (const [categorie, gardiens] of Object.entries(data)) {
      for (const stat of gardiens) {
        const playerId = stat.id;
        
        if (!gardiensMap[playerId]) {
          gardiensMap[playerId] = {
            playerId,
            firstName: stat.firstName?.default || 'N/A',
            lastName: stat.lastName?.default || 'N/A',
            sweaterNumber: stat.sweaterNumber,
            team: stat.teamAbbrev,
            position: stat.position,
            headshot: stat.headshot
          };
        }

        gardiensMap[playerId][categorie] = stat.value;
      }
    }

    for (const gardienData of Object.values(gardiensMap)) {
      console.log('insertion mise a jour gardien:', gardienData);

      await StatistiqueGardien.updateOne(
        { playerId: gardienData.playerId },
        { $set: gardienData },
        { upsert: true }
      );
    }

    console.log('statistiques gardiens mises a jour avec succes');
  } catch (error) {
    console.error('erreur mise a jour statistiques gardiens :', error);
  }
};

// recuperer stats equipes depuis api et stocker dans mongodb
const insererStatistiquesEquipes = async () => {
  try {
    const response = await axios.get('https://api.nhle.com/stats/rest/en/team/summary');
    const data = response.data.data;

    let equipesMap = {};

    for (const equipe of data) {
      const teamId = equipe.teamId;
      
      if (!equipesMap[teamId]) {
        equipesMap[teamId] = {
          teamId,
          teamName: equipe.teamFullName,
          gamesPlayed: equipe.gamesPlayed,
          wins: equipe.wins,
          losses: equipe.losses,
          otLosses: equipe.otLosses,
          points: equipe.points,
          goalsFor: equipe.goalsFor,
          goalsAgainst: equipe.goalsAgainst,
          shotsForPerGame: equipe.shotsForPerGame,
          shotsAgainstPerGame: equipe.shotsAgainstPerGame,
          powerPlayPercentage: equipe.powerPlayPct,
          penaltyKillPercentage: equipe.penaltyKillPct
        };
      }
    }

    for (const equipeData of Object.values(equipesMap)) {
      console.log('insertion mise a jour equipe:', equipeData);

      await StatistiqueEquipe.updateOne(
        { teamId: equipeData.teamId },
        { $set: equipeData },
        { upsert: true }
      );
    }

    console.log('statistiques equipes mises a jour avec succes');
  } catch (error) {
    console.error('erreur recuperation ou insertion statistiques equipes :', error);
  }
};

// mettre a jour toutes les statistiques en appelant chaque fonction
const mettreAJourToutesStatistiques = async () => {
  try {
    console.log('debut mise a jour statistiques');
    
    await insererStatistiquesJoueurs();
    await insererStatistiquesGardiens();
    await insererStatistiquesEquipes();

    console.log('mise a jour statistiques terminee');
  } catch (error) {
    console.error('erreur mise a jour statistiques :', error);
  }
};

mettreAJourToutesStatistiques();

// exporter les fonctions pour utilisation ailleurs
module.exports = {
  insererStatistiquesJoueurs,
  insererStatistiquesGardiens,
  insererStatistiquesEquipes,
  mettreAJourToutesStatistiques,
};

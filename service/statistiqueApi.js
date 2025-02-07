const axios = require('axios');
const connectDB = require('../config/db.js');
connectDB();
const StatistiqueJoueur = require('../models/StatistiqueJoueur');
const StatistiqueGardien = require('../models/StatistiqueGardien');
const StatistiqueEquipe = require('../models/StatistiqueEquipe');

// récupérer stats joueurs depuis api et stocker dans mongodb
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

      await StatistiqueJoueur.updateOne(
        { playerId: joueurData.playerId },
        { $set: joueurData },
        { upsert: true, new: true }
      );
    }

    console.log('statistiques joueurs mises à jour avec succès', 200);
  } catch (error) {
    console.error('erreur mise à jour statistiques joueurs :', error);
  }
};

// récupérer stats gardiens depuis api et stocker dans mongodb
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

      await StatistiqueGardien.updateOne(
        { playerId: gardienData.playerId },
        { $set: gardienData },
        { upsert: true }
      );
    }

    console.log('statistiques gardiens mises à jour avec succès', 200);
  } catch (error) {
    console.error('erreur mise à jour statistiques gardiens :', error);
  }
};

// récupérer stats équipes depuis api et stocker dans mongodb
const insererStatistiquesEquipes = async () => {
  try {
    const response = await axios.get('https://api-web.nhle.com/v1/standings/now');
   
    // Vérifier que la cle "standings" existe
    if (!response.data || !response.data.standings) {
      throw new Error("Format de réponse inattendu, aucune donnée d'équipe trouvée.");
    }

    const data = response.data.standings;
    let equipesMap = {};

    for (const equipe of data) {
      if (!equipe.teamAbbrev || !equipe.teamAbbrev.default) {
        console.error("Erreur : Données d'équipe incomplètes :", equipe);
        continue;
      }
      
      const teamAbbrev = equipe.teamAbbrev.default; 
      equipesMap[teamAbbrev] = {
        teamAbbrev: teamAbbrev,
        teamName: equipe.teamName?.default || "N/A",
        teamCommonName: equipe.teamCommonName?.default || "N/A",
        teamLogo: equipe.teamLogo || "/default_logo.png",
        points: equipe.points || 0,
        wins: equipe.wins || 0,
        losses: equipe.losses || 0,
        goalsFor: equipe.goalFor || 0,
        goalsAgainst: equipe.goalAgainst || 0
      };
    }

    // Insérer ou mettre à jour les équipes en base de données
    for (const equipeData of Object.values(equipesMap)) {
  
      if (!equipeData.teamAbbrev) {
          console.warn(`Équipe ignorée car teamAbbrev est null:`, equipeData);
          continue;  // Ignore cette équipe si son teamAbbrev est null
      }
  
      await StatistiqueEquipe.updateOne(
          { teamAbbrev: equipeData.teamAbbrev }, // Utilisation de teamAbbrev comme ID unique
          { $set: equipeData },
          { upsert: true }
      );
  }

    console.log('Statistiques des équipes mises à jour avec succès.', 200);
  } catch (error) {
    console.error('Erreur lors de la récupération ou de l’insertion des statistiques des équipes :', error);
  }
};



// mettre à jour toutes les statistiques en appelant chaque fonction
const mettreAJourToutesStatistiques = async () => {
  try {
    console.log('Début mise à jour statistiques');
    
    await insererStatistiquesJoueurs();
    await insererStatistiquesGardiens();
    await insererStatistiquesEquipes();

    console.log('Mise à jour statistiques terminée');
  } catch (error) {
    console.error('erreur mise à jour statistiques :', error);
  }
};



// exporter les fonctions pour utilisation ailleurs
module.exports = {
  insererStatistiquesJoueurs,
  insererStatistiquesGardiens,
  insererStatistiquesEquipes,
  mettreAJourToutesStatistiques,
};

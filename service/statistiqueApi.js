const axios = require('axios');
const StatistiqueJoueur = require('../models/StatistiqueJoueur');
const StatistiqueGardien = require('../models/StatistiqueGardien');
const StatistiqueEquipe = require('../models/StatistiqueEquipe');

// Statistiques Joueurs
const insererStatistiquesJoueurs = async () => {
  try {
    const response = await axios.get(
      'https://api-web.nhle.com/v1/skater-stats-leaders/current?categories=goals&limit=5'
    );
    const stats = response.data.goals;// extraction des donnee


    for (const stat of stats) {
      const joueurData = {
        playerId: stat.id,
        firstName: stat.firstName?.default || 'N/A',
        lastName: stat.lastName?.default || 'N/A',
        sweaterNumber: stat.sweaterNumber,
        team: stat.teamAbbrev,
        position: stat.position,
        goals: stat.value,
        headshot: stat.headshot,
      };

      console.log('Insertion/Mise à jour joueur:', joueurData);

      await StatistiqueJoueur.updateOne(
        { playerId: stat.id },
        { $set: joueurData },
        { upsert: true }
      );
    }

    console.log('Statistiques des joueurs mises à jour avec succès.');
  } catch (error) {
    console.error('Erreur lors de la mise à jour des statistiques des joueurs :', error);
  }
};

// Statistiques Gardiens
const insererStatistiquesGardiens = async () => {
  try {
    const response = await axios.get(
      'https://api-web.nhle.com/v1/goalie-stats-leaders/current?categories=wins&limit=5'
    );
    const stats = response.data.wins; // Extraction données

    for (const stat of stats) {
      const gardienData = {
        playerId: stat.id,
        firstName: stat.firstName?.default || 'N/A',
        lastName: stat.lastName?.default || 'N/A',
        sweaterNumber: stat.sweaterNumber,
        team: stat.teamAbbrev,
        position: stat.position,
        wins: stat.value,
        headshot: stat.headshot,
      };

      console.log('Insertion/Mise à jour gardien:', gardienData);

      await StatistiqueGardien.updateOne(
        { playerId: stat.id },
        { $set: gardienData },
        { upsert: true }
      );
    }

    console.log('Statistiques des gardiens mises à jour avec succès.');
  } catch (error) {
    console.error('Erreur lors de la mise à jour des statistiques des gardiens :', error);
  }
};

// **Statistiques Équipes**
const insererStatistiquesEquipes = async () => {
  try {
    const response = await axios.get(
      'https://api.nhle.com/stats/rest/en/team/summary?sort=shotsForPerGame&cayenneExp=seasonId=20242025%20and%20gameTypeId=2'
    );
    const equipes = response.data.data; // Extraction des données

    for (const equipe of equipes) {
      const equipeData = {
        teamId: equipe.teamId,
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
        penaltyKillPercentage: equipe.penaltyKillPct,
      };

      console.log('Insertion/Mise à jour équipe:', equipeData);

      await StatistiqueEquipe.updateOne(
        { teamId: equipe.teamId },
        { $set: equipeData },
        { upsert: true }
      );
    }

    console.log('Statistiques des équipes mises à jour avec succès.');
  } catch (error) {
    console.error('Erreur lors de la récupération ou de l\'insertion des statistiques des équipes :', error);
  }
};

// Mettre à jour toutes les statistiques
const mettreAJourToutesStatistiques = async () => {
  try {
    console.log('Début de la mise à jour des statistiques...');
    
    await insererStatistiquesJoueurs(); // Update des joueurs
    await insererStatistiquesGardiens(); // Update des gardiens
    await insererStatistiquesEquipes(); // Updates des équipes

    console.log('Mise à jour de toutes les statistiques terminée.');
  } catch (error) {
    console.error('Erreur lors de la mise à jour des statistiques :', error);
  }
};

// Pour exporter les fonctions
module.exports = {
  insererStatistiquesJoueurs,
  insererStatistiquesGardiens,
  insererStatistiquesEquipes,
  mettreAJourToutesStatistiques,
};

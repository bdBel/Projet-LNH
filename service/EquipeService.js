const Equipe = require('../models/Equipe');
const mongoose = require('mongoose');
const connectDB = require('../config/db');


// Récupérer une équipe par son abréviation
const getEquipeByABV = async (teamsABV) => {
  try {
    connectDB();
    console.log('Recherche de l\'équipe avec l\'abréviation :', teamsABV);
    const equipe = await Equipe.findOne({ teamsABV: teamsABV });
    if (!equipe) {
      throw new Error('Equipe non trouvée');
    }
    console.log('Équipe trouvée :', equipe);
    return equipe;
  } catch (err) {
    console.error('Erreur dans le service:', err);
    throw new Error('Erreur lors de la récupération de l\'équipe: ' + err.message);
  }
 
};

// Récupérer toutes les équipes d'une conférence donnée
const getEquipesByConference = async (conference) => {
  try {
    const equipes = await Equipe.find({ conference: conference });
    return equipes;
  } catch (err) {
    throw new Error('Erreur lors de la récupération des équipes: ' + err.message);
  }
};

// Récupérer toutes les équipes d'une conférence donnée
const getEquipesByDivision = async (division) => {
  try {
    const equipes = await Equipe.find({ division: division });
    return equipes;
  } catch (err) {
    throw new Error('Erreur lors de la récupération des équipes: ' + err.message);
  }
};

module.exports = {
  getEquipeByABV,
  getEquipesByConference,
  getEquipesByDivision
};


const Equipe = require('../models/Equipe');
const connectDB = require('../config/db');


// Récupérer une équipe par son abréviation
const getEquipeByABV = async (teamsABV) => {
  try {
    connectDB();
    const equipe = await Equipe.findOne({ teamsABV: teamsABV });
    if (!equipe) {
      throw new Error('Equipe non trouvée');
    }
    console.log('Équipe trouvée :', 200);
    return equipe;
  } catch (err) {
    console.error('Erreur dans le service:', err);
    throw new Error('Erreur lors de la récupération de l\'équipe: ' + err.message);
  }
 
};

// Récupérer toutes les équipes
const getEquipes = async () => {
  try {
    connectDB();
    const listeEquipes = await Equipe.find({});
    return listeEquipes;
  } catch (err) {
    throw new Error('Erreur lors de la récupération des équipes: ' + err.message);
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
  getEquipesByDivision,
  getEquipes
};


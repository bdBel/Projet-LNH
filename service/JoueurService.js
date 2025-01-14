const Joueur  = require('../models/Joueur');
const connectDB = require('../config/db');

// Réccupérer tous les joueurs d'une équipe donnée
const getJoueursByEquipe = async (teamsABV) => {
  try {
    connectDB();
    console.log("Tu es dans le service");
    const joueurs = await Joueur.find({ team: teamsABV });
    console.log('Joueurs trouvés :', joueurs);
    return joueurs;
  } catch (err) {
    throw new Error('Erreur lors de la récupération des joueurs: ' + err.message);
  }
};

module.exports = {
  getJoueursByEquipe
};

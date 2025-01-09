const EquipeService = require('../service/EquipeService');

// Récupérer une équipe par son abréviation
const getEquipeByABVControlleur = async (req, res) => {
    try {
      const teamABV = req.params.teamABV; // Récupérer le paramètre de l'URL
      const equipe = await EquipeService.getEquipeByABV(teamABV); // Appel au service pour récupérer l'équipe
  
      if (!equipe) {
        // Si l'équipe n'est pas trouvée, afficher une page d'erreur
        return res.status(404).render('error', { message: 'Equipe non trouvée' });
      }
  
      // Rendre la vue 'equipe.ejs' avec les données de l'équipe
      res.render('equipe', { equipe });
      //res.status(200).json(equipe); // Retourner l'équipe
    } catch (err) {
      // En cas d'erreur, afficher une page d'erreur avec un message
      res.status(500).render('error', { message: 'Erreur interne du serveur : ' + err.message });
    }
  };

  // Contrôleur pour récupérer toutes les équipes d'une conférence donnée
const getEquipesByConferenceControlleur = async (req, res) => {
    try {
      const conference = req.params.conference; // Extraction du paramètre depuis l'URL
      const equipes = await equipeService.getEquipesByConference(conference);

      if(!equipes)
        // Si l'équipe n'est pas trouvée, afficher une page d'erreur
      return res.status(404).render('error', { message: 'Equipe non trouvée' });

    // Rendre la vue 'equipe.ejs' avec les données de l'équipe
    res.render('classement', { equipes:equipes });
    res.status(200).json(equipes); // Retourner la liste des équipes
    } catch (err) {
      res.status(500).render('error', { message: 'Erreur interne du serveur : ' + err.message });
    }
  };
  
  // Contrôleur pour récupérer toutes les équipes d'une division donnée
  const getEquipesByDivisionControlleur = async (req, res) => {
    try {
      const division = req.params.division; // Extraction du paramètre depuis l'URL
      const equipes = await equipeService.getEquipesByDivision(division);


      res.status(200).json(equipes); // Retourner la liste des équipes
    } catch (err) {
      res.status(404).json({ message: err.message }); // Gérer les erreurs
    }
  };
  
  module.exports = {
    getEquipeByABVControlleur,
    getEquipesByConferenceControlleur,
    getEquipesByDivisionControlleur,
  };
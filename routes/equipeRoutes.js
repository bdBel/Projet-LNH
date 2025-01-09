const express = require('express');
const router = express.Router();
const EquipeControlleur = require('../controllers/EquipeControlleur');
/**
// Route pour récupérer une équipe par son abréviation
router.get('/equipe/:teamABV', EquipeControlleur.getEquipeByABVControlleur);

// Route pour récupérer les équipes par conférence
router.get('/conference/conference', EquipeControlleur.getEquipesByConferenceControlleur);

// Route pour récupérer les équipes par division
router.get('/division/division', EquipeControlleur.getEquipesByDivisionControlleur);
*/

const EquipeService = require('../service/EquipeService');

// Récupérer une équipe par son abréviation
router.get("/equipe/:teamsABV", async (req, res) => {
    try {
      const teamsABV = req.params.teamsABV; // Récupérer le paramètre de l'URL
      console.log("Requetere pour l'equipe avec l'abréviation : " + teamsABV);
      const equipe = await EquipeService.getEquipeByABV(teamsABV); // Appel au service pour récupérer l'équipe
      console.log('Équipe récupérée :', equipe); 
  
      if (!equipe) {
        // Si l'équipe n'est pas trouvée, afficher une page d'erreur
        return res.status(404).render('error', { message: 'Equipe non trouvée' });
      }
  
      // Rendre la vue 'equipe.ejs' avec les données de l'équipe
      res.render('equipe', { equipe });
      //res.status(200).json(equipe); // Retourner l'équipe
    } catch (err) {
      // En cas d'erreur, afficher une page d'erreur avec un message
      res.status(500);
    }
  });
module.exports = router;
 
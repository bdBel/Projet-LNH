const express = require('express');
const router = express.Router();

const EquipeService = require('../service/EquipeService');

// Récupérer une équipe par son abréviation
router.get("/equipe/:teamsABV", async (req, res) => {
    try {
      const teamsABV = req.params.teamsABV; // Récupérer le paramètre de l'URL
      console.log("Requetere pour l'equipe avec l'abréviation : " + teamsABV);
      const equipe = await EquipeService.getEquipeByABV(teamsABV); // Appel au service pour récupérer l'équipe
      console.log('Équipe récupérée :', equipe); 
  
      if (!equipe) {
        // Si l'équipe n'est pas trouvée
        return res.status(404).send('Équipe non trouvée');
      }
  
      // Rendre la vue 'equipe.ejs' avec les données de l'équipe
      res.render('equipe', { equipe });
    } catch (err) {
      // En cas d'erreur, afficher une page d'erreur avec un message
      res.status(500);
    }
  });

  // Récupérer une liste d'équipe
router.get("/listeEquipes", async (req, res) => {
  try {
    const listeEquipes = await EquipeService.getEquipes(); // Appel au service pour récupérer l'équipe
    console.log('Liste d\'Équipe récupérée :', listeEquipes); 

    if (!listeEquipes) {
      // Si la liste d'équipe n'est pas trouvée
      return res.status(404).send('Liste d\'équipe non trouvée');
    }

    // Rendre la vue 'equipe.ejs' avec les données de l'équipe
    res.render('listEquipe', { equipe: listeEquipes });
  
  } catch (err) {
    // En cas d'erreur, afficher une page d'erreur avec un message
    res.status(500);
  }
});
module.exports = router;
 
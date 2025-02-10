const express = require('express');
const router = express.Router();
const EquipeService = require('../service/EquipeService');

// Récupérer une équipe par son abréviation
router.get("/equipe/:teamsABV", async (req, res) => {
  const username = req.session.username;

  try {
    const teamsABV = req.params.teamsABV; // Get the team abbreviation from the URL
    console.log("Requête pour l'équipe avec l'abréviation : " + teamsABV);
    
    // Get the team data from the service
    const equipe = await EquipeService.getEquipeByABV(teamsABV); 
    
    console.log('Équipe récupérée :', equipe); 

    if (!equipe) {
      // If the team is not found, show a 404 error
      return res.status(404).send('Équipe non trouvée');
    }

    // If the user is logged in, pass the username to the view
    // If not logged in, just render the page without the username
    res.render('equipe', { username, equipe });

  } catch (err) {
    // In case of an error, show an error page with a message
    console.error('Erreur lors de la récupération de l\'équipe:', err);
    res.status(500).send('Erreur du serveur');
  }
});



  // Récupérer une liste d'équipe
router.get("/listeEquipes", async (req, res) => {
  const username = req.session.username; // Accès à la session
  try {
    const listeEquipes = await EquipeService.getEquipes(); // Appel au service pour récupérer l'équipe
    console.log('Liste d\'Équipe récupérée :', listeEquipes); 

    if (!listeEquipes) {
      // Si la liste d'équipe n'est pas trouvée
      return res.status(404).send('Liste d\'équipe non trouvée');
    }

    // Rendre la vue 'equipe.ejs' avec les données de l'équipe
    res.render('listeEquipe', 
      { username:username,
         equipe: listeEquipes 
        });
  
  } catch (err) {
    // En cas d'erreur, afficher une page d'erreur avec un message
    res.status(500);
  }
});
module.exports = router;
 
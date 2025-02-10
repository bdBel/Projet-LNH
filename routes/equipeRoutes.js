const express = require('express');
const router = express.Router();
const Equipe = require('../models/Equipe');
const EquipeService = require('../service/EquipeService');

// Récupérer une équipe par son abréviation
router.get("/equipe/:teamsABV", async (req, res) => {
  const username = req.session.username;
    try {
      const teamsABV = req.params.teamsABV; // Récupérer le paramètre de l'URL
      const equipe = await EquipeService.getEquipeByABV(teamsABV); // Appel au service pour récupérer l'équipe
      console.log('Équipe récupérée :', 200); 
  
      if (!equipe) {
        // Si l'équipe n'est pas trouvée
        return res.status(404).send('Équipe non trouvée');
      }
  
      // Rendre la vue 'equipe.ejs' avec les données de l'équipe
      res.render('equipe', { username, equipe });
    } catch (err) {
      // En cas d'erreur, afficher une page d'erreur avec un message
      res.status(500);
    }
  });

  // Récupérer une liste d'équipe
router.get("/listeEquipes", async (req, res) => {
  const username = req.session.username; // Accès à la session
  try {
    const listeEquipes = await EquipeService.getEquipes(); // Appel au service pour récupérer l'équipe
    console.log('Liste d\'Équipe récupérée :', 200); 

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

// Route pour afficher la page members avec les logos
router.get('/members', async (req, res) => {
  try {
      const equipes = await Equipe.find({}, 'teamCommonName logo'); // Récupère le nom et le logo

      res.render('accueilMembre', { 
          username: req.session.username || "Invité", 
          equipes 
      });
  } catch (err) {
      console.error(err);
      res.status(500).send("Erreur lors du chargement des équipes.");
  }
});

module.exports = router;
 
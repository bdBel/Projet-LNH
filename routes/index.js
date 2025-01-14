const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
  try {
      
      res.render('acceuil', ); // Passer les données à la vue
  } catch (error) {
      console.error('Erreur lors de la récupération des matchs :', error);
      res.status(500).send('Erreur interne du serveur');
  }
});

module.exports = router;


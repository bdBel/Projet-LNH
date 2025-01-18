const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
      // Pass the logged-in user's data to the view
      res.render('acceuil', { username: req.session.username });  // Pass session data (if logged in)
  } catch (error) {
      console.error('Erreur lors de la récupération des matchs :', error);
      res.status(500).send('Erreur interne du serveur');
  }
});

module.exports = router;

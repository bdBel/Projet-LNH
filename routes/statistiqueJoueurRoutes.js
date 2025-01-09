const express = require('express');
const router = express.Router();
const StatistiqueJoueur = require('../models/StatistiqueJoueur');

// GET 
router.get('/', async (req, res) => {
  try {
    const stats = await StatistiqueJoueur.find();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST 
router.post('/', async (req, res) => {
  const stat = new StatistiqueJoueur(req.body);
  try {
    const newStat = await stat.save();
    res.status(201).json(newStat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT
router.put('/:id', async (req, res) => {
  try {
    const updatedStat = await StatistiqueJoueur.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedStat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE 
router.delete('/:id', async (req, res) => {
  try {
    await StatistiqueJoueur.findByIdAndDelete(req.params.id);
    res.json({ message: 'Statistique de joueur supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Erreur
router.get('/', async (req, res) => {
    try {
      const stats = await StatistiqueGardien.find();
      if (!stats) {
        return res.status(404).json({ message: 'Aucune statistique trouvée' });
      }
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


module.exports = router;

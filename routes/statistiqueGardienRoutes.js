const express = require('express');
const router = express.Router();
const StatistiqueGardien = require('../models/StatistiqueGardien');

// GET recup toutes les stats des gardiens
router.get('/', async (req, res) => {
  try {
    const stats = await StatistiqueGardien.find();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST Ajouter une stat pour les gardien
router.post('/', async (req, res) => {
  const stat = new StatistiqueGardien(req.body);
  try {
    const newStat = await stat.save();
    res.status(201).json(newStat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update stats existante
router.put('/:id', async (req, res) => {
  try {
    const updatedStat = await StatistiqueGardien.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedStat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE Supprimer une statistique
router.delete('/:id', async (req, res) => {
  try {
    await StatistiqueGardien.findByIdAndDelete(req.params.id);
    res.json({ message: 'Statistique de gardien supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

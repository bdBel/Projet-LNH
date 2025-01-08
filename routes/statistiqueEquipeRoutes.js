const express = require('express');
const router = express.Router();
const StatistiqueEquipe = require('../models/StatistiqueEquipe');

// GET 
router.get('/', async (req, res) => {
  try {
    const stats = await StatistiqueEquipe.find();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST 
router.post('/', async (req, res) => {
  const stat = new StatistiqueEquipe(req.body);
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
    const updatedStat = await StatistiqueEquipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedStat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await StatistiqueEquipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Statistique d\'équipe supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

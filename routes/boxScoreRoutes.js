const express = require('express');
const router = express.Router();
const data = require('../service/liveScoreService');


router.get("/boxscore/:id", async (req, res) => {
    try {
        console.log('id:', req.params.id);
        const id = req.params.id;
        
        const game = await data.getSumary(id);
        
        res.render('resultat', {game});
    } catch (error) {
        console.error('Erreur lors de la récupération des données: dans la routes ', error.message);
        res.status(500).send('Erreur lors de la récupération des données. Dans la routes');
    }
});

module.exports = router;

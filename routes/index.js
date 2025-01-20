const express = require('express');
const router = express.Router();
const liveScoreService = require('../service/liveScoreService');

router.get('/', async (req, res) => {
  try {

    const gamesByDate = await liveScoreService.getGamesLive();
    if (!gamesByDate || gamesByDate.length === 0) {
        return res.status(404).send('Aucun match en cours.');
    }

    gamesByDate.forEach(dateEntry => {
        dateEntry.games.forEach(game => {        
         if (game.gameState === 'FUT') {
            game.gameState = 'À VENIR';
            console.log('game.gameState:', game.gameState)}else if(game.gameState === 'OFF'){
                game.gameState = 'FINAL';
                game.formattedStartTime = ""
            };    
        });       
       
    });             
          

    // Rendu des jeux avec les données modifiées
    res.render('acceuil', { games: gamesByDate }); // Rendre la vue avec les données formatées
} catch (error) {
    console.error('Erreur lors de la récupération des données:', error.message);
    res.status(500).send('Erreur lors de la récupération des données.');
}
});

module.exports = router;


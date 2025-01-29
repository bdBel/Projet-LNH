const express = require('express');
const router = express.Router();
const liveScoreService = require('../service/liveScoreService');
const { getVideosFromDb } = require('../service/videoService');

router.get('/', async (req, res) => {
  try {
    // APPEL des partie en direct
    const gamesByDate = await liveScoreService.getGamesLive(); 
    
    // Obtenez la date actuelle au format "YYYY-MM-DD"
    const currentDate = new Date().toISOString().split('T')[0]; 
    
    if (!gamesByDate || gamesByDate.length === 0) {
        return res.status(404).send('Aucun match en cours.');
    }

    gamesByDate.forEach(dateEntry => {     
        dateEntry.games.forEach(game => {        
            if (game.gameState === 'FUT' || game.gameState === 'PRE') {
                if(game.dateGame === currentDate){
                    game.gameState = 'Aujourdhui | ';
                }else{
                    game.gameState = 'À VENIR | ';
                }               
                
            }else if(game.gameState === 'OFF'){
                game.gameState = 'FINAL';
                game.formattedStartTime = " "                
            }else if(game.gameState === 'LIVE'){
                game.gameState = 'EN DIRECT'; 
                game.formattedStartTime = "";               
            }
        });  
    });     
    //Fin appel des partie en direct
   // Récupérer les vidéos
   const videos = await getVideosFromDb();

    // Rendu des jeux avec les données modifiées
    // membre logged in
    const username = req.session.username;
       
    res.render('acceuil', { games: gamesByDate, videos, username}); // Rendre la vue avec les données formatées + user connecté
} catch (error) {
    console.error('Erreur lors de la récupération des données:', error.message);
    res.status(500).send('Erreur lors de la récupération des données.');
}
 
});



module.exports = router;
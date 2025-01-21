const express = require('express');
const router = express.Router();
const data = require('../service/liveScoreService');


router.get("/boxscore/:id", async (req, res) => {
    try {
        console.log('id:', req.params.id);
        //Reprendre le id dans l'URL
        const id = req.params.id;
        //Récupérer les données du match avec le id récupérer
        const game = await data.getSummary(id);
        

        if(game.gameState === "FUT" || game.gameState === "PRE"){
            game.gameState = "À VENIR" 
            res.render('resultatAvantMatch', {game});
        }else{
             //Transformer les donner d'affichage de l'état du match
            if (game.gameState === "OFF" || game.clock.timeRemaining === "00:00") {
                game.gameState = "Final"; 
                game.clock.timeRemaining = " ";
            } else if (game.gameState === "LIVE") {
                game.gameState === "En Direct" 
                
            }else if (data.gameState === "FUT") {
                game.gameState === "À venir" 
            }

            //Transformer les donner d'affichage du temps restant
            if ( game.gameState == "OFF") {
                game.clock.timeRemaining = " "
            } else {
                game.clock.timeRemaining = game.clock.timeRemaining;
            } 
            res.render('resultat', {game});
        };
        
    return game;
        
    } catch (error) {
        console.error('Erreur lors de la récupération des données: dans la routes ', error.message);
        res.status(500).send('Erreur lors de la récupération des données. Dans la routes');
    }
});

module.exports = router;

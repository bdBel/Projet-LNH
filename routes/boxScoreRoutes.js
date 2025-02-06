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


            game.summary.scoring.forEach(scoring => {
                scoring.goals.forEach(goal => {
                    if(goal.shotType === 'wrist'){
                        goal.shotType = 'Tir du Poignet';
                    }else if(goal.shotType === 'slap' || goal.shotType === 'snap'){
                        goal.shotType = 'Tir Frappé';
                    }else if(goal.shotType === 'deflected'|| goal.shotType === 'tip-in'){
                        goal.shotType = 'Déviation' ;
                    }else if(goal.shotType === 'bat'){
                        goal.shotType = 'Coup de Baton';
                    }else {
                        goal.shotType = '';
                    }
                });
            });

            game.summary.scoring.forEach(period => {  
                if (period.periodDescriptor.number === 4){
                    period.periodDescriptor.number = period.periodDescriptor.periodType;
;                }else if (period.periodDescriptor.number === 5){
                    period.periodDescriptor.number = 'Tirs de Barrage';
                }
            });

            
            res.render('resultat', {game});
        };
        console.log(game.matchup);

    return game;
        
    } catch (error) {
        console.error('Erreur lors de la récupération des données: dans la routes ', error.message);
        res.status(500).send('Erreur lors de la récupération des données. Dans la routes');
    }
});

module.exports = router;

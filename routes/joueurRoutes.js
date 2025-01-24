const express = require('express');
const router = express.Router();
const JoueurService = require('../service/JoueurService');

// Récupérer une liste de joueurs
router.get("/:teamsABV/joueur", async (req, res) => {
    try {
        console.log("Tu es dans le router");
        const teamsABV = req.params.teamsABV;
        console.log("Requête pour l'équipe avec l'abréviation : " + teamsABV);
        const joueurs = await JoueurService.getJoueursByEquipe(teamsABV);
        console.log('Joueurs récupérés :', joueurs);
        

        if (!joueurs || joueurs.length === 0) {
            console.log("Aucun joueur trouvé pour cette équipe");
            return res.status(404).send('Joueurs non trouvés');
        }


        // Rendre la vue 'listeJoueur.ejs' avec les données des joueurs
        res.render('listeJoueur', { joueurs });
    } catch (err) {
        console.error('Erreur dans le router:', err);
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router;
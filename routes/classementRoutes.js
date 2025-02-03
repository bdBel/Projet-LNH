const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Equipe = require('../models/Equipe');
const StatistiqueEquipe = require('../models/StatistiqueEquipe'); // import modele stats equipe

// route principale pour afficher le classement des equipes avec leurs statistiques
router.get('/', async (req, res) => {
    try {
        if (!mongoose.connection.readyState) {
            console.error("mongodb n'est pas connecte");
            return res.status(500).send("erreur de connexion a la base de donnees");
        }

        // recuperer toutes les equipes de la conference ouest
        const equipesOuest = await Equipe.find({ conference: "Western" }).lean();
        // recuperer toutes les equipes de la conference est
        const equipesEst = await Equipe.find({ conference: "Eastern" }).lean();

        // recuperer toutes les statistiques des equipes
        const statsEquipes = await StatistiqueEquipe.find().lean();

        console.log("stats recuperees", statsEquipes);

        // associer les statistiques aux equipes correspondantes en utilisant teamId
        const ajouterStats = (equipes) => {
            return equipes.map(equipe => {
                const stats = statsEquipes.find(stat => String(stat.teamId) === String(equipe._id));
                return {
                    ...equipe,
                    stats: stats || { points: 0, wins: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 } // valeurs par defaut si absentes
                };
            });
        };

        // ajouter les stats aux equipes de la conference ouest puis trier par points et garder les 10 meilleures
        const equipesOuestAvecStats = ajouterStats(equipesOuest).sort((a, b) => (b.stats.points || 0) - (a.stats.points || 0)).slice(0, 10);
        // ajouter les stats aux equipes de la conference est puis trier par points et garder les 10 meilleures
        const equipesEstAvecStats = ajouterStats(equipesEst).sort((a, b) => (b.stats.points || 0) - (a.stats.points || 0)).slice(0, 10);

        console.log("equipes ouest avec stats", equipesOuestAvecStats);
        console.log("equipes est avec stats", equipesEstAvecStats);

        // envoyer les donnees a la vue classement pour affichage
        res.render('classement', { equipesOuest: equipesOuestAvecStats, equipesEst: equipesEstAvecStats });

    } catch (error) {
        console.error("erreur lors de la recuperation du classement", error);
        res.status(500).send("erreur serveur");
    }
});

module.exports = router;

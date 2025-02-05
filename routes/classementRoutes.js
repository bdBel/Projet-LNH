const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Equipe = require('../models/Equipe');
const StatistiqueEquipe = require('../models/StatistiqueEquipe'); // Import du modèle StatistiqueEquipe

// Route principale pour afficher le classement des équipes avec leurs statistiques
router.get('/', async (req, res) => {
    try {
        if (!mongoose.connection.readyState) {
            console.error("MongoDB n'est pas connecté");
            return res.status(500).send("Erreur de connexion à la base de données");
        }

        // Récupérer toutes les équipes de la conférence Ouest et Est
        const equipesOuest = await Equipe.find({ conference: "Western" }).lean();
        const equipesEst = await Equipe.find({ conference: "Eastern" }).lean();

        // Récupérer toutes les statistiques des équipes
        const statsEquipes = await StatistiqueEquipe.find().lean();

        console.log("Stats récupérées :", statsEquipes);

        // Associer les statistiques aux équipes correspondantes avec `teamAbbrev`
        const ajouterStats = (equipes) => {
            return equipes.map(equipe => {
                const stats = statsEquipes.find(stat => stat.teamAbbrev === equipe.teamsABV);
                return {
                    ...equipe,
                    teamName: stats ? stats.teamName : equipe.full_name,
                    stats: stats || { points: 0, wins: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }, // Valeurs par défaut si absentes
                    logo: equipe.logo // Utilise le champ `logo` de `Equipe`
                };
            });
        };

        // Ajouter les stats et trier par points
        const equipesOuestAvecStats = ajouterStats(equipesOuest).sort((a, b) => (b.stats.points || 0) - (a.stats.points || 0));
        const equipesEstAvecStats = ajouterStats(equipesEst).sort((a, b) => (b.stats.points || 0) - (a.stats.points || 0));

        console.log("Équipes Ouest avec stats :", equipesOuestAvecStats);
        console.log("Équipes Est avec stats :", equipesEstAvecStats);

        // Rendu de la page
        res.render('classement', { equipesOuest: equipesOuestAvecStats, equipesEst: equipesEstAvecStats });

    } catch (error) {
        console.error("Erreur lors de la récupération du classement", error);
        res.status(500).send("Erreur serveur");
    }
});

module.exports = router;

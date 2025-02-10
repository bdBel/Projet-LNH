const express = require('express');
const router = express.Router();
const StatistiqueService = require('../service/statistiqueService');
const EquipeService = require('../service/EquipeService');

router.get('/', async (req, res) => {
    const username = req.session.username;
    try {
        console.log("Accès à la page principale Statistiques");

        const voirTout = req.query.voirTout === 'true';

        // recuperer toutes stats joueurs
        const joueurs = await StatistiqueService.getAllStatsJoueurs();

        // recuperer toutes stats gardiens
        const gardiens = await StatistiqueService.getAllStatsGardiens();

        // trier joueurs par points et limiter a 10 si voirTout est faux
        const topJoueurs = joueurs.sort((a, b) => b.points - a.points);
        const patineurs = voirTout ? topJoueurs : topJoueurs.slice(0, 10);

        // trier gardiens par pourcentage d'arrets et limiter a 10 si voirTout est faux
        const topGardiens = gardiens.sort((a, b) => b.savePercentage - a.savePercentage);
        const gardiensTop = voirTout ? topGardiens : topGardiens.slice(0, 10);

        // recuperer defenseurs qui ont position d
        const topDefenseurs = joueurs
        .filter(player => player.position && player.position.toUpperCase().includes('D'))
        .sort((a, b) => b.points - a.points);
    
        const defenseurs = voirTout ? topDefenseurs : topDefenseurs.slice(0, 10);


        // recuperer logos des equipes et creer map equipe abrev vers logo
        const equipes = await EquipeService.getEquipes();
        const equipesMap = {};
        equipes.forEach(equipe => {
            equipesMap[equipe.teamsABV] = equipe.logo;
        });

        // ajouter logos aux joueurs gardiens et defenseurs
        patineurs.forEach(player => {
            player.teamLogo = equipesMap[player.team] || '/default_logo.png';
        });

        gardiensTop.forEach(goalie => {
            goalie.teamLogo = equipesMap[goalie.team] || '/default_logo.png';
        });

        defenseurs.forEach(def => {
            def.teamLogo = equipesMap[def.team] || '/default_logo.png';
        });

        console.log("Données envoyées à la vue statistiques:", 200);

        res.render('statistique', 
            { 
            username: username,
            stats: { patineurs, defenseurs, gardiens: gardiensTop }, 
            voirTout 
        });
        
    } catch (err) {
        console.error("Erreur dans le router des statistiques:", err);
        res.status(500).send('Erreur serveur');
    }
});

router.get('/patineurs', async (req, res) => {
    try {
        console.log("Accès à la page des patineurs");

        const page = parseInt(req.query.page) || 1; 
        const limit = 50; 
        const skip = (page - 1) * limit; 

        // recuperer stats joueurs trier par points et appliquer pagination
        const joueurs = await StatistiqueService.getAllStatsJoueurs();
        const patineurs = joueurs
            .sort((a, b) => b.points - a.points)
            .slice(skip, skip + limit);

        // recuperer logos des equipes et creer map equipe abrev vers logo
        const equipes = await EquipeService.getEquipes();
        const equipesMap = {};
        equipes.forEach(equipe => {
            equipesMap[equipe.teamsABV] = equipe.logo;
        });

        // ajouter logos aux joueurs
        patineurs.forEach(player => {
            player.teamLogo = equipesMap[player.team] || '/default_logo.png';
        });

        // calculer total pages
        const totalJoueurs = joueurs.length;
        const totalPages = Math.ceil(totalJoueurs / limit);


        res.render('PagePatineurs/patineurs', {
            patineurs,
            page,
            totalPages
        });

    } catch (err) {
        console.error("Erreur dans la route des patineurs :", err);
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router;

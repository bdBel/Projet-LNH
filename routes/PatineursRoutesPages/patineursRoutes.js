const express = require('express');
const router = express.Router();
const StatistiqueService = require('../../service/statistiqueService'); // import service statistiques
const EquipeService = require('../../service/EquipeService'); // import service equipes

// route pour afficher la liste des patineurs
router.get('/', async (req, res) => {
    try {
        console.log("acces a la page des patineurs");

        const page = parseInt(req.query.page) || 1; // recuperation numero de page
        const limit = 50; // nombre de joueurs par page
        const skip = (page - 1) * limit; // calcul du nombre de joueurs a ignorer

        // recuperer la liste des patineurs tries par points
        const joueurs = await StatistiqueService.getAllStatsJoueurs();
        const patineurs = joueurs
            .sort((a, b) => b.points - a.points) // tri par points en ordre descendant
            .slice(skip, skip + limit); // pagination

        // recuperer les logos des equipes
        const equipes = await EquipeService.getEquipes();
        const equipesMap = {};
        equipes.forEach(equipe => {
            equipesMap[equipe.teamsABV] = equipe.logo;
        });

        // ajouter les logos aux joueurs
        patineurs.forEach(player => {
            player.teamLogo = equipesMap[player.team] || '/default_logo.png';
        });

        const totalJoueurs = joueurs.length; // nombre total de joueurs
        const totalPages = Math.ceil(totalJoueurs / limit); // calcul du nombre total de pages

        console.log(`affichage des joueurs page ${page}/${totalPages}`);

        // rendre la page avec les joueurs pagines
        res.render('PagePatineurs/patineurs', {
            patineurs,
            page,
            totalPages
        });

    } catch (err) {
        console.error("erreur dans la route des patineurs", err);
        res.status(500).send('erreur serveur');
    }
});

module.exports = router;

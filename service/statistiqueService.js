const StatistiqueJoueur = require('../models/StatistiqueJoueur');
const StatistiqueGardien = require('../models/StatistiqueGardien');
const StatistiqueEquipe = require('../models/StatistiqueEquipe');

const StatistiqueService = {
    // recuperer stats joueur avec abrev equipe dans la BD
    async getStatsJoueursByEquipe(teamAbbreviation) {
        try {
            return await StatistiqueJoueur.find({ team: teamAbbreviation });
        } catch (err) {
            console.error("Erreur lors de la récupération des stats joueurs :", err);
            throw err;
        }
    },

    // recuperer stats gardien avec abrev equipe
    async getStatsGardiensByEquipe(teamAbbreviation) {
        try {
            return await StatistiqueGardien.find({ team: teamAbbreviation });
        } catch (err) {
            console.error("Erreur lors de la récupération des stats gardiens :", err);
            throw err;
        }
    },

    // recuperer stats equipe avec abrev equipe
    async getStatsEquipeByAbbreviation(teamAbbreviation) {
        try {
            return await StatistiqueEquipe.findOne({ teamAbbreviation: teamAbbreviation });
        } catch (err) {
            console.error("Erreur lors de la récupération des stats équipe :", err);
            throw err;
        }
    },

    // recuperer toutes stats joueurs
    async getAllStatsJoueurs() {
        try {
            const joueurs = await StatistiqueJoueur.find({});
            console.log("Liste complète des joueurs retournés:", joueurs);
            return joueurs;
        } catch (err) {
            console.error("Erreur lors de la récupération de toutes les stats joueurs :", err);
            throw err;
        }
    },

    // recuperer toutes stats gardiens
    async getAllStatsGardiens() {
        try {
            return await StatistiqueGardien.find({});
        } catch (err) {
            console.error("Erreur lors de la récupération de toutes les stats gardiens :", err);
            throw err;
        }
    },

    // recuperer toutes stats equipes
    async getAllStatsEquipes() {
        try {
            return await StatistiqueEquipe.find({});
        } catch (err) {
            console.error("Erreur lors de la récupération de toutes les stats équipes :", err);
            throw err;
        }
    }
};


module.exports = StatistiqueService;

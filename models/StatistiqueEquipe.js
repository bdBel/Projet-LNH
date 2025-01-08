const mongoose = require('mongoose');

const StatistiqueEquipeSchema = new mongoose.Schema({
    teamId: Number,
    teamFullName: String,
    gamesPlayed: Number,
    wins: Number,
    losses: Number,
    otLosses: Number,
    goalsFor: Number,
    goalsAgainst: Number,
    shotsForPerGame: Number,
    shotsAgainstPerGame: Number,
    powerPlayPct: Number,
    penaltyKillPct: Number,
});

module.exports = mongoose.model('StatistiqueEquipe', StatistiqueEquipeSchema);

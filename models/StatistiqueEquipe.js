const mongoose = require('mongoose');

const StatistiqueEquipeSchema = new mongoose.Schema({
    teamAbbrev: { type: String, unique: true, required: true },  // ✅ On remplace teamId par teamAbbrev comme clé unique
    teamName: String,
    teamCommonName: String,
    teamLogo: String,
    points: Number,
    wins: Number,
    losses: Number,
    goalsFor: Number,
    goalsAgainst: Number
});

module.exports = mongoose.model("StatistiqueEquipe", StatistiqueEquipeSchema);

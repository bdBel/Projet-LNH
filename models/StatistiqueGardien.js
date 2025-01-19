const mongoose = require('mongoose');

const StatistiqueGardienSchema = new mongoose.Schema({
    playerId: Number,
    firstName: String,
    lastName: String,
    team: String,
    teamName: String,
    position: String,
    sweaterNumber: Number,
    wins: Number,
    headshot: String,
    teamLogo: String,
});

module.exports = mongoose.model('StatistiqueGardien', StatistiqueGardienSchema);

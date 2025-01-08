const mongoose = require('mongoose');

const StatistiqueJoueurSchema = new mongoose.Schema({
    playerId: { type: Number, required: true, unique: true },
    firstName: { type: String, required: true }, 
    lastName: { type: String, required: true }, 
    sweaterNumber: { type: Number, required: false },
    team: { type: String, required: true }, 
    position: { type: String, required: true },
    goals: { type: Number, required: true }, 
});

module.exports = mongoose.model('StatistiqueJoueur', StatistiqueJoueurSchema);

const mongoose = require('mongoose');

const StatistiqueJoueurSchema = new mongoose.Schema({
    playerId: { type: Number, required: true, unique: true },
    firstName: { type: String, required: true }, 
    lastName: { type: String, required: true }, 
    sweaterNumber: { type: Number },
    team: { type: String, required: true }, 
    position: { type: String, required: true },
    goals: { type: Number, default: 0 }, 
    assists: { type: Number, default: 0 }, 
    points: { type: Number, default: 0 },
    plusMinus: { type: Number, default: 0 },
    shots: { type: Number, default: 0 },
    shotPct: { type: Number, default: 0 },
    hits: { type: Number, default: 0 },
    blocks: { type: Number, default: 0 },
    headshot: { type: String },
}, { strict: false });

module.exports = mongoose.model('StatistiqueJoueur', StatistiqueJoueurSchema);

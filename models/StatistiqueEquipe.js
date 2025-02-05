const mongoose = require("mongoose");

const StatistiqueEquipeSchema = new mongoose.Schema(
  {
    teamId: { type: Number, required: true, unique: true },
    teamName: { type: String, required: true },
    gamesPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    otLosses: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    goalsFor: { type: Number, default: 0 },
    goalsAgainst: { type: Number, default: 0 },
    shotsForPerGame: { type: Number, default: 0 },
    shotsAgainstPerGame: { type: Number, default: 0 },
    powerPlayPercentage: { type: Number, default: 0 },
    penaltyKillPercentage: { type: Number, default: 0 },
    faceoffWinPct: { type: Number, default: 0 },
    penaltyMinutes: { type: Number, default: 0 },
  },
  { strict: false },
);

module.exports = mongoose.model("StatistiqueEquipe", StatistiqueEquipeSchema);

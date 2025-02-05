const mongoose = require("mongoose");

const StatistiqueGardienSchema = new mongoose.Schema(
  {
    playerId: { type: Number, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    sweaterNumber: { type: Number },
    team: { type: String, required: true },
    position: { type: String, required: true },
    wins: { type: Number, default: 0 },
    savePct: { type: Number, default: 0 },
    gaa: { type: Number, default: 0 },
    shutouts: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    shotsAgainst: { type: Number, default: 0 },
    headshot: { type: String },
  },
  { strict: false },
);

module.exports = mongoose.model("StatistiqueGardien", StatistiqueGardienSchema);

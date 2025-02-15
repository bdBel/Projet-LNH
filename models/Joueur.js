const mongoose = require("mongoose");

const joueurSchema = new mongoose.Schema({
  _id: Number,
  headshot: { type: String, required: false },
  firstName: { default: { type: String, required: true } },
  lastName: { default: { type: String, required: true } },
  position: { type: String, required: true },
  team: { type: String, required: true },
  sweaterNumber: { type: Number, required: true },
  birthDate: { type: Date, required: true },
  nationality: { type: String, required: true },
  heightInInches: { type: Number, required: true },
  weightInPounds: { type: Number, required: true },
  heroImage: { type: String, required: false },
  draftDetails: {
    year: { type: Number, required: false },
    overall: { type: Number, required: false },
    teamAbbrev: { type: String, required: false },
    round: { type: Number, required: false },
    pickInRound: { type: Number, required: false },
    overallPick: { type: Number, required: false },
  },
  seasonTotals: [
    {
      avgToi: { type: String, required: false },
      assists: { type: Number, required: false },
      goals: { type: Number, required: false },
      otGoals: { type: Number, required: false },
      points: { type: Number, required: false },
      gamesPlayed: { type: Number, required: false },
      plusMinus: { type: Number, required: false },
      powerPlayGoals: { type: Number, required: false },
      powerPlayPoints: { type: Number, required: false },
      shortHandedGoals: { type: Number, required: false },
      shortHandedPoints: { type: Number, required: false },
      shots: { type: Number, required: false },
      season: { type: Number, required: false },
      gameTypeId: { type: Number, required: false },
      leagueAbbrev: { type: String, required: false },
    },
  ],
  careerTotals: {
    regularSeason: {
      avgToi: { type: String, required: false },
      assists: { type: Number, required: false },
      goals: { type: Number, required: false },
      otGoals: { type: Number, required: false },
      points: { type: Number, required: false },
      gamesPlayed: { type: Number, required: false },
      plusMinus: { type: Number, required: false },
      powerPlayGoals: { type: Number, required: false },
      powerPlayPoints: { type: Number, required: false },
      shortHandedGoals: { type: Number, required: false },
      shortHandedPoints: { type: Number, required: false },
      shots: { type: Number, required: false },
    },
    playoffs: {
      avgToi: { type: String, required: false },
      assists: { type: Number, required: false },
      goals: { type: Number, required: false },
      otGoals: { type: Number, required: false },
      points: { type: Number, required: false },
      gamesPlayed: { type: Number, required: false },
      plusMinus: { type: Number, required: false },
      powerPlayGoals: { type: Number, required: false },
      powerPlayPoints: { type: Number, required: false },
      shortHandedGoals: { type: Number, required: false },
      shortHandedPoints: { type: Number, required: false },
      shots: { type: Number, required: false },
    },
  },
});

const Joueur = mongoose.model("Joueur", joueurSchema);
module.exports = Joueur;

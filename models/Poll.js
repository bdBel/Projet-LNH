// models/Poll.js
const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  matchId: { type: String, required: true },  // Unique ID for each match
  scorePrediction: { type: String, required: true },
  playerPrediction: { type: String, required: true },
  gameOutcome: { type: String, required: true },
  votes: {
    scoreVotes: { type: Number, default: 0 },
    playerVotes: { type: Number, default: 0 },
    outcomeVotes: { type: Number, default: 0 }
  }
//   voters: [{
//     userId: String,  // To track users who voted
//     scoreVote: String,
//     playerVote: String,
//     outcomeVote: String
//   }]
});

module.exports = mongoose.model('Poll', pollSchema);

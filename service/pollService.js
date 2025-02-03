const Poll = require('../models/Poll');  // Import Poll model

// Get Poll for a specific match
async function getPollByMatchId(matchId) {
  try {
    return await Poll.findOne({ matchId });
  } catch (err) {
    throw new Error('Error fetching poll data');
  }
}

// Create a new Poll for a specific match
async function createPoll(matchId, scorePrediction, playerPrediction, gameOutcome) {
  try {
    // Check if the poll already exists for this match
    const existingPoll = await Poll.findOne({ matchId });
    if (existingPoll) {
      throw new Error('Poll already exists for this match');
    }

    // Create and save new poll
    const newPoll = new Poll({
      matchId,
      scorePrediction,   // Example: "Team A 3-2 Team B"
      playerPrediction,  // Example: "PlayerName"
      gameOutcome,       // Example: "Team A wins"
      votes: { scoreVotes: 0, playerVotes: 0, outcomeVotes: 0 },
    });

    return await newPoll.save();
  } catch (err) {
    throw new Error('Error creating poll: ' + err.message);
  }
}

// Update votes for a poll
async function updatePollVotes(matchId, { scorePrediction, playerPrediction, gameOutcome }) {
  try {
    const poll = await Poll.findOne({ matchId });

    if (!poll) throw new Error('Poll not found');

    // Update the vote counts based on which prediction is provided
    if (scorePrediction) poll.votes.scoreVotes += 1;
    if (playerPrediction) poll.votes.playerVotes += 1;
    if (gameOutcome) poll.votes.outcomeVotes += 1;

    // Save and return the updated poll
    return await poll.save();
  } catch (err) {
    throw new Error('Error updating poll votes: ' + err.message);
  }
}

module.exports = { getPollByMatchId, createPoll, updatePollVotes };

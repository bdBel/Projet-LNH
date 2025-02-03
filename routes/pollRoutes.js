const express = require('express');
const router = express.Router();
const PollService = require('../service/pollService');  // Import the service
const Poll = require('../models/Poll'); // The Poll model

// GET route to display the poll for a specific match
router.get('/polls/:matchId', async (req, res) => {
  try {
    const matchId = req.params.matchId;
    const poll = await PollService.getPollByMatchId(matchId); // Use PollService to fetch poll data

    if (!poll) {
      return res.render('polls', { error: 'No poll available for this match' });
    }

    // Render the poll page with the poll data
    res.render('polls', { poll });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching poll data');
  }
});


// POST route to handle vote submission for a match


// Route to handle vote submission for a match
router.post('/:matchId/vote', async (req, res) => {
  const { matchId } = req.params;
  const { scorePrediction, playerPrediction, gameOutcome } = req.body;

  try {
    // Update the poll with the new vote
    await PollService.updatePollVotes(matchId, { scorePrediction, playerPrediction, gameOutcome });
    res.redirect(`/polls/${matchId}`); // Redirect to the poll page or a results page
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing your vote');
  }
});
// Route to display poll results (optional)
router.get('/:matchId/results', async (req, res) => {
    const { matchId } = req.params;
  
    try {
      const poll = await Poll.findOne({ matchId });
  
      if (!poll) {
        return res.render('polls', { error: 'No poll available for this match' });
      }
  
      // Render the poll results page with the poll data
      res.render('pollResults', { poll });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching poll data');
    }
  });
  

module.exports = router;



const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Poll = require('../models/Poll') 
const router = express.Router();
const userService = require('../service/userService');
const liveScoreService= require('../service/liveScoreService');

const data = require ('../service/liveScoreService');


router.get("/login", async (req,res)=>{
    res.render('../views/loginRegister.ejs');
});
router.get("/signup", async (req,res)=>{
    res.render('../views/signUp.ejs');
});


// Signup Route

router.post('/signup', async (req, res) => {
 

    const { nom, prenom, email, password } = req.body;

    try {
        const user = await userService.registerUser(nom, prenom, email, password);
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Login Route
router.post('/login', async (req, res) => {

    const { email, password } = req.body;

     if (!email || !password) {
         return res.status(400).json({ message: 'Email and password are required' });
     }

    try {
        
        const user = await userService.loginUser(email, password);

        // store firstname in session
        req.session.username = user.prenom; 
        res.redirect('/users/members');

    } catch (error) {
        console.error("Error during login:", error);
        res.status(400).json({ message: error.message });
    }
});




// Route to render the live scores page
router.get('/livescore', async (req, res) => {
    try {
        const games = await liveScoreService.getGamesLive();  // Fetch live games
        res.render('livescore', { games });  // Pass 'games' to the EJS view
    } catch (error) {
        console.error('Error fetching live scores:', error.message);
        res.status(500).send('Error fetching live scores');
    }
});

module.exports = router;

router.get('/profile', (req, res) => {
    // Example games data (you might get this from an API or database)
    const games = [
        {
            games: [
                {
                    id: 1,
                    gameState: 'Scheduled',
                    formattedStartTime: '2025-02-10 19:00',
                    awayTeam: { logo: 'away_logo.png', name: 'Team A', abbrev: 'TA', score: 0 },
                    homeTeam: { logo: 'home_logo.png', name: 'Team B', abbrev: 'TB', score: 0 },
                    today: '2025-02-10'
                }
            ]
        },
        {
            games: [
                {
                    id: 2,
                    gameState: 'Scheduled',
                    formattedStartTime: '2025-02-12 20:00',
                    awayTeam: { logo: 'away_logo.png', name: 'Team C', abbrev: 'TC', score: 0 },
                    homeTeam: { logo: 'home_logo.png', name: 'Team D', abbrev: 'TD', score: 0 },
                    today: '2025-02-12'
                }
            ]
        }
    ];

    // Pass the games data to the EJS template
    res.render('profile', { games });
});

module.exports = router;

// Route to get member's match data
router.get('/members', async (req, res) => {
    try {
        // Check if the user is logged in by checking session data
        if (!req.session.username) {
            return res.redirect('/login');  // Redirect to login page if no username in session
        }

        // Use a default gameId for testing or pass a dynamic gameId if available
        const gameId = req.query.gameId || '2024020822';  // Use default game ID if not passed in the query
        //console.log(`Fetching match data for game ID: ${gameId}`);

        // Fetch match data using the service method
        const matchData = await liveScoreService.getMatchData(gameId);
        console.log(matchData);
        // Check if the match data exists and contains scoring summary
        if (!matchData || !matchData.summary || !matchData.summary.scoring) {
            
            return res.status(500).json({ error: "Invalid match data structure." });
        }
        
        console.log('Scoring Data:', matchData.summary.scoring);

        // Pass the match data to the view along with username
        return res.render('accueilMembre', {
            username: req.session.username,
            games: matchData.summary.scoring  // Pass the scoring data as 'games'
            
        });

    } catch (error) {
        console.error('Error fetching match data:', error.message);
        return res.status(500).json({ error: "Unable to fetch match data." });
    }
});



// Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }

        res.redirect('/');  
    });
});
   
//list of users 

router.get('/userList', function(req, res, next) {
    res.send('respond with a resource');
  });

  // Route to show polls for a specific match
 // Route to show polls for a specific match

 

module.exports = router;

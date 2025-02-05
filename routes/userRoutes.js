const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); 
const router = express.Router();
const userService = require('../service/userService');
//const liveScoreService = require('../service/liveScoreService');
const { getGamesLive } = require('../service/liveScoreService');

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


// router.get('/members', (req, res) => {
//     if (req.session.username) {
        
//         // Render the 'members' page and pass the user's name for personalization
//         res.render('accueilMembre.ejs', { username: req.session.username });
                    
//     } else {
        
//         res.redirect('/users/login');
//     }
// });


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

//incorpore les games

router.get('/members', async (req, res) => {
    try {
        const liveGames = await getGamesLive();
        const username = req.session.username; // Accès à la session
        
        if (!username) {
            return res.status(401).json({ 
                error: 'Vous devez être connecté pour accéder à cette page' 
            });
        }

        res.render('accueilMembre', { 
            games: liveGames, 
            username 
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error.message);
        res.status(500).send('Erreur lors de la récupération des données.');
    }
});



module.exports = router;

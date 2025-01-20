const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); 
const router = express.Router();
const userService = require('../service/UserService');


// const { 
//     registerUser, 
//     loginUser 
//       } = require('../service/userService');

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

    // if (!email || !password) {
    //     return res.status(400).json({ message: 'Email and password are required' });
    // }

    try {
        // Using userService.loginUser to handle user login
        const user = await userService.loginUser(email, password);

        // Store the user's first name (prenom) in the session
        req.session.username = user.prenom; 

        // Redirect to members page
        res.redirect('/users/members');

    } catch (error) {
        console.error("Error during login:", error);
        res.status(400).json({ message: error.message });
    }
});

//=======================================================================

// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await loginUser(email, password);
        
//         // Set user in session or token (if using sessions or JWT)
//         req.session.username = user.prenom;  // Example, assuming you're using session
        
//         res.status(200).json({ message: 'Login successful' });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// Members Route (Dashboard or Personalized Page)
router.get('/members', (req, res) => {
    if (req.session.username) {
        
        // Render the 'members' page and pass the user's name for personalization
        res.render('accueilMembre.ejs', { username: req.session.username });
                    
    } else {
        // If not logged in, redirect to the login page
        res.redirect('/users/login');
    }
});


// Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }

        res.redirect('/');  // Redirect to accueil page after logging out
    });
});
  

/* GET users listing. */
router.get('/userList', function(req, res, next) {
    res.send('respond with a resource');
  });

module.exports = router;

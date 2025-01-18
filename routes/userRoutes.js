const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Assuming you have a User model
const router = express.Router();


router.get("/login", async (req,res)=>{
    res.render('../views/loginRegister.ejs');
});
router.get("/signup", async (req,res)=>{
    res.render('../views/signUp.ejs');
});


// Signup Route


router.post('/signup', async (req, res) => {
    const { nom, prenom, email, password } = req.body;

    // Check if all fields are provided
    if (!nom || !prenom || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('User already exists:', userExists); // Debugging user exists
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user without manually hashing the password (middleware will handle it)
        const newUser = new User({
            nom,
            prenom,
            email,
            password, // Password will be hashed in the pre('save') middleware
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the entered password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // store the users' first name for the session
        req.session.username = user.prenom; 
        res.redirect('/users/members');
        //res.status(200).json({ message: 'Login successful' });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Server error' });
    }
});


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

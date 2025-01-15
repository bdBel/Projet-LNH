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
    //console.log('Mongoose Connection State (before signup operation):', mongoose.connection.readyState); // Check connection state before operation
    
    const { nom, prenom,password, email  } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ nom, prenom, password:hashedPassword, email });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the entered password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // If login is successful, send a success message (no token in this version)
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error("Error during signup:", error);  // Log the error for better visibility
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

/* GET users listing. */
router.get('/userList', function(req, res, next) {
    res.send('respond with a resource');
  });

module.exports = router;

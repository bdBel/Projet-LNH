const mongoose = require('mongoose');
const User = require('../models/user'); // Import the User model
const connectDB = require('./db');
// Connect to MongoDB
connectDB()
    .then(() => {
        console.log("Connected to MongoDB!");

        // Now that we're connected, let's create the table (collection)
        const newUser = new User({
            nom: 'fan',
            prenom: 'Doe',
            password: '1111',
            email: 'john.doe@example.com'
        });

        newUser.save()
            .then(() => {
                console.log('User saved successfully!');
                mongoose.connection.close();  // Close the connection after saving
            })
            .catch((err) => {
                console.error('Error saving user:', err);
                mongoose.connection.close();
            });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

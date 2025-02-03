const mongoose = require('mongoose');
const Poll = require('../models/Poll'); // Import the Poll model
const connectDB = require('./db');  // Your MongoDB connection setup file

// Connect to MongoDB
connectDB()
    .then(() => {
        console.log("Connected to MongoDB!");

        // Now that we're connected, let's create a new Poll entry
        const newPoll = new Poll({
            matchId: '12345',  // Replace with actual match ID
            question: 'Votez pour le résultat?',
            options: [
                { answer: 'Team A', votes: 0 },
                { answer: 'Team B', votes: 0 },
                { answer: 'Draw', votes: 0 }
            ],
            scorePrediction: '3-1',  // Example value for score prediction
            playerPrediction: 'Player X',  // Example value for player prediction
            gameOutcome: 'Team A wins',  // Example value for game outcome
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Save the poll to the database
        newPoll.save()
            .then(() => {
                console.log('Poll saved successfully!');
                mongoose.connection.close();  // Close the connection after saving
            })
            .catch((err) => {
                console.error('Error saving poll:', err);
                mongoose.connection.close();
            });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

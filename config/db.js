const mongoose = require('mongoose');

// Fonction pour se connecter à MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://Gabriel:jqhR0COFgKdPrMTH@cluster0.9cpa4.mongodb.net/', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connecter à la base de donner');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1); // Sortir du programme si la connexion échoue
    }
};
// Exporter la fonction si besoin d'utiliser ailleurs
module.exports = connectDB;



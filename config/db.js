//mongodb+srv://Gabriel:jqhR0COFgKdPrMTH@cluster0.9cpa4.mongodb.net/
// Chaîne de connexion à la base de données
/* const mongoString = "mongodb+srv://Gabriel:jqhR0COFgKdPrMTH@cluster0.9cpa4.mongodb.net/";
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error);
});

database.once('connected', () => {
    console.log('Database Connected');
});
*/


const mongoose = require('mongoose');

// Fonction pour se connecter à MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://Gabriel:jqhR0COFgKdPrMTH@cluster0.9cpa4.mongodb.net/test', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database Connected');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1); // Sortir du programme si la connexion échoue
    }
};

// Appeler la fonction de connexion
connectDB();

// Exporter la fonction si besoin d'utiliser ailleurs
module.exports = connectDB;

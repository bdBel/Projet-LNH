const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); 
const Equipe = require('../models/Equipe'); 
const router = express.Router();
const userService = require('../service/userService');
const multer = require('multer');


// affichage de la page de connexion
router.get("/login", async (req, res) => {
    res.render('../views/loginRegister.ejs', { currentPage: 'login', error: null });
    //res.render('../views/loginRegister.ejs', { error: null });
});

// affichage de la page dinscription
router.get("/signup", async (req, res) => {
    res.render('../views/signUp.ejs');
});

// inscription nouvel utilisateur
router.post('/signup', async (req, res) => {
    const { nom, prenom, email, password } = req.body;

    try {
        const user = await userService.registerUser(nom, prenom, email, password);
        res.status(201).json({ message: 'utilisateur inscrit avec succes', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// connexion utilisateur
router.post('/login', async (req, res) => {

    
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('loginRegister.ejs', { error: "email et mot de passe requis" });
    }

    try {
        //données de session
        const user = await userService.loginUser(email, password);
        if(!user){

            return res.render('loginRegister.ejs', { error: "identifiants incorrects reessayez" });
        }
        req.session.username = user.prenom || "utilisateur";
        req.session.userImage = user.image ? `/images/${user.image}` : '/images/puck.jpg'; 
        res.redirect('/users/members');
    } catch (error) {
        console.error("erreur de connexion", error);
        res.render('loginRegister.ejs', { error: "identifiants incorrects reessayez" });
    }
});

// affichage de la page membre avec equipes
router.get('/members', async (req, res) => {
    if (!req.session.username) {
        return res.redirect('/users/login');
    }

    try {
        // Recuperation des equipes depuis mongodb
        const equipes = await Equipe.find({}, 'full_name logo');

        if (!equipes || equipes.length === 0) {
            console.log("Aucune equipe trouvee dans la base de donnees");
        } else {
            console.log(`${equipes.length} equipes chargees`);
        }

        // Envoi des equipes, de l'image et du username à la vue
        const userImage = req.session.userImage || '/images/puck.jpg';
        res.render('accueilMembre.ejs', { 
            username: req.session.username, 
            equipes,
            userImage,
            currentPage: 'members' // Add the currentPage here
        });

    } catch (err) {
        console.error("Erreur lors du chargement des equipes", err);
        res.status(500).send("Erreur interne du serveur");
    }
});

// Route poud ajouter la photo personnalié


// multer storage configu(image uploads)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/');  // repertoire de stockage des images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);  // renommer le fichier POUR EVITER LES DOUBLONS
    }
});

// Initialiser multer with the storage configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);  // File type validation
        }
        cb(null, true);
    }
}).single('photo'); //le name dans le form

// route pour charger la photo
router.post('/uploadPhoto', upload, (req, res) => {

    if (!req.file) {
        return res.status(400).json({ success: false, message: 'pas de fichier téléchargé' });
    }
    //STOCKER L'IMAGE DANS LA SESSION
    
    req.session.userImage = req.file.filename; // 
    //mise a jour de l'image locale
    res.locals.userImage = `/images/${req.file.filename}`;
    
    res.json({ success: true, filename: req.file.filename });
});
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        res.redirect('/'); 
    });
});


// liste des utilisateurs
router.get('/userList', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;

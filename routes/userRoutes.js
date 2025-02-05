const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); 
const Equipe = require('../models/Equipe'); 
const router = express.Router();
const userService = require('../service/userService');

// affichage de la page de connexion
router.get("/login", async (req, res) => {
    res.render('../views/loginRegister.ejs', { error: null });
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
        const user = await userService.loginUser(email, password);
        req.session.username = user.prenom;
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
        // recuperation des equipes depuis mongodb
        const equipes = await Equipe.find({}, 'full_name logo');

        if (!equipes || equipes.length === 0) {
            console.log("aucune equipe trouvee dans la base de donnees");
        } else {
            console.log(`${equipes.length} equipes chargees`);
        }

        // envoi des equipes et du username a la vue
        res.render('accueilMembre.ejs', { 
            username: req.session.username, 
            equipes 
        });

    } catch (err) {
        console.error("erreur lors du chargement des equipes", err);
        res.status(500).send("erreur interne du serveur");
    }
});

// deconnexion utilisateur
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }
        res.redirect('/');  
    });
});

// liste des utilisateurs
router.get('/userList', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;

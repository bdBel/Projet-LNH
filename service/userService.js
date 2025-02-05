const bcrypt = require('bcryptjs');
const User = require('../models/User');

const registerUser = async (nom, prenom, email, password) => {
    try {
        if (!nom || !prenom || !email || !password) {
            throw new Error('Tous les champs sont requis');
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            throw new Error('L\'utilisateur existe déjà');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            nom, 
            prenom,
            email, 
            password: hashedPassword,
        });

        await newUser.save();
        return newUser;
    } catch (err) {
        throw new Error('Erreur lors de l\'inscription : ' + err.message);
    }
};

const loginUser = async (email, password) => {
    try {
        if (!email || !password) {
            throw new Error('L\'email et le mot de passe sont requis');
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Identifiants invalides');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Identifiants invalides');
        }

        return user;
    } catch (err) {
        throw new Error('Erreur lors de la connexion : ' + err.message);
    }
};

module.exports = {
    registerUser,
    loginUser,
};

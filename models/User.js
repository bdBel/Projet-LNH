const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({

    nom:{
        type:String,
        required:true,
    }
    ,
    prenom:{
        type:String,
        required:true,
    },

    password: {
        type: String,
        required: true,
    },

    Email:{
        type:String,
    },
    
});
// // Hashage du mot de passe

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();  //si pas modif du mot de passe
    }
    try {
        const salt = await bcrypt.genSalt(10);  
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('User', userSchema);

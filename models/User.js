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

    password: { type: String, required: true, maxlength: 60 },

    email:{
        type:String, required:true, unique:true
    },
    
});
// // Hashage du mot de passe

// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) {
//         return next();  //si pas modif du mot de passe
//     }
//     try {
//         console.log("Original Password:", this.password); 
//         const salt = await bcrypt.genSalt(10);  
//         this.password = await bcrypt.hash(this.password, salt);
//         console.log("Hashed Password:", this.password); // Log the hashed password
//         next();
//     } catch (err) {
//         console.error("Error hashing password : ", error);
//         next(err);
//     }
// });
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next(); // If password is not modified
    }
    try {
        console.log("Original Password:", this.password); 
        const salt = await bcrypt.genSalt(10);  
        this.password = await bcrypt.hash(this.password, salt);
        
        // Log the length of the hashed password
        console.log("Hashed Password Length:", this.password.length); 
        
        console.log("Hashed Password:", this.password); // Log the full hashed password
        next();
    } catch (err) {
        console.error("Error hashing password:", err);
        next(err);
    }
});

module.exports = mongoose.model('User', userSchema);

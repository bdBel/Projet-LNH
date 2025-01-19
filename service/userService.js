const bcrypt =  require('bcryptjs');
const User = require('../models/User');

const registerUser = async (nom, prenom, email, password) => {

    if (!nom || !prenom || !email || !password) {
        throw new Error('All fields are required');
    }
    const userExists = await User.findOne({ email });
    if(userExists){
        
        throw new Error('User already exists');
        
    }

   // Create a new user
   //const hashedPassword = await bcrypt.hash(password, 10);
   
        const newUser = new User({
            nom, 
            prenom,
            email, 
            password,

        });

        await newUser.save();
        return newUser;
    };

    // Login user
const loginUser = async (email, password) => {
    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    // Compare the entered password with the stored password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    return user;
};

module.exports = {
    registerUser,
    loginUser,
};
   
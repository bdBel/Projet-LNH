const mongoose = require('mongoose');

const joueurSchema = new mongoose.Schema({
    _id: String,  
    name: { type: String, required: true },
    position: { type: String, required: true },  // Ex: "Attaquant", "Défenseur", "Gardien"
    age: { type: Number, required: true },
    nationality: { type: String, required: true },

  });
  
  const Joueur = mongoose.model('Joueur', joueurSchema);
  module.exports = Joueur;
  
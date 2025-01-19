const mongoose = require('mongoose');

const joueurSchema = new mongoose.Schema({
  _id: Number,
  headshot: { type: String, required: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  position: { type: String, required: true },
  team: { type: String, required: true },
  sweaterNumber: { type: Number, required: true },
  birthDate: { type: Date, required: true },
  nationality: { type: String, required: true },
  heightInInches: { type: Number, required: true },
  weightInPounds: { type: Number, required: true },
});

const Joueur = mongoose.model('Joueur', joueurSchema);
module.exports = Joueur;

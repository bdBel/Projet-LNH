const mongoose = require('mongoose');

const equipeSchema = new mongoose.Schema({
  _id: String, // ID unique fourni par une API ou similaire
  teamsABV: { type: String, required: true }, // Abbréviation de l'équipe
  name: { type: String, required: true }, // Nom de l'équipe
  full_name: { type: String, required: true }, // Nom complet de l'équipe
  logo: { type: String, required: true }, // URL du logo
  city: { type: String, required: true }, // Ville de l'équipe
  conference: { type: String, enum: ['Eastern', 'Western'], required: true }, // Conférencen de l'équipe (Est ou Ouest)
  division: { type: String, required: true }, // Division de l'équipe (ex: Atlantic, Central, etc.)
  founded: { type: Number, required: true }, // Année de fondation
  championships: { type: Number, default: 0 }, // Nombre de championnats
});

const Equipe = mongoose.model('Equipe', equipeSchema);
module.exports = Equipe;

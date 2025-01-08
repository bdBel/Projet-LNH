const mongoose = require('mongoose');

const equipeSchema = new mongoose.Schema({
  _id: String, // ID unique fourni par une API ou similaire
  teamsABV: { type: String, required: true }, // Abbréviation de l'équipe
  name: { type: String, required: true }, // Nom de l'équipe
  logo: { type: String, required: true }, // URL du logo
  city: { type: String, required: true }, // Ville de l'équipe
  conference: { type: String, enum: ['Eastern', 'Western'], required: true }, // Conférencen de l'équipe (Est ou Ouest)
  division: { type: String, required: true }, // Division de l'équipe (ex: Atlantic, Central, etc.)
  founded: { type: Number, required: true }, // Année de fondation
  championships: { type: Number, default: 0 }, // Nombre de championnats
  statistiqueEquipe: { //Récuprère les statistiques de l'équipe du model StatistiquesEquipe
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'StatistiquesEquipe', // Référence au modèle des statistiques d'équipe
    required: true 
  }

});

const Equipe = mongoose.model('Equipe', equipeSchema);
module.exports = Equipe;

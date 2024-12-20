const mongoose = require('mongoose');

const equipeSchema = new mongoose.Schema({
  _id: String,  // ID unique de l'équipe
  name: { type: String, required: true },
  logo: { type: String, required: true },
  city: { type: String, required: true },
  conference: { type: String, enum: ['Eastern', 'Western'], required: true },
  division: { type: String, required: true },
  founded: { type: Number, required: true },
  championships: { type: Number, default: 0 },
  statistiqueEquipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipe', required: true }
});

const Equipe = mongoose.model('Equipe', equipeSchema);
module.exports = Equipe;

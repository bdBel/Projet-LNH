// models/Video.js
const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  channelID : { type: String, required: true },
  videoId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  url: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Video = mongoose.model('Video', videoSchema);
module.exports = Video;
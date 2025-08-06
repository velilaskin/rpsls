const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  gloryPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Player', playerSchema); 
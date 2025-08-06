const mongoose = require('mongoose');

const lobbySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  status: {
    type: String,
    enum: ['waiting', 'ready', 'playing'],
    default: 'waiting'
  },
  currentGame: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lobby', lobbySchema); 
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  choices: {
    type: Map,
    of: {
      type: String,
      enum: ['rock', 'paper', 'scissors', 'lizard', 'spock']
    },
    default: {}
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Game', gameSchema); 
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || "https://your-netlify-app.netlify.app", "https://netlify.app"]
    : "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true
};

const io = socketIo(server, {
  cors: corsOptions
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection - using Netlify environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rpsls';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Import models
const Player = require('./models/Player');
const Game = require('./models/Game');
const Lobby = require('./models/Lobby');

// Game state management
const lobbies = new Map();
const players = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Player joins with name
  socket.on('join', async (playerName) => {
    try {
      let player = await Player.findOne({ name: playerName });
      if (!player) {
        player = new Player({ name: playerName, gloryPoints: 0 });
        await player.save();
      }
      
      players.set(socket.id, player);
      socket.emit('joined', { player, lobbies: Array.from(lobbies.values()) });
    } catch (error) {
      socket.emit('error', { message: 'Failed to join' });
    }
  });

  // Player joins lobby
  socket.on('joinLobby', async (lobbyId) => {
    try {
      const player = players.get(socket.id);
      if (!player) return;

      let lobby = lobbies.get(lobbyId);
      if (!lobby) {
        lobby = new Lobby({ id: lobbyId, players: [], status: 'waiting' });
        lobbies.set(lobbyId, lobby);
      }

      if (lobby.players.length < 2 && !lobby.players.find(p => p.id === player.id)) {
        lobby.players.push(player);
        socket.join(lobbyId);
        socket.emit('lobbyJoined', lobby);
        io.to(lobbyId).emit('lobbyUpdate', lobby);
        
        if (lobby.players.length === 2) {
          lobby.status = 'ready';
          io.to(lobbyId).emit('gameReady', lobby);
        }
      }
    } catch (error) {
      socket.emit('error', { message: 'Failed to join lobby' });
    }
  });

  // Start game
  socket.on('startGame', async (lobbyId) => {
    try {
      const lobby = lobbies.get(lobbyId);
      if (lobby && lobby.players.length === 2) {
        const game = new Game({
          players: lobby.players.map(p => p.id),
          status: 'active',
          choices: {},
          winner: null
        });
        await game.save();
        
        lobby.currentGame = game.id;
        lobby.status = 'playing';
        io.to(lobbyId).emit('gameStarted', { game, lobby });
      }
    } catch (error) {
      socket.emit('error', { message: 'Failed to start game' });
    }
  });

  // Player makes choice
  socket.on('makeChoice', async (data) => {
    try {
      const { lobbyId, choice } = data;
      const player = players.get(socket.id);
      const lobby = lobbies.get(lobbyId);
      
      if (!player || !lobby || !lobby.currentGame) return;

      const game = await Game.findById(lobby.currentGame);
      if (!game) return;

      game.choices[player.id] = choice;
      await game.save();

      io.to(lobbyId).emit('choiceMade', { playerId: player.id, choice });

      // Check if both players have made choices
      if (Object.keys(game.choices).length === 2) {
        const winner = determineWinner(game.choices, lobby.players);
        game.winner = winner;
        game.status = 'completed';
        await game.save();

        if (winner) {
          const winnerPlayer = await Player.findById(winner);
          winnerPlayer.gloryPoints += 10;
          await winnerPlayer.save();
        }

        lobby.status = 'waiting';
        lobby.currentGame = null;
        io.to(lobbyId).emit('gameResult', { game, winner, lobby });
      }
    } catch (error) {
      socket.emit('error', { message: 'Failed to make choice' });
    }
  });

  // Leave lobby
  socket.on('leaveLobby', (lobbyId) => {
    const player = players.get(socket.id);
    const lobby = lobbies.get(lobbyId);
    
    if (lobby && player) {
      lobby.players = lobby.players.filter(p => p.id !== player.id);
      socket.leave(lobbyId);
      
      if (lobby.players.length === 0) {
        lobbies.delete(lobbyId);
      } else {
        lobby.status = 'waiting';
        io.to(lobbyId).emit('lobbyUpdate', lobby);
      }
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    const player = players.get(socket.id);
    if (player) {
      // Remove player from all lobbies
      lobbies.forEach((lobby, lobbyId) => {
        lobby.players = lobby.players.filter(p => p.id !== player.id);
        if (lobby.players.length === 0) {
          lobbies.delete(lobbyId);
        } else {
          io.to(lobbyId).emit('lobbyUpdate', lobby);
        }
      });
      players.delete(socket.id);
    }
    console.log('User disconnected:', socket.id);
  });
});

// Game logic
function determineWinner(choices, players) {
  const choicesArray = Object.entries(choices);
  if (choicesArray.length !== 2) return null;

  const [player1Id, choice1] = choicesArray[0];
  const [player2Id, choice2] = choicesArray[1];

  const rules = {
    'rock': ['scissors', 'lizard'],
    'paper': ['rock', 'spock'],
    'scissors': ['paper', 'lizard'],
    'lizard': ['paper', 'spock'],
    'spock': ['rock', 'scissors']
  };

  if (rules[choice1].includes(choice2)) {
    return player1Id;
  } else if (rules[choice2].includes(choice1)) {
    return player2Id;
  }
  return null; // Tie
}

// API routes
app.get('/api/players', async (req, res) => {
  try {
    const players = await Player.find().sort({ gloryPoints: -1 });
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

app.get('/api/games', async (req, res) => {
  try {
    const games = await Game.find().populate('players').sort({ createdAt: -1 });
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
# RPSLS (Rock, Paper, Scissors, Lizard, Spock)

A multiplayer Rock, Paper, Scissors, Lizard, Spock game built with React frontend and Node.js/Express backend with MongoDB.

## 🎮 Game Features

- **Multiplayer Support**: Real-time gameplay with Socket.IO
- **Player Lobby System**: Wait for other players to join
- **Glory Points System**: Earn points for winning games
- **Leaderboard**: Track player rankings
- **Modern UI**: Beautiful, responsive design
- **Real-time Updates**: Live game state synchronization

## 🎯 Game Rules

- **Scissors** cuts **Paper**
- **Paper** covers **Rock**
- **Rock** crushes **Lizard**
- **Lizard** poisons **Spock**
- **Spock** smashes **Scissors**
- **Scissors** decapitates **Lizard**
- **Lizard** eats **Paper**
- **Paper** disproves **Spock**
- **Spock** vaporizes **Rock**
- **Rock** crushes **Scissors**

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/velilaskin/rpsls.git
   cd rpsls
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies (root, server, and client)
   npm run install-all
   ```

3. **Set up MongoDB**
   - Make sure MongoDB is running on your system
   - The app will automatically create the database `rpsls`

4. **Start the development servers**
   ```bash
   # Start both server and client in development mode
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend React app on `http://localhost:3000`

## 📁 Project Structure

```
rpsls/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Game.js     # Game component
│   │   │   ├── Lobby.js    # Lobby component
│   │   │   └── PlayerNameInput.js
│   │   ├── App.js          # Main app component
│   │   └── index.js        # React entry point
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # MongoDB models
│   │   ├── Player.js
│   │   ├── Game.js
│   │   └── Lobby.js
│   ├── index.js            # Express server
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

## 🎮 How to Play

1. **Enter your name** on the welcome screen
2. **Join a lobby** or wait for other players
3. **Start a game** when 2 players are in the lobby
4. **Choose your weapon** (Rock, Paper, Scissors, Lizard, or Spock)
5. **See the results** and earn glory points
6. **Return to lobby** for another game

## 🔧 Development

### Available Scripts

- `npm run dev` - Start both server and client in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the React frontend
- `npm run build` - Build the React app for production
- `npm start` - Start the production server

### Environment Variables

Create a `.env` file in the `server` directory:

```env
MONGODB_URI=mongodb://localhost:27017/rpsls
PORT=5000
NODE_ENV=development
```

## 🛠️ Technologies Used

### Frontend
- React 18
- Socket.IO Client
- CSS3 with modern design
- Responsive layout

### Backend
- Node.js
- Express.js
- Socket.IO
- MongoDB with Mongoose
- CORS support

## 📊 API Endpoints

- `GET /api/players` - Get leaderboard
- `GET /api/games` - Get game history

## 🔌 Socket.IO Events

### Client to Server
- `join` - Player joins with name
- `joinLobby` - Player joins a lobby
- `startGame` - Start a new game
- `makeChoice` - Player makes a choice
- `leaveLobby` - Player leaves lobby

### Server to Client
- `joined` - Player successfully joined
- `lobbyJoined` - Player joined a lobby
- `lobbyUpdate` - Lobby state updated
- `gameReady` - Game is ready to start
- `gameStarted` - Game has started
- `gameResult` - Game result available
- `error` - Error message

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

- **GitHub**: [velilaskin](https://github.com/velilaskin)
- **Email**: velilaskin@rahoituskanava.fi

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB not running**
   - Make sure MongoDB is installed and running
   - Check if the connection string is correct

2. **Port already in use**
   - Change the port in `server/.env`
   - Kill processes using the ports

3. **Socket.IO connection issues**
   - Check if the server is running
   - Verify the client is connecting to the correct URL

### Getting Help

If you encounter any issues, please:
1. Check the console for error messages
2. Ensure all dependencies are installed
3. Verify MongoDB is running
4. Check the network connectivity 
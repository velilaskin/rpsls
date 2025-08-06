import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import PlayerNameInput from './components/PlayerNameInput';
import Lobby from './components/Lobby';
import Game from './components/Game';

const socket = io('http://localhost:5000');

function App() {
  const [player, setPlayer] = useState(null);
  const [currentLobby, setCurrentLobby] = useState(null);
  const [currentGame, setCurrentGame] = useState(null);
  const [lobbies, setLobbies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    socket.on('joined', (data) => {
      setPlayer(data.player);
      setLobbies(data.lobbies);
    });

    socket.on('lobbyJoined', (lobby) => {
      setCurrentLobby(lobby);
      setCurrentGame(null);
    });

    socket.on('lobbyUpdate', (lobby) => {
      setCurrentLobby(lobby);
      setLobbies(prev => prev.map(l => l.id === lobby.id ? lobby : l));
    });

    socket.on('gameReady', (lobby) => {
      setCurrentLobby(lobby);
    });

    socket.on('gameStarted', (data) => {
      setCurrentGame(data.game);
      setCurrentLobby(data.lobby);
    });

    socket.on('gameResult', (data) => {
      setCurrentGame(data.game);
      setCurrentLobby(data.lobby);
    });

    socket.on('error', (data) => {
      setError(data.message);
    });

    return () => {
      socket.off('joined');
      socket.off('lobbyJoined');
      socket.off('lobbyUpdate');
      socket.off('gameReady');
      socket.off('gameStarted');
      socket.off('gameResult');
      socket.off('error');
    };
  }, []);

  const handlePlayerJoin = (playerName) => {
    socket.emit('join', playerName);
  };

  const handleJoinLobby = (lobbyId) => {
    socket.emit('joinLobby', lobbyId);
  };

  const handleStartGame = () => {
    if (currentLobby) {
      socket.emit('startGame', currentLobby.id);
    }
  };

  const handleMakeChoice = (choice) => {
    if (currentLobby && currentGame) {
      socket.emit('makeChoice', { lobbyId: currentLobby.id, choice });
    }
  };

  const handleLeaveLobby = () => {
    if (currentLobby) {
      socket.emit('leaveLobby', currentLobby.id);
      setCurrentLobby(null);
      setCurrentGame(null);
    }
  };

  const handleBackToLobby = () => {
    setCurrentGame(null);
  };

  if (!player) {
    return <PlayerNameInput onJoin={handlePlayerJoin} error={error} />;
  }

  if (currentGame) {
    return (
      <Game
        game={currentGame}
        player={player}
        onMakeChoice={handleMakeChoice}
        onBackToLobby={handleBackToLobby}
      />
    );
  }

  return (
    <Lobby
      player={player}
      currentLobby={currentLobby}
      lobbies={lobbies}
      onJoinLobby={handleJoinLobby}
      onStartGame={handleStartGame}
      onLeaveLobby={handleLeaveLobby}
    />
  );
}

export default App; 
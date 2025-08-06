import React, { useState, useEffect } from 'react';
import './Lobby.css';

const Lobby = ({ player, currentLobby, lobbies, onJoinLobby, onStartGame, onLeaveLobby }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/players');
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLobby = (lobbyId) => {
    if (!currentLobby || currentLobby.id !== lobbyId) {
      onJoinLobby(lobbyId);
    }
  };

  const handleStartGame = () => {
    if (currentLobby && currentLobby.players.length >= 2) {
      onStartGame();
    }
  };

  return (
    <div className="lobby">
      <div className="lobby-header">
        <h1>🎮 RPSLS Lobby</h1>
        <div className="player-info">
          <span>Welcome, <strong>{player.name}</strong>!</span>
          <span>Glory Points: <strong>{player.gloryPoints}</strong></span>
        </div>
      </div>

      <div className="lobby-content">
        <div className="lobby-section">
          <h2>Current Lobby</h2>
          {currentLobby ? (
            <div className="current-lobby">
              <h3>Lobby: {currentLobby.id}</h3>
              <div className="players-list">
                <h4>Players ({currentLobby.players.length}/2):</h4>
                {currentLobby.players.map((p) => (
                  <div key={p.id} className="player-item">
                    <span className="player-name">{p.name}</span>
                    <span className="player-points">{p.gloryPoints} points</span>
                  </div>
                ))}
              </div>
              
              <div className="lobby-actions">
                {currentLobby.players.length >= 2 && currentLobby.status === 'ready' && (
                  <button onClick={handleStartGame} className="start-game-btn">
                    Start Game
                  </button>
                )}
                <button onClick={onLeaveLobby} className="leave-lobby-btn">
                  Leave Lobby
                </button>
              </div>
            </div>
          ) : (
            <div className="no-lobby">
              <p>You're not in a lobby yet.</p>
              <div className="available-lobbies">
                <h4>Available Lobbies:</h4>
                {lobbies.length > 0 ? (
                  lobbies.map((lobby) => (
                    <button
                      key={lobby.id}
                      onClick={() => handleJoinLobby(lobby.id)}
                      className="join-lobby-btn"
                      disabled={lobby.players.length >= 2}
                    >
                      Join {lobby.id} ({lobby.players.length}/2 players)
                    </button>
                  ))
                ) : (
                  <p>No lobbies available. Create one by joining any lobby ID.</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="leaderboard-section">
          <h2>🏆 Leaderboard</h2>
          {loading ? (
            <div className="loading">Loading leaderboard...</div>
          ) : (
            <div className="leaderboard">
              {leaderboard.map((player, index) => (
                <div key={player._id} className="leaderboard-item">
                  <span className="rank">#{index + 1}</span>
                  <span className="name">{player.name}</span>
                  <span className="points">{player.gloryPoints} points</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lobby; 
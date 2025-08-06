import React, { useState } from 'react';
import './PlayerNameInput.css';

const PlayerNameInput = ({ onJoin, error }) => {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      onJoin(playerName.trim());
    }
  };

  return (
    <div className="player-name-input">
      <div className="container">
        <h1>🎮 RPSLS Game</h1>
        <h2>Rock, Paper, Scissors, Lizard, Spock</h2>
        
        <form onSubmit={handleSubmit} className="name-form">
          <div className="input-group">
            <label htmlFor="playerName">Enter your name:</label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name..."
              required
              minLength="2"
              maxLength="20"
            />
          </div>
          
          {error && <div className="error">{error}</div>}
          
          <button type="submit" disabled={!playerName.trim()}>
            Join Game
          </button>
        </form>

        <div className="game-rules">
          <h3>Game Rules:</h3>
          <ul>
            <li><strong>Scissors</strong> cuts <strong>Paper</strong></li>
            <li><strong>Paper</strong> covers <strong>Rock</strong></li>
            <li><strong>Rock</strong> crushes <strong>Lizard</strong></li>
            <li><strong>Lizard</strong> poisons <strong>Spock</strong></li>
            <li><strong>Spock</strong> smashes <strong>Scissors</strong></li>
            <li><strong>Scissors</strong> decapitates <strong>Lizard</strong></li>
            <li><strong>Lizard</strong> eats <strong>Paper</strong></li>
            <li><strong>Paper</strong> disproves <strong>Spock</strong></li>
            <li><strong>Spock</strong> vaporizes <strong>Rock</strong></li>
            <li><strong>Rock</strong> crushes <strong>Scissors</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlayerNameInput; 
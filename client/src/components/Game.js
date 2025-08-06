import React, { useState, useEffect } from 'react';
import './Game.css';

const Game = ({ game, player, onMakeChoice, onBackToLobby }) => {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [choices, setChoices] = useState({});

  const choicesList = ['rock', 'paper', 'scissors', 'lizard', 'spock'];

  useEffect(() => {
    if (game.choices) {
      setChoices(game.choices);
    }
  }, [game.choices]);

  useEffect(() => {
    if (game.status === 'completed' && game.winner) {
      setGameResult(game.winner === player.id ? 'win' : 'lose');
    } else if (game.status === 'completed' && !game.winner) {
      setGameResult('tie');
    }
  }, [game, player.id]);

  const handleChoice = (choice) => {
    if (!selectedChoice && game.status === 'active') {
      setSelectedChoice(choice);
      onMakeChoice(choice);
    }
  };

  const getChoiceEmoji = (choice) => {
    const emojis = {
      rock: '🪨',
      paper: '📄',
      scissors: '✂️',
      lizard: '🦎',
      spock: '🖖'
    };
    return emojis[choice] || choice;
  };

  const getChoiceName = (choice) => {
    return choice.charAt(0).toUpperCase() + choice.slice(1);
  };

  const renderGameResult = () => {
    if (!gameResult) return null;

    return (
      <div className="game-result">
        <h2>
          {gameResult === 'win' && '🎉 You Won! 🎉'}
          {gameResult === 'lose' && '😔 You Lost! 😔'}
          {gameResult === 'tie' && '🤝 It\'s a Tie! 🤝'}
        </h2>
        <div className="result-details">
          <div className="choices-display">
            {Object.entries(choices).map(([playerId, choice]) => (
              <div key={playerId} className="choice-display">
                <span className="choice-emoji">{getChoiceEmoji(choice)}</span>
                <span className="choice-name">{getChoiceName(choice)}</span>
              </div>
            ))}
          </div>
        </div>
        <button onClick={onBackToLobby} className="back-to-lobby-btn">
          Back to Lobby
        </button>
      </div>
    );
  };

  const renderGameInProgress = () => {
    return (
      <div className="game-in-progress">
        <h2>Choose your weapon!</h2>
        <div className="choices-grid">
          {choicesList.map((choice) => (
            <button
              key={choice}
              onClick={() => handleChoice(choice)}
              className={`choice-btn ${selectedChoice === choice ? 'selected' : ''}`}
              disabled={selectedChoice !== null}
            >
              <span className="choice-emoji">{getChoiceEmoji(choice)}</span>
              <span className="choice-name">{getChoiceName(choice)}</span>
            </button>
          ))}
        </div>
        
        {selectedChoice && (
          <div className="waiting-message">
            <p>Waiting for other player to make their choice...</p>
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="game">
      <div className="game-header">
        <h1>🎮 RPSLS Game</h1>
        <div className="game-info">
          <span>Player: <strong>{player.name}</strong></span>
          <span>Glory Points: <strong>{player.gloryPoints}</strong></span>
        </div>
      </div>

      <div className="game-content">
        {gameResult ? renderGameResult() : renderGameInProgress()}
      </div>
    </div>
  );
};

export default Game; 
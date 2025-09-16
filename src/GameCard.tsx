import React, { useState } from 'react';
import { GameCardProps, RoundScore } from './types';
import { RaceTrack } from './RaceTrack';
import './GameCard.css';

export const GameCard: React.FC<GameCardProps> = ({ game, onAddRound, onEndGame }) => {
  const [roundScores, setRoundScores] = useState<{ [playerId: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScoreChange = (playerId: string, score: string) => {
    setRoundScores(prev => ({
      ...prev,
      [playerId]: score
    }));
  };

  const submitRound = () => {
    const scores: RoundScore[] = game.players.map(player => ({
      playerId: player.id,
      score: parseInt(roundScores[player.id] || '0') || 0
    }));

    setIsSubmitting(true);
    setTimeout(() => {
      onAddRound(game.id, scores);
      setRoundScores({});
      setIsSubmitting(false);
    }, 300); // Kleine delay voor animatie effect
  };

  const canSubmitRound = game.players.some(player => 
    roundScores[player.id] && parseInt(roundScores[player.id]) > 0
  );

  return (
    <div className="game-card">
      <div className="game-header">
        <h3>{game.name}</h3>
        <div className="game-info">
          <span className="round-counter">Ronde {game.currentRound}</span>
          {game.isActive && (
            <button 
              onClick={() => onEndGame(game.id)}
              className="end-game-btn"
            >
              🏁 Spel Beëindigen
            </button>
          )}
        </div>
      </div>

      {/* Racebaan visualisatie */}
      <RaceTrack 
        players={game.players} 
        isAnimating={isSubmitting} 
        isGameCompleted={!game.isActive}
        winCondition={game.winCondition}
      />

      {/* Alleen tonen als spel actief is */}
      {game.isActive && (
        <div className="round-input-section">
          <h4>📝 Ronde {game.currentRound} Scores</h4>
          <div className="round-scores">
            {game.players.map((player) => (
              <div key={player.id} className="player-round-score">
                <div className="player-info">
                  <div 
                    className="player-color-dot"
                    style={{ backgroundColor: player.color }}
                  ></div>
                  <span className="player-name">{player.name}</span>
                  <span className="total-score">({player.score} totaal)</span>
                </div>
                <input
                  type="number"
                  value={roundScores[player.id] || ''}
                  onChange={(e) => handleScoreChange(player.id, e.target.value)}
                  placeholder="0"
                  className="round-score-input"
                  min="0"
                />
              </div>
            ))}
          </div>
          
          <button
            onClick={submitRound}
            disabled={!canSubmitRound || isSubmitting}
            className={`submit-round-btn ${isSubmitting ? 'submitting' : ''}`}
          >
            {isSubmitting ? '⏳ Verwerken...' : '✅ Ronde Voltooien'}
          </button>
        </div>
      )}

      {/* Rondegeschiedenis */}
      {game.rounds.length > 0 && (
        <div className="rounds-history">
          <h4>📊 Rondegeschiedenis</h4>
          <div className="rounds-list">
            {game.rounds.slice(-3).reverse().map((round) => (
              <div key={round.id} className="round-summary">
                <div className="round-header">
                  <span className="round-number">Ronde {round.roundNumber}</span>
                  <span className="round-time">
                    {new Date(round.timestamp).toLocaleTimeString('nl-NL', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="round-scores-summary">
                  {round.scores.map((score) => {
                    const player = game.players.find(p => p.id === score.playerId);
                    return player ? (
                      <span key={score.playerId} className="player-round-result">
                        {player.name}: +{score.score}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
            {game.rounds.length > 3 && (
              <div className="more-rounds">
                ... en nog {game.rounds.length - 3} rondes
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

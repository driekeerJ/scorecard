import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Game, RoundScore } from '../types';
import { GameCard } from '../GameCard';
import './GamePage.css';

interface GamePageProps {
  games: Game[];
  onAddRound: (gameId: number, roundScores: RoundScore[]) => void;
  onEndGame: (gameId: number) => void;
  onDeleteGame: (gameId: number) => void;
}

export const GamePage: React.FC<GamePageProps> = ({ 
  games, 
  onAddRound, 
  onEndGame, 
  onDeleteGame 
}) => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const game = games.find(g => g.id === parseInt(gameId || '0'));

  if (!game) {
    return (
      <div className="game-page error-page">
        <div className="error-content">
          <h1>🤔 Spel niet gevonden</h1>
          <p>Het spel dat je zoekt bestaat niet of is verwijderd.</p>
          <button 
            onClick={() => navigate('/')}
            className="back-home-btn"
          >
            🏠 Terug naar Home
          </button>
        </div>
      </div>
    );
  }

  const handleDeleteGame = () => {
    onDeleteGame(game.id);
    navigate('/');
  };

  const handleEndGame = () => {
    onEndGame(game.id);
  };

  return (
    <div className="game-page">
      <div className="game-header">
        <div className="header-left">
          <button 
            onClick={() => navigate('/')}
            className="back-btn"
          >
            ← Terug
          </button>
          <div className="game-title">
            <h1>🎮 {game.name}</h1>
            <div className="game-meta">
              <span className="round-info">Ronde {game.currentRound}</span>
              <span className="player-count">{game.players.length} spelers</span>
              <span className={`game-status ${game.isActive ? 'active' : 'completed'}`}>
                {game.isActive ? '🔴 Actief' : '🏁 Voltooid'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="header-actions">
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="delete-btn"
            title="Spel verwijderen"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="game-content">
        <GameCard
          game={game}
          onAddRound={onAddRound}
          onEndGame={handleEndGame}
        />
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>🗑️ Spel verwijderen?</h3>
            <p>
              Weet je zeker dat je <strong>"{game.name}"</strong> wilt verwijderen? 
              Dit kan niet ongedaan worden gemaakt.
            </p>
            <div className="modal-actions">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="cancel-btn"
              >
                Annuleren
              </button>
              <button 
                onClick={handleDeleteGame}
                className="confirm-delete-btn"
              >
                Ja, verwijderen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

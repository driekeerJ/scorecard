import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Game } from '../types';
import './HomePage.css';

interface HomePageProps {
  games: Game[];
  onDeleteGame: (gameId: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ games, onDeleteGame }) => {
  const navigate = useNavigate();

  const activeGames = games.filter(game => game.isActive);
  const completedGames = games.filter(game => !game.isActive);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTopPlayer = (game: Game) => {
    const sortedPlayers = [...game.players].sort((a, b) => b.score - a.score);
    return sortedPlayers[0];
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>🏁 Scorecard Racebaan</h1>
        <p>Houd scores bij en zie wie er wint op de renbaan!</p>
        <button 
          onClick={() => navigate('/create')}
          className="create-game-hero-btn"
        >
          🎮 Nieuw Spel Starten
        </button>
      </div>

      {games.length === 0 ? (
        <div className="empty-state">
          <div className="empty-content">
            <div className="empty-icon">🎯</div>
            <h2>Nog geen spellen</h2>
            <p>Begin je eerste spel en zie de spelers racen naar de finish!</p>
            <button 
              onClick={() => navigate('/create')}
              className="create-first-game-btn"
            >
              🚀 Eerste Spel Aanmaken
            </button>
          </div>
        </div>
      ) : (
        <div className="games-overview">
          {/* Actieve spellen */}
          {activeGames.length > 0 && (
            <section className="games-section">
              <h2>🔴 Actieve Spellen ({activeGames.length})</h2>
              <div className="games-grid">
                {activeGames.map(game => {
                  const topPlayer = getTopPlayer(game);
                  return (
                    <div key={game.id} className="game-preview active">
                      <div className="game-preview-header">
                        <h3>{game.name}</h3>
                        <span className="game-round">Ronde {game.currentRound}</span>
                      </div>
                      
                      <div className="game-preview-info">
                        <div className="leading-player">
                          <span className="label">🥇 Leidt:</span>
                          <span className="player-name">{topPlayer.name}</span>
                          <span className="player-score">{topPlayer.score}</span>
                        </div>
                        
                        <div className="game-meta">
                          <span>{game.players.length} spelers</span>
                          <span>{formatDate(game.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="game-preview-actions">
                        <button 
                          onClick={() => navigate(`/game/${game.id}`)}
                          className="continue-btn"
                        >
                          ▶️ Verder spelen
                        </button>
                        <button 
                          onClick={() => onDeleteGame(game.id)}
                          className="delete-preview-btn"
                          title="Verwijderen"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Voltooide spellen */}
          {completedGames.length > 0 && (
            <section className="games-section">
              <h2>🏆 Voltooide Spellen ({completedGames.length})</h2>
              <div className="games-grid">
                {completedGames.map(game => {
                  const winner = getTopPlayer(game);
                  return (
                    <div key={game.id} className="game-preview completed">
                      <div className="game-preview-header">
                        <h3>{game.name}</h3>
                        <span className="completion-badge">Voltooid</span>
                      </div>
                      
                      <div className="game-preview-info">
                        <div className="winner-player">
                          <span className="label">🏆 Winnaar:</span>
                          <span className="player-name">{winner.name}</span>
                          <span className="player-score">{winner.score}</span>
                        </div>
                        
                        <div className="game-meta">
                          <span>{game.rounds.length} rondes</span>
                          <span>{formatDate(game.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="game-preview-actions">
                        <button 
                          onClick={() => navigate(`/game/${game.id}`)}
                          className="view-btn"
                        >
                          👁️ Bekijken
                        </button>
                        <button 
                          onClick={() => onDeleteGame(game.id)}
                          className="delete-preview-btn"
                          title="Verwijderen"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Quick actions */}
          <div className="quick-actions">
            <button 
              onClick={() => navigate('/create')}
              className="quick-create-btn"
            >
              ➕ Nieuw Spel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

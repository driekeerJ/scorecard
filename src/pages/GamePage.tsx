import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Game, RoundScore } from '../types';
import { GameCard } from '../GameCard';

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 sm:p-12 rounded-2xl shadow-lg max-w-md mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">🤔 Spel niet gevonden</h1>
          <p className="text-gray-600 mb-6">Het spel dat je zoekt bestaat niet of is verwijderd.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 transition-colors"
            >
              ← Terug
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                🎮 {game.name}
              </h1>
              <div className="flex flex-wrap gap-2 sm:gap-4 text-sm text-gray-600 mt-1">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                  Ronde {game.currentRound}
                </span>
                <span>{game.players.length} spelers</span>
                <span className={`px-2 py-1 rounded-full font-medium ${
                  game.isActive 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {game.isActive ? '🔴 Actief' : '🏁 Voltooid'}
                </span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-50 text-red-500 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 font-medium"
            title="Spel verwijderen"
          >
            🗑️ Verwijderen
          </button>
        </div>
      </div>

      {/* Game Content */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <GameCard
          game={game}
          onAddRound={onAddRound}
          onEndGame={handleEndGame}
        />
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">🗑️ Spel verwijderen?</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Weet je zeker dat je <strong>"{game.name}"</strong> wilt verwijderen? 
              Dit kan niet ongedaan worden gemaakt.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Annuleren
              </button>
              <button 
                onClick={handleDeleteGame}
                className="flex-1 bg-red-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-red-600 transition-colors"
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

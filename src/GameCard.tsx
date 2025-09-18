import React, { useState } from 'react';
import { GameCardProps, RoundScore } from './types';
import { RaceTrack } from './RaceTrack';

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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Game Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-xl sm:text-2xl font-bold">{game.name}</h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
              Ronde {game.currentRound}
            </span>
            {game.isActive && (
              <button 
                onClick={() => onEndGame(game.id)}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                🏁 Spel Beëindigen
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Race Track */}
      <div className="p-4 sm:p-6">
        <RaceTrack 
          players={game.players} 
          isAnimating={isSubmitting} 
          isGameCompleted={!game.isActive}
          winCondition={game.winCondition}
        />
      </div>

      {/* Round Input Section - Only show if game is active */}
      {game.isActive && (
        <div className="p-4 sm:p-6 border-t border-gray-200">
          <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            📝 Ronde {game.currentRound} Scores
          </h4>
          <div className="space-y-3 mb-6">
            {game.players.map((player) => (
              <div key={player.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3 flex-1">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: player.color }}
                  ></div>
                  <span className="font-bold text-gray-800 flex-1">{player.name}</span>
                  <span className="text-sm text-gray-600">({player.score} totaal)</span>
                </div>
                <input
                  type="number"
                  value={roundScores[player.id] || ''}
                  onChange={(e) => handleScoreChange(player.id, e.target.value)}
                  placeholder="0"
                  className="w-full sm:w-24 bg-white border-2 border-gray-200 rounded-lg px-3 py-2 text-center focus:border-blue-500 focus:outline-none transition-colors"
                  min="0"
                />
              </div>
            ))}
          </div>
          
          <button
            onClick={submitRound}
            disabled={!canSubmitRound || isSubmitting}
            className={`w-full p-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              canSubmitRound && !isSubmitting
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg transform hover:-translate-y-1'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? '⏳ Verwerken...' : '✅ Ronde Voltooien'}
          </button>
        </div>
      )}

      {/* Rounds History */}
      {game.rounds.length > 0 && (
        <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
          <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            📊 Rondegeschiedenis
          </h4>
          <div className="space-y-3">
            {game.rounds.slice(-3).reverse().map((round) => (
              <div key={round.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-gray-800">Ronde {round.roundNumber}</span>
                  <span className="text-sm text-gray-600">
                    {new Date(round.timestamp).toLocaleTimeString('nl-NL', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {round.scores.map((score) => {
                    const player = game.players.find(p => p.id === score.playerId);
                    return player ? (
                      <span key={score.playerId} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-sm font-medium">
                        {player.name}: +{score.score}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
            {game.rounds.length > 3 && (
              <div className="text-center text-gray-500 text-sm">
                ... en nog {game.rounds.length - 3} rondes
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

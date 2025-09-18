import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Game } from '../types';

interface HomePageProps {
  games: Game[];
  onDeleteGame: (gameId: number) => void;
  onClearAllGames: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ games, onDeleteGame, onClearAllGames }) => {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-2 sm:p-4 md:p-5">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center p-8 sm:p-12 md:p-16 bg-white rounded-2xl md:rounded-3xl shadow-lg mb-6 md:mb-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            🏁 Scorecard Racebaan
          </h1>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl mb-6 md:mb-8">
            Houd scores bij en zie wie er wint op de renbaan!
          </p>
          <button 
            onClick={() => navigate('/create')}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            🎮 Nieuw Spel Starten
          </button>
        </div>

        {games.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center bg-white p-8 sm:p-12 rounded-2xl shadow-lg max-w-md mx-auto">
              <div className="text-5xl sm:text-6xl mb-4">🎯</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Nog geen spellen</h2>
              <p className="text-gray-600 text-base sm:text-lg mb-6 leading-relaxed">
                Begin je eerste spel en zie de spelers racen naar de finish!
              </p>
              <button 
                onClick={() => navigate('/create')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                🚀 Eerste Spel Aanmaken
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 md:space-y-10">
            {/* Actieve spellen */}
            {activeGames.length > 0 && (
              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-3">
                  🔴 Actieve Spellen ({activeGames.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {activeGames.map(game => {
                    const topPlayer = getTopPlayer(game);
                    return (
                      <div key={game.id} className="bg-white rounded-xl shadow-lg p-5 sm:p-6 border-l-4 border-green-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 pb-3 border-b-2 border-gray-100">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-0">{game.name}</h3>
                          <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold self-start sm:self-auto">
                            Ronde {game.currentRound}
                          </span>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                            <span className="font-bold text-gray-600">🥇 Leidt:</span>
                            <span className="font-bold text-gray-800 flex-1">{topPlayer.name}</span>
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg font-bold text-sm">
                              {topPlayer.score}
                            </span>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-600">
                            <span>{game.players.length} spelers</span>
                            <span>{formatDate(game.createdAt)}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => navigate(`/game/${game.id}`)}
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-bold hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300"
                          >
                            ▶️ Verder spelen
                          </button>
                          <button 
                            onClick={() => onDeleteGame(game.id)}
                            className="bg-red-50 text-red-500 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300"
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
              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-3">
                  🏆 Voltooide Spellen ({completedGames.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {completedGames.map(game => {
                    const winner = getTopPlayer(game);
                    return (
                      <div key={game.id} className="bg-white rounded-xl shadow-lg p-5 sm:p-6 border-l-4 border-yellow-400 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 pb-3 border-b-2 border-gray-100">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-0">{game.name}</h3>
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-bold self-start sm:self-auto">
                            Voltooid
                          </span>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                            <span className="font-bold text-gray-600">🏆 Winnaar:</span>
                            <span className="font-bold text-gray-800 flex-1">{winner.name}</span>
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg font-bold text-sm">
                              {winner.score}
                            </span>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-600">
                            <span>{game.rounds.length} rondes</span>
                            <span>{formatDate(game.createdAt)}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => navigate(`/game/${game.id}`)}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300"
                          >
                            👁️ Bekijken
                          </button>
                          <button 
                            onClick={() => onDeleteGame(game.id)}
                            className="bg-red-50 text-red-500 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300"
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
            <div className="fixed bottom-5 sm:bottom-8 right-5 sm:right-8 z-50 flex flex-col gap-3">
              <button 
                onClick={() => navigate('/create')}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 sm:px-5 py-3 sm:py-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 font-bold"
              >
                ➕ Nieuw Spel
              </button>
              
              {games.length > 0 && (
                <button 
                  onClick={() => {
                    if (confirm('Weet je zeker dat je alle spellen wilt verwijderen? Dit kan niet ongedaan worden gemaakt.')) {
                      onClearAllGames();
                    }
                  }}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 font-bold text-sm"
                >
                  🗑️ Alles Wissen
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

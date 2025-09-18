import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Player } from '../types';
import { PlayerInput } from '../PlayerInput';

interface CreateGameProps {
  onCreateGame: (gameName: string, players: Player[], winCondition: 'highest' | 'lowest') => number;
  generatePlayerId: () => string;
  playerColors: string[];
}

export const CreateGame: React.FC<CreateGameProps> = ({ 
  onCreateGame, 
  generatePlayerId, 
  playerColors 
}) => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: '', score: 0, position: 0, color: playerColors[0] }
  ]);
  const [gameName, setGameName] = useState<string>('');
  const [winCondition, setWinCondition] = useState<'highest' | 'lowest'>('highest');

  const addPlayer = (): void => {
    const newPlayer: Player = {
      id: generatePlayerId(),
      name: '',
      score: 0,
      position: 0,
      color: playerColors[players.length % playerColors.length]
    };
    setPlayers([...players, newPlayer]);
  };

  const updatePlayer = (index: number, name: string): void => {
    const newPlayers = [...players];
    newPlayers[index].name = name;
    setPlayers(newPlayers);
  };

  const updatePlayerColor = (index: number, color: string): void => {
    const newPlayers = [...players];
    newPlayers[index].color = color;
    setPlayers(newPlayers);
  };

  const removePlayer = (index: number): void => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const movePlayerUp = (index: number): void => {
    if (index > 0) {
      const newPlayers = [...players];
      const temp = newPlayers[index];
      newPlayers[index] = newPlayers[index - 1];
      newPlayers[index - 1] = temp;
      // Update colors to maintain order
      newPlayers[index].color = playerColors[index % playerColors.length];
      newPlayers[index - 1].color = playerColors[(index - 1) % playerColors.length];
      setPlayers(newPlayers);
    }
  };

  const movePlayerDown = (index: number): void => {
    if (index < players.length - 1) {
      const newPlayers = [...players];
      const temp = newPlayers[index];
      newPlayers[index] = newPlayers[index + 1];
      newPlayers[index + 1] = temp;
      // Update colors to maintain order
      newPlayers[index].color = playerColors[index % playerColors.length];
      newPlayers[index + 1].color = playerColors[(index + 1) % playerColors.length];
      setPlayers(newPlayers);
    }
  };

  const handleCreateGame = (): void => {
    if (gameName && players.filter(p => p.name.trim()).length >= 2) {
      const validPlayers = players.filter(p => p.name.trim()).map((player) => ({
        ...player,
        score: 0,
        position: 0
      }));

      const gameId = onCreateGame(gameName, validPlayers, winCondition);
      navigate(`/game/${gameId}`);
    }
  };

  const canCreateGame = gameName.trim() && players.filter(p => p.name.trim()).length >= 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-2 sm:p-4 md:p-5">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-lg mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            🎮 Nieuw Spelletje Aanmaken
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Stel je spel in en voeg spelers toe om te beginnen met racen!
          </p>
        </div>

        <div className="space-y-6">
          {/* Game Name Section */}
          <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              🏷️ Spel Naam
            </h2>
            <input
              type="text"
              placeholder="Bijvoorbeeld: Yahtzee, Monopoly, etc."
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-base sm:text-lg"
            />
          </div>

          {/* Win Condition Section */}
          <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              🏆 Wie wint?
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="winCondition"
                  value="highest"
                  checked={winCondition === 'highest'}
                  onChange={(e) => setWinCondition(e.target.value as 'highest' | 'lowest')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700 font-medium">Hoogste score wint</span>
              </label>
              <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="winCondition"
                  value="lowest"
                  checked={winCondition === 'lowest'}
                  onChange={(e) => setWinCondition(e.target.value as 'highest' | 'lowest')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700 font-medium">Laagste score wint</span>
              </label>
            </div>
          </div>

          {/* Players Section */}
          <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              👥 Spelers (minimaal 2)
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Sleep de volgorde om de start volgorde te bepalen
            </p>
            
            <div className="space-y-3 mb-4">
              {players.map((player, index) => (
                <PlayerInput
                  key={player.id}
                  player={player}
                  index={index}
                  onUpdate={updatePlayer}
                  onRemove={removePlayer}
                  onMoveUp={movePlayerUp}
                  onMoveDown={movePlayerDown}
                  onColorChange={updatePlayerColor}
                  canRemove={players.length > 1}
                  canMoveUp={index > 0}
                  canMoveDown={index < players.length - 1}
                  availableColors={playerColors}
                />
              ))}
            </div>

            <button 
              onClick={addPlayer} 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-lg font-bold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              ➕ Nog een speler toevoegen
            </button>
          </div>

          {/* Actions Section */}
          <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6">
            <button 
              onClick={handleCreateGame}
              disabled={!canCreateGame}
              className={`w-full p-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                canCreateGame 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transform hover:-translate-y-1' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              🚀 Spel Starten!
            </button>
            
            {!canCreateGame && (
              <p className="text-red-500 text-sm mt-3 text-center">
                {!gameName.trim() && "⚠️ Voer een spelnaam in"}
                {gameName.trim() && players.filter(p => p.name.trim()).length < 2 && "⚠️ Voeg minimaal 2 spelers toe"}
              </p>
            )}
          </div>

          {/* Navigation */}
          <div className="text-center">
            <button 
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800 underline"
            >
              ← Terug naar overzicht
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

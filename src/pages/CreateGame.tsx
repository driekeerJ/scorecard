import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Player } from '../types';
import { PlayerInput } from '../PlayerInput';
import './CreateGame.css';

interface CreateGameProps {
  onCreateGame: (gameName: string, players: Player[]) => number;
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
      const validPlayers = players.filter(p => p.name.trim()).map((player, index) => ({
        ...player,
        score: 0,
        position: 0,
        color: playerColors[index % playerColors.length]
      }));

      const gameId = onCreateGame(gameName, validPlayers);
      navigate(`/game/${gameId}`);
    }
  };

  const canCreateGame = gameName.trim() && players.filter(p => p.name.trim()).length >= 2;

  return (
    <div className="create-game-page">
      <div className="page-header">
        <h1>🎮 Nieuw Spelletje Aanmaken</h1>
        <p>Stel je spel in en voeg spelers toe om te beginnen met racen!</p>
      </div>

      <div className="create-game-form">
        <div className="game-name-section">
          <h2>🏷️ Spel Naam</h2>
          <input
            type="text"
            placeholder="Bijvoorbeeld: Yahtzee, Monopoly, etc."
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            className="game-name-input"
          />
        </div>

        <div className="players-section">
          <h2>👥 Spelers (minimaal 2)</h2>
          <p className="players-subtitle">Sleep de volgorde om de start volgorde te bepalen</p>
          
          <div className="players-list">
            {players.map((player, index) => (
              <PlayerInput
                key={player.id}
                player={player}
                index={index}
                onUpdate={updatePlayer}
                onRemove={removePlayer}
                onMoveUp={movePlayerUp}
                onMoveDown={movePlayerDown}
                canRemove={players.length > 1}
                canMoveUp={index > 0}
                canMoveDown={index < players.length - 1}
              />
            ))}
          </div>

          <button onClick={addPlayer} className="add-player-btn">
            ➕ Nog een speler toevoegen
          </button>
        </div>

        <div className="actions-section">
          <button 
            onClick={handleCreateGame}
            disabled={!canCreateGame}
            className="create-game-btn"
          >
            🚀 Spel Starten!
          </button>
          
          {!canCreateGame && (
            <p className="validation-message">
              {!gameName.trim() && "⚠️ Voer een spelnaam in"}
              {gameName.trim() && players.filter(p => p.name.trim()).length < 2 && "⚠️ Voeg minimaal 2 spelers toe"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

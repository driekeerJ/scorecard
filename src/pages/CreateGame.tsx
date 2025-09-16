import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Player } from '../types';
import { PlayerInput } from '../PlayerInput';
import './CreateGame.css';

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

        <div className="win-condition-section">
          <h2>🏆 Wie wint?</h2>
          <div className="win-condition-options">
            <label className="win-condition-option">
              <input
                type="radio"
                name="winCondition"
                value="highest"
                checked={winCondition === 'highest'}
                onChange={(e) => setWinCondition(e.target.value as 'highest' | 'lowest')}
              />
              <span>Hoogste score wint</span>
            </label>
            <label className="win-condition-option">
              <input
                type="radio"
                name="winCondition"
                value="lowest"
                checked={winCondition === 'lowest'}
                onChange={(e) => setWinCondition(e.target.value as 'highest' | 'lowest')}
              />
              <span>Laagste score wint</span>
            </label>
          </div>
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
                onColorChange={updatePlayerColor}
                canRemove={players.length > 1}
                canMoveUp={index > 0}
                canMoveDown={index < players.length - 1}
                availableColors={playerColors}
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

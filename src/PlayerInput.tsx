import React from 'react';
import { PlayerInputProps } from './types';
import './PlayerInput.css';

export const PlayerInput: React.FC<PlayerInputProps> = ({
  player,
  index,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  canRemove,
  canMoveUp,
  canMoveDown
}) => {
  return (
    <div className="player-input">
      <div className="player-controls">
        <button
          onClick={() => onMoveUp(index)}
          disabled={!canMoveUp}
          className="move-btn move-up"
          title="Naar boven"
        >
          ↑
        </button>
        <button
          onClick={() => onMoveDown(index)}
          disabled={!canMoveDown}
          className="move-btn move-down"
          title="Naar beneden"
        >
          ↓
        </button>
      </div>
      
      <div 
        className="player-color-indicator" 
        style={{ backgroundColor: player.color }}
      ></div>
      
      <input
        type="text"
        placeholder={`Speler ${index + 1}`}
        value={player.name}
        onChange={(e) => onUpdate(index, e.target.value)}
        className="player-name-input"
      />
      
      {canRemove && (
        <button 
          onClick={() => onRemove(index)} 
          className="remove-btn"
          title="Verwijder speler"
        >
          ❌
        </button>
      )}
    </div>
  );
};

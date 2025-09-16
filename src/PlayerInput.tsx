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
  onColorChange,
  canRemove,
  canMoveUp,
  canMoveDown,
  availableColors
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
      
      <div className="player-color-section">
        <div 
          className="player-color-indicator" 
          style={{ backgroundColor: player.color }}
          title="Huidige kleur"
        ></div>
        <select
          value={player.color}
          onChange={(e) => onColorChange(index, e.target.value)}
          className="color-dropdown"
          title="Kies je kleur"
        >
          {availableColors.map((color) => {
            const getColorName = (hexColor: string) => {
              const colorNames: { [key: string]: string } = {
                '#E74C3C': 'Rood',
                '#3498DB': 'Blauw',
                '#2ECC71': 'Groen',
                '#F39C12': 'Oranje',
                '#9B59B6': 'Paars',
                '#E91E63': 'Roze',
                '#1ABC9C': 'Turquoise',
                '#F1C40F': 'Geel',
                '#34495E': 'Donkerblauw'
              };
              return colorNames[hexColor] || 'Onbekend';
            };
            
            return (
              <option 
                key={color} 
                value={color}
                style={{ backgroundColor: color, color: 'white' }}
              >
                {getColorName(color)}
              </option>
            );
          })}
        </select>
      </div>
      
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

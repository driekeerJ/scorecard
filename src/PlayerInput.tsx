import React from 'react';
import { PlayerInputProps } from './types';

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
    <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
      {/* Move controls */}
      <div className="flex gap-2 sm:flex-col">
        <button
          onClick={() => onMoveUp(index)}
          disabled={!canMoveUp}
          className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${
            canMoveUp 
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          title="Naar boven"
        >
          ↑
        </button>
        <button
          onClick={() => onMoveDown(index)}
          disabled={!canMoveDown}
          className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${
            canMoveDown 
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          title="Naar beneden"
        >
          ↓
        </button>
      </div>
      
      {/* Color section */}
      <div className="flex items-center gap-3">
        <div 
          className="w-8 h-8 rounded-full border-2 border-white shadow-md" 
          style={{ backgroundColor: player.color }}
          title="Huidige kleur"
        ></div>
        <select
          value={player.color}
          onChange={(e) => onColorChange(index, e.target.value)}
          className="bg-white border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-colors"
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
              >
                {getColorName(color)}
              </option>
            );
          })}
        </select>
      </div>
      
      {/* Name input */}
      <input
        type="text"
        placeholder={`Speler ${index + 1}`}
        value={player.name}
        onChange={(e) => onUpdate(index, e.target.value)}
        className="flex-1 bg-white border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none transition-colors"
      />
      
      {/* Remove button */}
      {canRemove && (
        <button 
          onClick={() => onRemove(index)} 
          className="w-8 h-8 bg-red-50 text-red-500 border border-red-200 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 text-sm font-bold self-start sm:self-auto"
          title="Verwijder speler"
        >
          ❌
        </button>
      )}
    </div>
  );
};

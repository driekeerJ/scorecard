import React from 'react';
import { RaceTrackProps, PlayerAvatarProps } from './types';

const PlayerRunner: React.FC<PlayerAvatarProps> = ({ player, position, isLeading }) => {
  return (
    <div className="mb-3">
      {/* Lane info */}
      <div className="flex items-center justify-between mb-2 text-sm">
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full border border-white shadow-sm"
            style={{ backgroundColor: player.color }}
          ></div>
          <span className="font-bold text-gray-800">{player.name}</span>
        </div>
        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg font-bold">
          {player.score}
        </span>
      </div>
      
      {/* Track lane */}
      <div className="relative h-12 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-lg border-2 border-gray-300 overflow-hidden">
        {/* Start line */}
        <div className="absolute left-2 top-0 bottom-0 w-1 bg-green-600 rounded"></div>
        
        {/* Finish line */}
        <div className="absolute right-2 top-0 bottom-0 w-1 bg-red-600 rounded"></div>
        
        {/* Progress markers */}
        <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-gray-400 opacity-50"></div>
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-400 opacity-50"></div>
        <div className="absolute left-3/4 top-0 bottom-0 w-0.5 bg-gray-400 opacity-50"></div>
        
        {/* Player runner */}
        <div 
          className={`absolute top-1 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-1000 ease-out transform ${
            isLeading ? 'scale-110' : ''
          }`}
          style={{ 
            left: `${Math.min(position, 92)}%`,
            backgroundColor: player.color,
            color: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}
        >
          <span>🏃</span>
          {isLeading && (
            <div className="absolute -top-3 -right-1 text-yellow-400 text-lg">👑</div>
          )}
        </div>
      </div>
    </div>
  );
};

export const RaceTrack: React.FC<RaceTrackProps> = ({ players, isAnimating, isGameCompleted, winCondition }) => {
  // Sorteer spelers op score (afhankelijk van winCondition)
  const sortedPlayers = [...players].sort((a, b) => {
    if (winCondition === 'highest') {
      return b.score - a.score;
    } else {
      // Voor 'lowest': sorteer van laag naar hoog
      // 0 is een geldige lage score, dus gebruik de werkelijke waarde
      return a.score - b.score;
    }
  });
  
  // Bereken posities op de renbaan
  const playersWithPositions = players.map((player) => {
    let progress: number;
    
    // Voor de startpositie gebruiken we een kleine waarde
    if (players.every(p => p.score === 0)) {
      // Alle spelers hebben 0 punten
      progress = 8;
    } else {
      let scoreRatio: number;
      
      if (winCondition === 'highest') {
        const maxScore = Math.max(...players.map(p => p.score), 1);
        scoreRatio = player.score / maxScore;
      } else {
        // Voor 'lowest': lager is beter, dus inverteer de ratio
        const minScore = Math.min(...players.map(p => p.score));
        const maxScore = Math.max(...players.map(p => p.score));
        
        if (minScore === maxScore) {
          // Alle spelers hebben dezelfde score
          scoreRatio = 1;
        } else {
          // Inverteer de ratio: lagere score = hogere positie
          scoreRatio = 1 - ((player.score - minScore) / (maxScore - minScore));
        }
      }
      
      if (isGameCompleted) {
        // Bij voltooid spel: winnaar gaat naar finish (90%)
        progress = 8 + (scoreRatio * 82); // 8% tot 90%
      } else {
        // Tijdens spel: max 75% voor de leider
        progress = 8 + (scoreRatio * 67); // 8% tot 75%
      }
    }
    
    return {
      ...player,
      position: Math.min(progress, 90), // Hard cap op 90%
      isLeading: sortedPlayers[0]?.id === player.id
    };
  });

  const winner = sortedPlayers[0];
  const hasWinner = winner && (players.some(p => p.score > 0) || players.every(p => p.score === 0));

  return (
    <div className={`bg-gray-50 rounded-xl p-4 sm:p-6 ${isAnimating ? 'animate-pulse' : ''} ${isGameCompleted ? 'bg-yellow-50' : ''}`}>
      {/* Race header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <h4 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
          🏁 Renbaan
        </h4>
        {hasWinner && (
          <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
            <span className="text-sm sm:text-base font-medium text-gray-700">
              {isGameCompleted ? '🏆 Winnaar: ' : (winCondition === 'highest' ? '🥇 Leidt: ' : '🥇 Laagste: ')}
              <span className="font-bold text-gray-900">{winner.name}</span>
              <span className="text-gray-600"> ({winner.score} punten)</span>
            </span>
          </div>
        )}
      </div>
      
      {/* Track lanes */}
      <div className="space-y-4">
        {playersWithPositions.map((player) => (
          <PlayerRunner
            key={player.id}
            player={player}
            position={player.position}
            isLeading={player.isLeading}
          />
        ))}
      </div>
      
      {/* Distance markers */}
      <div className="flex justify-between mt-4 text-xs text-gray-500 px-2">
        <span>START</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>FINISH</span>
      </div>
    </div>
  );
};

import React from 'react';
import { RaceTrackProps, PlayerAvatarProps } from './types';
import './RaceTrack.css';

const PlayerRunner: React.FC<PlayerAvatarProps> = ({ player, position, isLeading }) => {
  return (
    <div className="runner-lane">
      <div className="lane-info">
        <div 
          className="player-color-dot"
          style={{ backgroundColor: player.color }}
        ></div>
        <span className="player-name">{player.name}</span>
        <span className="player-score">{player.score}</span>
      </div>
      
      <div className="track-lane">
        {/* Start lijn */}
        <div className="start-line"></div>
        
        {/* Finish lijn */}
        <div className="finish-line"></div>
        
        {/* Speler avatar die beweegt */}
        <div 
          className={`player-runner ${isLeading ? 'leading' : ''}`}
          style={{ 
            left: `${Math.min(position, 95)}%`,
            backgroundColor: player.color,
            transition: 'left 1.5s ease-out, transform 0.3s ease'
          }}
        >
          <span className="runner-emoji">🏃</span>
          {isLeading && <div className="crown">👑</div>}
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
      // Voor 'lowest': sorteer van laag naar hoog, maar alleen als scores > 0
      const aScore = a.score || Infinity;
      const bScore = b.score || Infinity;
      return aScore - bScore;
    }
  });
  
  // Bereken posities op de renbaan
  const playersWithPositions = players.map((player) => {
    let progress: number;
    
    if (player.score === 0) {
      progress = 8; // Start positie (iets na de start lijn)
    } else {
      let scoreRatio: number;
      
      if (winCondition === 'highest') {
        const maxScore = Math.max(...players.map(p => p.score), 1);
        scoreRatio = player.score / maxScore;
      } else {
        // Voor 'lowest': lager is beter, dus inverteer de ratio
        const minScore = Math.min(...players.filter(p => p.score > 0).map(p => p.score));
        const maxScore = Math.max(...players.map(p => p.score), 1);
        
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
      isLeading: sortedPlayers[0]?.id === player.id && player.score > 0
    };
  });

  const winner = sortedPlayers[0];
  const hasWinner = winner && winner.score > 0;

  return (
    <div className={`race-track-container horizontal ${isAnimating ? 'animating' : ''} ${isGameCompleted ? 'game-completed' : ''}`}>
      <div className="race-header">
        <h4>🏁 Renbaan</h4>
        {hasWinner && (
          <div className="current-leader">
            <span>
              {isGameCompleted ? '🏆 Winnaar: ' : (winCondition === 'highest' ? '🥇 Leidt: ' : '🥇 Laagste: ')}
              {winner.name} ({winner.score} punten)
            </span>
          </div>
        )}
      </div>
      
      <div className="horizontal-track">
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
      <div className="distance-markers">
        <span className="marker start">START</span>
        <span className="marker quarter">25%</span>
        <span className="marker half">50%</span>
        <span className="marker three-quarter">75%</span>
        <span className="marker finish">FINISH</span>
      </div>
    </div>
  );
};

export interface Player {
  id: string;
  name: string;
  score: number;
  position: number; // Voor racebaan positie
  color: string; // Voor visualisatie
}

export interface RoundScore {
  playerId: string;
  score: number;
}

export interface Round {
  id: number;
  roundNumber: number;
  scores: RoundScore[];
  timestamp: Date;
}

export interface Game {
  id: number;
  name: string;
  players: Player[];
  rounds: Round[];
  currentRound: number;
  isActive: boolean;
  createdAt: Date;
  winCondition: 'highest' | 'lowest';
}

export interface GameState {
  games: Game[];
  currentGame: Game | null;
}

export interface PlayerInputProps {
  player: Player;
  index: number;
  onUpdate: (index: number, name: string) => void;
  onRemove: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onColorChange: (index: number, color: string) => void;
  canRemove: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  availableColors: string[];
}

export interface GameCardProps {
  game: Game;
  onAddRound: (gameId: number, roundScores: RoundScore[]) => void;
  onEndGame: (gameId: number) => void;
}

export interface RaceTrackProps {
  players: Player[];
  isAnimating: boolean;
  isGameCompleted: boolean;
  winCondition: 'highest' | 'lowest';
}

export interface PlayerAvatarProps {
  player: Player;
  position: number;
  isLeading: boolean;
}

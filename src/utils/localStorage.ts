import { Game } from '../types';

const STORAGE_KEY = 'scorecard-games';

export const saveGamesToLocalStorage = (games: Game[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  } catch (error) {
    console.warn('Could not save games to localStorage:', error);
  }
};

export const loadGamesFromLocalStorage = (): Game[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const games = JSON.parse(data);
      // Converteer timestamp strings terug naar Date objecten
      return games.map((game: any) => ({
        ...game,
        createdAt: new Date(game.createdAt),
        rounds: game.rounds.map((round: any) => ({
          ...round,
          timestamp: new Date(round.timestamp)
        }))
      }));
    }
  } catch (error) {
    console.warn('Could not load games from localStorage:', error);
  }
  return [];
};

export const clearGamesFromLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Could not clear games from localStorage:', error);
  }
};
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { Game, Player, RoundScore } from './types'
import { HomePage } from './pages/HomePage'
import { CreateGame } from './pages/CreateGame'
import { GamePage } from './pages/GamePage'

// Kleurenpalet voor spelers
const PLAYER_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
];

function App() {
  const [games, setGames] = useState<Game[]>([])

  const generatePlayerId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  const createGame = (gameName: string, players: Player[]): number => {
    const validPlayers = players.filter(p => p.name.trim()).map((player, index) => ({
      ...player,
      score: 0,
      position: 0,
      color: PLAYER_COLORS[index % PLAYER_COLORS.length]
    }));

    const newGame: Game = {
      id: Date.now(),
      name: gameName,
      players: validPlayers,
      rounds: [],
      currentRound: 1,
      isActive: true,
      createdAt: new Date()
    }
    
    setGames(prevGames => [...prevGames, newGame])
    return newGame.id;
  }

  const addRound = (gameId: number, roundScores: RoundScore[]): void => {
    setGames(prevGames => 
      prevGames.map(game => {
        if (game.id === gameId) {
          const newRound = {
            id: Date.now(),
            roundNumber: game.currentRound,
            scores: roundScores,
            timestamp: new Date()
          };

          // Update player scores
          const updatedPlayers = game.players.map(player => {
            const roundScore = roundScores.find(rs => rs.playerId === player.id);
            return {
              ...player,
              score: player.score + (roundScore?.score || 0)
            };
          });

          return {
            ...game,
            players: updatedPlayers,
            rounds: [...game.rounds, newRound],
            currentRound: game.currentRound + 1
          };
        }
        return game;
      })
    );
  }

  const endGame = (gameId: number): void => {
    setGames(prevGames =>
      prevGames.map(game =>
        game.id === gameId ? { ...game, isActive: false } : game
      )
    );
  }

  const deleteGame = (gameId: number): void => {
    setGames(prevGames => prevGames.filter(game => game.id !== gameId));
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                games={games}
                onDeleteGame={deleteGame}
              />
            } 
          />
          <Route 
            path="/create" 
            element={
              <CreateGame 
                onCreateGame={createGame}
                generatePlayerId={generatePlayerId}
                playerColors={PLAYER_COLORS}
              />
            } 
          />
          <Route 
            path="/game/:gameId" 
            element={
              <GamePage 
                games={games}
                onAddRound={addRound}
                onEndGame={endGame}
                onDeleteGame={deleteGame}
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App

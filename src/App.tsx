import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { Game, Player, RoundScore } from './types'
import { HomePage } from './pages/HomePage'
import { CreateGame } from './pages/CreateGame'
import { GamePage } from './pages/GamePage'

// Kleurenpalet voor spelers - 9 sterk contrasterende kleuren
const PLAYER_COLORS = [
  '#E74C3C', // Helder rood
  '#3498DB', // Helder blauw  
  '#2ECC71', // Helder groen
  '#F39C12', // Oranje
  '#9B59B6', // Paars
  '#E91E63', // Roze/magenta
  '#1ABC9C', // Turquoise
  '#F1C40F', // Geel
  '#34495E'  // Donkerblauw/grijs
];

function App() {
  const [games, setGames] = useState<Game[]>([])

  const generatePlayerId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  const createGame = (gameName: string, players: Player[], winCondition: 'highest' | 'lowest'): number => {
    const validPlayers = players.filter(p => p.name.trim()).map((player) => ({
      ...player,
      score: 0,
      position: 0
    }));

    const newGame: Game = {
      id: Date.now(),
      name: gameName,
      players: validPlayers,
      rounds: [],
      currentRound: 1,
      isActive: true,
      createdAt: new Date(),
      winCondition: winCondition
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

import { useState } from 'react'
import './App.css'

function App() {
  const [games, setGames] = useState([])
  const [players, setPlayers] = useState([''])
  const [gameName, setGameName] = useState('')

  const addPlayer = () => {
    setPlayers([...players, ''])
  }

  const updatePlayer = (index, name) => {
    const newPlayers = [...players]
    newPlayers[index] = name
    setPlayers(newPlayers)
  }

  const removePlayer = (index) => {
    setPlayers(players.filter((_, i) => i !== index))
  }

  const startNewGame = () => {
    if (gameName && players.filter(p => p.trim()).length >= 2) {
      const newGame = {
        id: Date.now(),
        name: gameName,
        players: players.filter(p => p.trim()),
        scores: players.filter(p => p.trim()).map(() => 0),
        rounds: []
      }
      setGames([...games, newGame])
      setGameName('')
      setPlayers([''])
    }
  }

  const updateScore = (gameIndex, playerIndex, score) => {
    const newGames = [...games]
    newGames[gameIndex].scores[playerIndex] = parseInt(score) || 0
    setGames(newGames)
  }

  return (
    <div className="app">
      <h1>🎮 Scorecard</h1>
      
      <div className="new-game-section">
        <h2>Nieuw Spelletje</h2>
        <input
          type="text"
          placeholder="Naam van het spel"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          className="game-input"
        />
        
        <div className="players-section">
          <h3>Spelers</h3>
          {players.map((player, index) => (
            <div key={index} className="player-input">
              <input
                type="text"
                placeholder={`Speler ${index + 1}`}
                value={player}
                onChange={(e) => updatePlayer(index, e.target.value)}
              />
              {players.length > 1 && (
                <button onClick={() => removePlayer(index)} className="remove-btn">
                  ❌
                </button>
              )}
            </div>
          ))}
          <button onClick={addPlayer} className="add-player-btn">
            + Speler toevoegen
          </button>
        </div>
        
        <button onClick={startNewGame} className="start-game-btn">
          Start Spelletje
        </button>
      </div>

      <div className="games-section">
        <h2>Lopende Spelletjes</h2>
        {games.length === 0 ? (
          <p>Nog geen spelletjes gestart</p>
        ) : (
          games.map((game, gameIndex) => (
            <div key={game.id} className="game-card">
              <h3>{game.name}</h3>
              <div className="scores">
                {game.players.map((player, playerIndex) => (
                  <div key={playerIndex} className="player-score">
                    <span className="player-name">{player}</span>
                    <input
                      type="number"
                      value={game.scores[playerIndex]}
                      onChange={(e) => updateScore(gameIndex, playerIndex, e.target.value)}
                      className="score-input"
                    />
                  </div>
                ))}
              </div>
              <div className="game-winner">
                Hoogste score: {Math.max(...game.scores)} punten
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App

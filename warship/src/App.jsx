import React, { useState, useEffect } from 'react';
import './App.css';

function Cell({ onClick, value }) {
  return (
    <button className={`cell ${value}`} onClick={onClick} />
  );
}

function Board() {
  const [grid, setGrid] = useState(Array(10).fill(Array(10).fill('water')));
  const [guesses, setGuesses] = useState(Array(10).fill(Array(10).fill(null)));
  const [ships, setShips] = useState([
    { length: 5, orientation: 'horizontal', coordinates: [0, 0] },
    // Add more ships as needed
  ]);
  const [gameOver, setGameOver] = useState(false);
  const [remainingShips, setRemainingShips] = useState(0);
  useEffect(() => {
    placeShips();
  }, []);

  useEffect(() => {
    setRemainingShips(ships.length);
  }, [ships]);

  const placeShips = () => {
    let newGrid = grid.slice();
    ships.forEach(ship => {
      let x = ship.coordinates[0];
      let y = ship.coordinates[1];
      for (let i = 0; i < ship.length; i++) {
        if (ship.orientation === 'horizontal') {
          newGrid[x][y + i] = 'ship';
        } else {
          newGrid[x + i][y] = 'ship';
        }
      }
    });
    setGrid(newGrid);
    setRemainingShips(ships.length); // Set remainingShips here
  };

  const handleClick = (i, j) => {
    const newGuesses = guesses.slice();
    if (grid[i][j] === 'ship' && newGuesses[i][j] !== 'hit') {
      setRemainingShips(remainingShips - 1);
      newGuesses[i][j] = 'hit';
    } else {
      newGuesses[i][j] = 'miss';
    }
    setGuesses(newGuesses);
    checkGameOver(newGuesses);
  };

  const checkGameOver = (guesses) => {
    if (guesses.flat().filter(x => x === 'hit').length === ships.reduce((acc, ship) => acc + ship.length, 0)) {
      setGameOver(true);
    }
  };

  return (
    <div className="board">
      {guesses.map((row, i) => (
        <div key={i} className="row">
          {row.map((cell, j) => (
            <Cell key={j} value={cell} onClick={() => handleClick(i, j)} />
          ))}
        </div>
      ))}
      {gameOver && <div>Game Over</div>}
      <div>Remaining Ships: {remainingShips}</div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Board />
    </div>
  );
}

export default App;
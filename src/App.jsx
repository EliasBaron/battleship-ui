import React, { useState } from "react";
import "./App.css";

function App() {
  const initialBoard = Array.from({ length: 10 }, () => Array(10).fill(null));
  const initialShips = { portaaviones: 5, crucero: 4, submarino: 3, lancha: 2 };
  const initialPlacedShips = {
    portaaviones: false,
    crucero: false,
    submarino: false,
    lancha: false,
  };

  const [board, setBoard] = useState(initialBoard);
  const [ships, setShips] = useState(initialShips);
  const [placedShips, setPlacedShips] = useState(initialPlacedShips);
  const [selectedShip, setSelectedShip] = useState(null);
  const [orientation, setOrientation] = useState("horizontal");

  const handleClick = (i, j) => {
    if (selectedShip && !placedShips[selectedShip]) {
      let newBoard = [...board];
      let canPlaceShip = true;

      for (let k = 0; k < ships[selectedShip]; k++) {
        if (orientation === "horizontal") {
          if (j + k >= 10 || newBoard[i][j + k] === "S") {
            canPlaceShip = false;
            break;
          }
        } else {
          if (i + k >= 10 || newBoard[i + k][j] === "S") {
            canPlaceShip = false;
            break;
          }
        }
      }

      if (canPlaceShip) {
        for (let k = 0; k < ships[selectedShip]; k++) {
          if (orientation === "horizontal") {
            newBoard[i][j + k] = "S";
          } else {
            newBoard[i + k][j] = "S";
          }
        }
        setBoard(newBoard);
        setPlacedShips({ ...placedShips, [selectedShip]: true });
        setSelectedShip(null);
      }
    }
  };

  const resetGame = () => {
    setBoard([...initialBoard]);
    setShips({ ...initialShips });
    setPlacedShips({ ...initialPlacedShips });
    setSelectedShip(null);
    setOrientation("horizontal");
  };

  return (
    <div className="App">
      <button onClick={resetGame}>Reset</button>
      <button
        onClick={() =>
          setOrientation(
            orientation === "horizontal" ? "vertical" : "horizontal"
          )
        }
      >
        Change orientation (Current: {orientation})
      </button>

      {Object.keys(ships).map((ship) => (
        <button
          key={ship}
          className={`ship ${selectedShip === ship ? "selected" : ""} ${
            placedShips[ship] ? "placed" : ""
          }`}
          disabled={placedShips[ship]}
          onClick={() => setSelectedShip(ship)}
        >
          {ship}
        </button>
      ))}

      {Object.values(placedShips).every((value) => value) && (
        <p>All ships have been placed!</p>
      )}

      <div className="board">
        {board.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => (
              <button
                key={j}
                className={`cell ${cell === "S" ? "ship" : ""}`}
                onClick={() => handleClick(i, j)}
              ></button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

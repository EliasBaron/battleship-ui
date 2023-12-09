import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const initialBoard = Array.from({ length: 10 }, () => Array(10).fill(null));
  const initialShipData = {
    portaaviones: { size: 5, orientation: "horizontal" },
    crucero: { size: 4, orientation: "horizontal" },
    submarino: { size: 3, orientation: "horizontal" },
    lancha: { size: 2, orientation: "horizontal" },
  };

  const [board, setBoard] = useState(initialBoard);
  const [shipData, setShipData] = useState(initialShipData);
  const [placedShips, setPlacedShips] = useState({
    portaaviones: false,
    crucero: false,
    submarino: false,
    lancha: false,
  });
  const [selectedShip, setSelectedShip] = useState(null);

  const [computerBoard, setComputerBoard] = useState(initialBoard);
  const [computerShips, setComputerShips] = useState({
    portaaviones: false,
    crucero: false,
    submarino: false,
    lancha: false,
  });

  const generateComputerBoard = () => {
    const newComputerBoard = Array.from({ length: 10 }, () => Array(10).fill(null));
    const computerShipData = {
      portaaviones: { size: 5, orientation: "horizontal" },
      crucero: { size: 4, orientation: "vertical" },
      submarino: { size: 3, orientation: "horizontal" },
      lancha: { size: 2, orientation: "vertical" },
    };

    for (const ship in computerShipData) {
      const { size, orientation } = computerShipData[ship];
      let placed = false;

      while (!placed) {
        const i = Math.floor(Math.random() * 10);
        const j = Math.floor(Math.random() * 10);

        if (canPlaceShip(newComputerBoard, i, j, size, orientation)) {
          for (let k = 0; k < size; k++) {
            if (orientation === "horizontal") {
              newComputerBoard[i][j + k] = ship;
            } else {
              newComputerBoard[i + k][j] = ship;
            }
          }
          placed = true;
        }
      }
    }

    setComputerBoard(newComputerBoard);
    setComputerShips({
      portaaviones: true,
      crucero: true,
      submarino: true,
      lancha: true,
    });
  };

  const canPlaceShip = (board, i, j, size, orientation) => {
    for (let k = 0; k < size; k++) {
      if (orientation === "horizontal") {
        if (j + k >= 10 || board[i][j + k] !== null) {
          return false;
        }
      } else {
        if (i + k >= 10 || board[i + k][j] !== null) {
          return false;
        }
      }
    }
    return true;
  };

  useEffect(() => {
    // After the player has placed all their ships, generate the computer's board
    if (Object.values(placedShips).every((value) => value)) {
      generateComputerBoard();
    }
  }, [placedShips]);

  const handleClick = (i, j) => {
    if (selectedShip && !placedShips[selectedShip]) {
      let newBoard = [...board];
      let canPlaceShip = true;
      const { size, orientation } = shipData[selectedShip];

      for (let k = 0; k < size; k++) {
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
        for (let k = 0; k < size; k++) {
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
    setShipData({ ...initialShipData });
    setPlacedShips({
      portaaviones: false,
      crucero: false,
      submarino: false,
      lancha: false,
    });
    setSelectedShip(null);
  };

  return (
    <div className="App">
      <button onClick={resetGame}>Reset</button>
      <button
        onClick={() => {
          if (selectedShip && !placedShips[selectedShip]) {
            const newOrientation =
              shipData[selectedShip].orientation === "horizontal"
                ? "vertical"
                : "horizontal";

            setShipData({
              ...shipData,
              [selectedShip]: {
                ...shipData[selectedShip],
                orientation: newOrientation,
              },
            });
          }
        }}
      >
        Change orientation (Current: {selectedShip ? shipData[selectedShip].orientation : "N/A"})
      </button>

      {Object.keys(shipData).map((ship) => (
        <button
          key={ship}
          className={`ship ${selectedShip === ship ? "selected" : ""} ${
            placedShips[ship] ? "placed" : ""
          }`}
          disabled={placedShips[ship]}
          onClick={() => setSelectedShip(ship)}
        >
          {ship} (Size: {shipData[ship].size})
        </button>
      ))}
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

      {Object.values(placedShips).every((value) => value) && (
        <>

          <p>Computer's Board:</p>

          <div className="board">
            {computerBoard.map((row, i) => (
              <div key={i} className="row">
                {row.map((cell, j) => (
                  <button
                    key={j}
                    className={`cell ${computerShips[cell] ? "ship" : ""}`}
                  ></button>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;

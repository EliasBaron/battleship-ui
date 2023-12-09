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
  const [computerHits, setComputerHits] = useState(
    Array.from({ length: 10 }, () => Array(10).fill(false))
  );
  const [computerMisses, setComputerMisses] = useState(
    Array.from({ length: 10 }, () => Array(10).fill(false))
  );
  const [computerShips, setComputerShips] = useState({
    portaaviones: false,
    crucero: false,
    submarino: false,
    lancha: false,
  });

  const generateComputerBoard = () => {
    const newComputerBoard = Array.from({ length: 10 }, () =>
      Array(10).fill(null)
    );
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

  const handleComputerClick = (i, j) => {
    if (computerBoard[i][j] !== null) {
      const newHits = [...computerHits];
      newHits[i][j] = true;
      setComputerHits(newHits);

      const ship = computerBoard[i][j];
      const remainingShips = { ...remainingComputerShips };
      remainingShips[ship] -= 1;
      setRemainingComputerShips(remainingShips);
    } else {
      const newMisses = [...computerMisses];
      newMisses[i][j] = true;
      setComputerMisses(newMisses);
    }
  };

  useEffect(() => {
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

        const remainingShips = { ...remainingPlayerShips };
        remainingShips[selectedShip] -= 1;
        setRemainingPlayerShips(remainingShips);
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
    setComputerBoard([...initialBoard]);
    setComputerHits(Array.from({ length: 10 }, () => Array(10).fill(false)));
    setComputerMisses(Array.from({ length: 10 }, () => Array(10).fill(false)));
    setComputerShips({
      portaaviones: false,
      crucero: false,
      submarino: false,
      lancha: false,
    });
    setRemainingPlayerShips({
      portaaviones: initialShipData.portaaviones.size,
      crucero: initialShipData.crucero.size,
      submarino: initialShipData.submarino.size,
      lancha: initialShipData.lancha.size,
    });
    setRemainingComputerShips({
      portaaviones: initialShipData.portaaviones.size,
      crucero: initialShipData.crucero.size,
      submarino: initialShipData.submarino.size,
      lancha: initialShipData.lancha.size,
    });
  };

  const [remainingPlayerShips, setRemainingPlayerShips] = useState({
    portaaviones: initialShipData.portaaviones.size,
    crucero: initialShipData.crucero.size,
    submarino: initialShipData.submarino.size,
    lancha: initialShipData.lancha.size,
  });

  const [remainingComputerShips, setRemainingComputerShips] = useState({
    portaaviones: initialShipData.portaaviones.size,
    crucero: initialShipData.crucero.size,
    submarino: initialShipData.submarino.size,
    lancha: initialShipData.lancha.size,
  });

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
        Change orientation (Current:{" "}
        {selectedShip ? shipData[selectedShip].orientation : "N/A"})
      </button>

      <div className="button-group">
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
      </div>

      <div className="board">
        {board.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => (
              <button
                key={j}
                className={`cell ${cell === "S" ? "ship" : ""}`}
                onClick={() => handleClick(i, j)}
                disabled={cell === "S"}
              ></button>
            ))}
          </div>
        ))}
      </div>

      {Object.values(placedShips).every((value) => value) && (
        <>
          <p>All ships have been placed!</p>

          <div className="ship-counters">
            <p>Remaining Player Ships:</p>
            <ul>
              {Object.keys(remainingPlayerShips).map((ship) => (
                <li key={ship}>
                  {ship}: {remainingPlayerShips[ship]}
                </li>
              ))}
            </ul>

            <p>Remaining Computer Ships:</p>
            <ul>
              {Object.keys(remainingComputerShips).map((ship) => (
                <li key={ship}>
                  {ship}: {remainingComputerShips[ship]}
                </li>
              ))}
            </ul>
          </div>

          <p>Computer's Board:</p>

          <div className="board">
            {computerBoard.map((row, i) => (
              <div key={i} className="row">
                {row.map((cell, j) => (
                  <button
                    key={j}
                    className={`cell ${
                      computerHits[i][j]
                        ? "hit"
                        : computerMisses[i][j]
                        ? "miss"
                        : ""
                    }`}
                    onClick={() => handleComputerClick(i, j)}
                    disabled={computerHits[i][j] || computerMisses[i][j]}
                  ></button>
                ))}
              </div>
            ))}
          </div>
        </>
      )}

      {Object.values(remainingComputerShips).every((value) => value === 0) && (
        <p>YOU WIN!</p>
      )}
    </div>
  );
}

export default App;

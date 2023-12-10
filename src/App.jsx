import React, { useState, useEffect } from "react";
import "./App.css";

const BOARD_SIZE = 10;

function App() {
  const initialBoard = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));

  const initialShipData = {
    portaaviones: { size: 5, orientation: "horizontal" },
    crucero: { size: 4, orientation: "horizontal" },
    submarino: { size: 3, orientation: "horizontal" },
    lancha: { size: 2, orientation: "horizontal" },
  };

  const [userBoard, setUserBoard] = useState(initialBoard);
  const [shipData, setShipData] = useState(initialShipData);
  const [placedShips, setPlacedShips] = useState({
    portaaviones: false,
    crucero: false,
    submarino: false,
    lancha: false,
  });
  const [selectedShip, setSelectedShip] = useState(null);

  const [computerBoard, setComputerBoard] = useState(initialBoard);
  const [userHits, setUserHits] = useState(Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(false)));
  const [userMisses, setUserMisses] = useState(Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(false)));
  
  const [computerHits, setComputerHits] = useState(Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(false)));
  const [computerMisses, setComputerMisses] = useState(Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(false)));
  const [usedCells, setUsedCells] = useState(new Set());
 
  const [computerShips, setComputerShips] = useState({
    portaaviones: false,
    crucero: false,
    submarino: false,
    lancha: false,
  });

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

  const [turn, setTurn] = useState("player");

  useEffect(() => {
    if (Object.values(placedShips).every((value) => value)) {
      generateComputerBoard();
    }
  }, [placedShips]);

  const generateComputerBoard = () => {
    const newComputerBoard = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));

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
        const i = Math.floor(Math.random() * BOARD_SIZE);
        const j = Math.floor(Math.random() * BOARD_SIZE);

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
        if (j + k >= BOARD_SIZE || board[i][j + k] !== null) {
          return false;
        }
      } else {
        if (i + k >= BOARD_SIZE || board[i + k][j] !== null) {
          return false;
        }
      }
    }
    return true;
  };

  const handleClick = (i, j) => {
    if (selectedShip && !placedShips[selectedShip]) {
      let newBoard = [...userBoard];
      let canPlaceShip = true;
      const { size, orientation } = shipData[selectedShip];

      for (let k = 0; k < size; k++) {
        if (orientation === "horizontal") {
          if (j + k >= BOARD_SIZE || newBoard[i][j + k] === "S") {
            canPlaceShip = false;
            break;
          }
        } else {
          if (i + k >= BOARD_SIZE || newBoard[i + k][j] === "S") {
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
        setUserBoard(newBoard);
        setPlacedShips({ ...placedShips, [selectedShip]: true });
        setSelectedShip(null);

        const remainingShips = { ...remainingPlayerShips };
        remainingShips[selectedShip] -= 1;
        setRemainingPlayerShips(remainingShips);
      }
    }
  };

  const handleUserClick = (i, j) => {
    if (computerBoard[i][j] !== null) {
      const newHits = [...userHits];
      newHits[i][j] = true;
      setUserHits(newHits);

      const ship = computerBoard[i][j];
      const remainingShips = { ...remainingComputerShips };
      remainingShips[ship] -= 1;
      setRemainingComputerShips(remainingShips);
    } else {
      const newMisses = [...userMisses];
      newMisses[i][j] = true;
      setUserMisses(newMisses);
      setTurn("computer");
    }
  };

  useEffect(() => {
    if (turn === "computer") {
      setTimeout(() => {
        handleComputerClick();
      }, 1000);
    }
  }, [turn, computerHits]);

  const handleComputerClick = () => {
    let i, j;
    let guessed = false;
  
    while (!guessed) {
      i = Math.floor(Math.random() * BOARD_SIZE);
      j = Math.floor(Math.random() * BOARD_SIZE);
  
      const cellKey = `${i}-${j}`;
  
      if (!usedCells.has(cellKey) && !userHits[i][j] && !userMisses[i][j]) {
        guessed = true;
        setUsedCells((prevUsedCells) => new Set(prevUsedCells).add(cellKey));
      }
    }
  
    if (userBoard[i][j] === "S") {
      const newHits = [...computerHits];
      newHits[i][j] = true;
      setComputerHits(newHits);
  
      const remainingShips = { ...remainingPlayerShips };
      const ship = userBoard[i][j];
      remainingShips[ship] -= 1;
      setRemainingPlayerShips(remainingShips);
  
      const newBoard = [...userBoard];
      newBoard[i][j] = "H";
      setUserBoard(newBoard);
    } else {
      const newMisses = [...computerMisses];
      newMisses[i][j] = true;
      setComputerMisses(newMisses);
      setTurn("player");
    }
  };

  const resetGame = () => {
    setUserBoard([...initialBoard]);
    setShipData({ ...initialShipData });
    setPlacedShips({
      portaaviones: false,
      crucero: false,
      submarino: false,
      lancha: false,
    });
    setSelectedShip(null);
    setComputerBoard([...initialBoard]);
    setUserHits(Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(false)));
    setUserMisses(Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(false)));
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
        {userBoard.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => (
              <button
                key={j}
                className={`cell ${
                  userBoard[i][j] === "S" ? "ship" : ""
                } ${
                  computerHits[i][j]
                    ? "hit"
                    : computerMisses[i][j]
                    ? "miss"
                    : ""
                }`}
                onClick={() => handleClick(i, j)}
                disabled={userBoard[i][j] === "S"}
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
                      userHits[i][j]
                        ? "hit"
                        : userMisses[i][j]
                        ? "miss"
                        : ""
                    }`}
                    onClick={() => handleUserClick(i, j)}
                    disabled={userHits[i][j] || userMisses[i][j]}
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

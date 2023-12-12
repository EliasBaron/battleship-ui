import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const BOARD_SIZE = 10;

  const initialBoard = Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(null)
  );

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
  const [userHits, setUserHits] = useState(generateEmptyBoard());
  const [userMisses, setUserMisses] = useState(generateEmptyBoard());

  const [computerHits, setComputerHits] = useState(generateEmptyBoard());
  const [computerMisses, setComputerMisses] = useState(generateEmptyBoard());
  const [availableCells, setAvailableCells] = useState(
    generateAvailableCells()
  );

  const [remainingPlayerShips, setRemainingPlayerShips] = useState(
    generateRemainingShips(initialShipData)
  );

  const [remainingComputerShips, setRemainingComputerShips] = useState(
    generateRemainingShips(initialShipData)
  );

  const [turn, setTurn] = useState("");

  const [winCount, setWinCount] = useState(0);

  useEffect(() => {
    if (Object.values(placedShips).every((value) => value)) {
      setTurn("player");
      generateComputerBoard();
    }
  }, [placedShips]);

  function generateEmptyBoard() {
    return Array.from({ length: BOARD_SIZE }, () =>
      Array(BOARD_SIZE).fill(false)
    );
  }

  function generateAvailableCells() {
    const cells = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        cells.push({ i, j });
      }
    }
    return cells;
  }

  function generateRemainingShips(shipData) {
    return Object.keys(shipData).reduce((acc, ship) => {
      acc[ship] = shipData[ship].size;
      return acc;
    }, {});
  }

  function generateComputerBoard() {
    const newComputerBoard = Array.from({ length: BOARD_SIZE }, () =>
      Array(BOARD_SIZE).fill(null)
    );

    const computerShipData = {
      portaaviones: { size: 5, orientation: "horizontal" },
      crucero: { size: 4, orientation: "vertical" },
      submarino: { size: 3, orientation: "horizontal" },
      lancha: { size: 2, orientation: "vertical" },
    };

    for (const ship in computerShipData) {
      placeComputerShip(newComputerBoard, ship, computerShipData[ship]);
    }

    setComputerBoard(newComputerBoard);
  }

  function placeComputerShip(board, ship, { size, orientation }) {
    let placed = false;

    while (!placed) {
      const i = Math.floor(Math.random() * BOARD_SIZE);
      const j = Math.floor(Math.random() * BOARD_SIZE);

      if (canPlaceShip(board, i, j, size, orientation)) {
        for (let k = 0; k < size; k++) {
          if (orientation === "horizontal") {
            board[i][j + k] = ship;
          } else {
            board[i + k][j] = ship;
          }
        }
        placed = true;
      }
    }
  }

  function canPlaceShip(board, i, j, size, orientation) {
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
  }

  function handleClick(i, j) {
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
            newBoard[i][j + k] = selectedShip;
          } else {
            newBoard[i + k][j] = selectedShip;
          }
        }
        setUserBoard(newBoard);
        setPlacedShips({ ...placedShips, [selectedShip]: true });
        setSelectedShip(null);
      }
    }
  }

  function handleUserClick(i, j) {
    if (turn !== "player") {
      return;
    }
    if (computerBoard[i][j] !== null) {
      const newHits = markHit(userHits, i, j);
      setUserHits(newHits);

      const ship = computerBoard[i][j];
      const remainingShips = decreaseRemainingShips(
        remainingComputerShips,
        ship
      );
      setRemainingComputerShips(remainingShips);
    } else {
      const newMisses = markMiss(userMisses, i, j);
      setUserMisses(newMisses);
    }
    setTurn("computer");
  }

  function handleComputerClick() {
    if (turn !== "computer" || availableCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const { i, j } = availableCells[randomIndex];

    const updatedCells = availableCells.filter(
      (cell) => cell.i !== i || cell.j !== j
    );
    setAvailableCells(updatedCells);

    if (userBoard[i][j] !== null) {
      const newHits = markHit(computerHits, i, j);
      setComputerHits(newHits);

      const ship = userBoard[i][j];

      const remainingShips = decreaseRemainingShips(remainingPlayerShips, ship);
      setRemainingPlayerShips(remainingShips);

      const newBoard = markHit([...userBoard], i, j);
      setUserBoard(newBoard);
    } else {
      const newMisses = markMiss(computerMisses, i, j);
      setComputerMisses(newMisses);
    }
    setTurn("player");
  }

  function markHit(board, i, j) {
    const newBoard = [...board];
    newBoard[i][j] = true;
    return newBoard;
  }

  function markMiss(board, i, j) {
    const newBoard = [...board];
    newBoard[i][j] = true;
    return newBoard;
  }

  function decreaseRemainingShips(remainingShips, ship) {
    const newRemainingShips = { ...remainingShips };
    if (newRemainingShips[ship] > 0) {
      newRemainingShips[ship] -= 1;
    }
    return newRemainingShips;
  }

  useEffect(() => {
    if (turn === "computer") {
      setTimeout(() => {
        handleComputerClick();
      }, 1000);
    }
  }, [turn, computerHits]);

  useEffect(() => {
    if (Object.values(remainingComputerShips).every((value) => value === 0)) {
      setWinCount(winCount + 1);
    }
  }, [remainingComputerShips]);

  function resetGame() {
    setUserBoard(initialBoard);
    setShipData(initialShipData);
    setPlacedShips({
      portaaviones: false,
      crucero: false,
      submarino: false,
      lancha: false,
    });
    setSelectedShip(null);

    setComputerBoard(initialBoard);
    setUserHits(generateEmptyBoard());
    setUserMisses(generateEmptyBoard());

    setComputerHits(generateEmptyBoard());
    setComputerMisses(generateEmptyBoard());
    setAvailableCells(generateAvailableCells());

    setRemainingPlayerShips(generateRemainingShips(initialShipData));

    setRemainingComputerShips(generateRemainingShips(initialShipData));

    setTurn("");
  }

  return (
    <div className="App">
      <h1>Battleship</h1>
      <p>Wins: {winCount}</p>
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

      <div className={`board ${turn === "player" ? "opacity" : ""}`}>
        {userBoard.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => (
              <button
                key={j}
                className={`cell ${cell ? "ship" : ""} ${
                  computerHits[i][j]
                    ? "hit"
                    : computerMisses[i][j]
                    ? "miss"
                    : ""
                }`}
                onClick={() => handleClick(i, j)}
                disabled={cell}
              ></button>
            ))}
          </div>
        ))}
      </div>

      {Object.values(placedShips).every((value) => value) && (
        <>
          {Object.values(remainingPlayerShips).every((value) => value === 0) ? (
            <p>YOU LOSE!</p>
          ) : (
            <>
              {Object.values(remainingComputerShips).every(
                (value) => value === 0
              ) ? (
                <p>YOU WIN!</p>
              ) : (
                <>
                  <p>The war started!</p>

                  <div className="ship-counters">
                    <p>Remaining Player Ships:</p>
                    <ul>
                      {Object.entries(remainingPlayerShips).map(
                        ([ship, count]) => (
                          <li key={ship} className={count === 0 ? "sunk" : ""}>
                            {ship}
                          </li>
                        )
                      )}
                    </ul>

                    <p>Remaining Computer Ships:</p>
                    <ul>
                      {Object.entries(remainingComputerShips).map(
                        ([ship, count]) => (
                          <li key={ship} className={count === 0 ? "sunk" : ""}>
                            {ship}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <p>Computer's Board:</p>

                  <div
                    className={`board ${turn === "computer" ? "opacity" : ""}`}
                  >
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
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;

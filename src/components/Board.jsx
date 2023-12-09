import React from 'react';

// Board component
function Board({ board, handleClick }) {
  return (
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
  );
}

export default Board;
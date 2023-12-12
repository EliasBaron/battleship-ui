import React from 'react';

function Board({ board, handleCellClick, isUserBoard }) {
  return (
    <div className="board">
      {board.map((row, i) => (
        <div key={i} className="row">
          {row.map((cell, j) => (
            <div
              key={j}
              className={`cell ${cell}`}
              onClick={isUserBoard ? null : () => handleCellClick(i, j)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;
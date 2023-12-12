import React from "react";

function Board({ board, hits, misses, isUserBoard, handleClick }) {
  return (
    <>
      {board.map((row, i) => (
        <div key={i} className="row">
          {row.map((cell, j) => (
            <button
              key={j}
              className={`cell ${isUserBoard && cell ? "ship" : ""} ${
                hits[i][j] ? "hit" : misses[i][j] ? "miss" : ""
              }`}
              onClick={() => handleClick(i, j)}
              disabled={hits[i][j] || misses[i][j]}
            ></button>
          ))}
        </div>
      ))}
    </>
  );
}

export default Board;
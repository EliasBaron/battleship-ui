import React from 'react';

export default function GameOver({ message, buttonText, resetGame }) {
    return (
      <>
        <p className="text">{message}</p>
        <p className="subtitle">{buttonText}</p>
        <button className="newgame-button" onClick={resetGame}>
          New Game
        </button>
      </>
    );
}
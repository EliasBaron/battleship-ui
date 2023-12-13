import React from 'react';

export default function GameOver({ message, buttonText, resetGame }) {
    return (
      <>
        <p className="text">{message}</p>
        <p className="subtitle">{buttonText}</p>
        <button className="button margin-bottom" onClick={resetGame}>
          New Game
        </button>
      </>
    );
}
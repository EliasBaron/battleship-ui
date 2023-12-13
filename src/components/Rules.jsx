import React from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

export default function Rules() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <h1 className="maintitle">RULES</h1>
      <div className="home-container">
        <div className="rules">
          <h2 className="text">Battleship Rules</h2>
          <p className="text">
            Battleship is a two-player naval warfare game where the goal is to
            sink all of the opponent's ships. Here are the basic rules:
          </p>

          <div className="rule-section">
            <p className="text">
              1. Game Setup: Players have a grid-labeled board.
            </p>
            <p className="text">
              2. Ship Placement: Each player places their ships on their board.
              The ships are carrier (5 cells), battleship (4 cells), submarine
              (3 cells), and destroyer (2 cells). Ships can be placed
              horizontally or vertically and cannot overlap.
            </p>
            <p className="text">
              3. Taking Turns: Players call out coordinates to target opponent's
              grid. (click in this case)
            </p>
            <p className="text">
              4. Hit and Miss: Targeted ships result in a hit; empty cells are
              misses.
            </p>
            <p className="text">
              5. Sinking Ships: A ship sinks when all its cells are hit.
            </p>
            <p className="text">
              6. Winning: The first to sink all opponent's ships wins.
            </p>
          </div>
        </div>
      </div>
      <div className="home-buttons">
        <button className="button margin-bottom" onClick={() => navigate("/")}>
          Home
        </button>
        <button
          className="button margin-bottom"
          onClick={() => navigate("/game")}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}

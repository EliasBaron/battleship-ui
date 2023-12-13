import React from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import battleship from "../assets/battleship.png";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <h1 className="maintitle">BATTLESHIP</h1>
      <div className="home-container">
        <div className="home">
          <h2 className="text">Welcome to Battleship!</h2>
          <p className="simpletext">
            This is a simple implementation of the classic game Battleship. The
            rules are simple: each player places their ships on their board and
            then takes turns firing at the other player's board. The first
            player to sink all of the other player's ships wins!
          </p>
          <p className="simpletext">
            If you need a refresher on the rules, click the "Rules" button
            below.
          </p>
          <p className="simpletext">
            To get started, click the "Start Game" button below. You'll be taken
            to the game screen where you can place your ships and start playing!
          </p>
        </div>
        <img src={battleship} alt="battleship" className="home-image" />
      </div>
      <div className="home-buttons">
        <button
          className="button margin-bottom"
          onClick={() => navigate("/rules")}
        >
          Rules
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

import React from "react";

export default function ShipButton({ shipKey, ship, selectedShip, placed, onClick }) {
  return (
    <button
      className={`button ${selectedShip === shipKey ? "selected" : ""} ${
        placed ? "placed" : ""
      }`}
      disabled={placed}
      onClick={() => onClick(shipKey)}
    >
      {shipKey} (Size: {ship.size})
    </button>
  );
}

import React from "react";

function ShipButton({ shipKey, ship, selectedShip, placed, onClick }) {
  return (
    <button
      className={`ship-button ${selectedShip === shipKey ? "selected" : ""} ${
        placed ? "placed" : ""
      }`}
      disabled={placed}
      onClick={() => onClick(shipKey)}
    >
      {shipKey} (Size: {ship.size})
    </button>
  );
}

export default ShipButton;

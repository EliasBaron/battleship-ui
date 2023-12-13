import React from "react";

function ShipCounters({ remainingShips, isPlayer }) {
  return (
    <div className="ship-counter">
      <p className="text">{isPlayer ? "Remaining Player Ships:" : "Remaining Computer Ships:"}</p>
      <ul>
        {Object.entries(remainingShips).map(([ship, count]) => (
          <li key={ship} className={`text ${count === 0 ? "sunk" : ""} ${!isPlayer ? "direction" : ""}`}>            {ship}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShipCounters;
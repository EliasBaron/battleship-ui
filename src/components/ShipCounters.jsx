import React from "react";

function ShipCounters({ remainingShips, isPlayer }) {
  return (
    <div className="ship-counter">
      <p>{isPlayer ? "Remaining Player Ships:" : "Remaining Computer Ships:"}</p>
      <ul>
        {Object.entries(remainingShips).map(([ship, count]) => (
          <li key={ship} className={count === 0 ? "sunk" : ""}>
            {ship}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShipCounters;
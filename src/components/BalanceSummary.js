import React from "react";

export default function BalanceSummary({ friends, balances }) {
  const row = (f) => {
    const b = balances[f.id] || 0;
    const positive = b > 0;
    return (
      <li key={f.id} className="list-group-item d-flex justify-content-between align-items-center">
        <div><strong>{f.name}</strong>{f.upi ? <span className="ms-2 badge bg-light text-dark">{f.upi}</span> : null}</div>
        <div className={positive ? "text-success" : b < 0 ? "text-danger" : ""}>
          {b > 0 ? `Gets ₹${b.toFixed(2)}` : b < 0 ? `Owes ₹${Math.abs(b).toFixed(2)}` : "Settled"}
        </div>
      </li>
    );
  };

  return (
    <div className="card p-3 mb-3">
      <h5>Balances</h5>
      <ul className="list-group">
        {friends.map(row)}
      </ul>
    </div>
  );
}

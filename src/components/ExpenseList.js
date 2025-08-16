import React from "react";

export default function ExpenseList({ friends, expenses }) {
  const name = id => friends.find(f => f.id === id)?.name || "Unknown";

  if (!expenses.length) return (
    <div className="card p-3 mb-3">
      <h5>Expenses</h5>
      <p className="text-muted mb-0">No expenses yet.</p>
    </div>
  );

  return (
    <div className="card p-3 mb-3">
      <h5>Expenses</h5>
      <ul className="list-group">
        {expenses.slice().reverse().map(e => (
          <li className="list-group-item" key={e.id}>
            <div className="d-flex justify-content-between">
              <div>
                <strong>{e.desc}</strong> — ₹{e.amount.toFixed(2)}
                <div className="small text-muted">
                  Paid by <strong>{name(e.paidBy)}</strong> · Split among{" "}
                  {e.participants.map(pid => name(pid)).join(", ")}
                </div>
              </div>
              <div className="small text-muted">
                {new Date(e.createdAt).toLocaleString()}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

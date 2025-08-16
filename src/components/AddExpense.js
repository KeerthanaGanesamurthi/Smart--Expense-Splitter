import React, { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function AddExpense({ friends, expenses, setExpenses }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [selected, setSelected] = useState({}); // { friendId: boolean }

  const allSelected = useMemo(() => friends.length && friends.every(f => selected[f.id]), [friends, selected]);

  const toggleAll = () => {
    const next = {};
    const turnOn = !allSelected;
    friends.forEach(f => next[f.id] = turnOn);
    setSelected(next);
  };

  const addExpense = () => {
    const amt = parseFloat(amount);
    if (!desc.trim() || !amt || !paidBy) return;

    const participants = friends
      .filter(f => selected[f.id])
      .map(f => f.id);

    const finalParticipants = participants.length ? participants : friends.map(f => f.id);

    setExpenses([
      ...expenses,
      {
        id: uuidv4(),
        desc: desc.trim(),
        amount: Math.round(amt * 100) / 100,
        paidBy,
        participants: finalParticipants,
        createdAt: Date.now()
      }
    ]);
    setDesc(""); setAmount(""); setPaidBy(""); setSelected({});
  };

  return (
    <div className="card p-3 mb-3">
      <h5>Add Expense</h5>
      <input
        className="form-control mb-2"
        placeholder="Description (e.g., Dinner)"
        value={desc}
        onChange={e => setDesc(e.target.value)}
      />
      <input
        type="number"
        step="0.01"
        className="form-control mb-2"
        placeholder="Amount (₹)"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <select
        className="form-select mb-2"
        value={paidBy}
        onChange={e => setPaidBy(e.target.value)}
      >
        <option value="">Paid by</option>
        {friends.map(f => <option value={f.id} key={f.id}>{f.name}</option>)}
      </select>

      <div className="mb-2">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-1">Participants</h6>
          <button className="btn btn-sm btn-outline-secondary" onClick={toggleAll}>
            {allSelected ? "Clear" : "Select all"}
          </button>
        </div>
        <div className="d-flex flex-wrap gap-2">
          {friends.map(f => (
            <label key={f.id} className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                checked={!!selected[f.id]}
                onChange={() => setSelected(s => ({ ...s, [f.id]: !s[f.id] }))}
              />
              <span className="form-check-label">{f.name}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="btn btn-success w-100" onClick={addExpense}>Add Expense</button>
    </div>
  );
}

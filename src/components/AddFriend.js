import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function AddFriend({ friends, setFriends }) {
  const [name, setName] = useState("");
  const [upi, setUpi] = useState("");

  const add = () => {
    if (!name.trim()) return;
    setFriends([...friends, { id: uuidv4(), name: name.trim(), upi: upi.trim() }]);
    setName(""); setUpi("");
  };

  const remove = (id) => {
    setFriends(friends.filter(f => f.id !== id));
  };

  return (
    <div className="card p-3 mb-3">
      <h5>Add Friend</h5>
      <input
        className="form-control mb-2"
        placeholder="Name (e.g., Keerthana)"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        className="form-control mb-2"
        placeholder="UPI ID (e.g., name@upi) — optional"
        value={upi}
        onChange={e => setUpi(e.target.value)}
      />
      <button className="btn btn-primary w-100 mb-2" onClick={add}>Add Friend</button>

      {friends.length > 0 && (
        <>
          <h6 className="mt-2">Friends</h6>
          <ul className="list-group">
            {friends.map(f => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={f.id}>
                <div>
                  <strong>{f.name}</strong>{" "}
                  {f.upi ? <span className="badge bg-secondary badge-pill">{f.upi}</span> : <span className="text-muted small">no UPI</span>}
                </div>
                <button className="btn btn-sm btn-outline-danger" onClick={() => remove(f.id)}>Remove</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

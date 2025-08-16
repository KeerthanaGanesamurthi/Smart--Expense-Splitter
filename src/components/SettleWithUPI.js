import React, { useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function SettleWithUPI({ friends, balances, onSettle }) {
  const [modal, setModal] = useState(null); // { from, to, amount, upiUrl, type }

  const nameOf = (id) => friends.find(f => f.id === id)?.name || "Unknown";
  const upiOf  = (id) => friends.find(f => f.id === id)?.upi || "";

  const settlements = useMemo(() => {
    const debtors = [];
    const creditors = [];

    for (const f of friends) {
      const b = Math.round((balances[f.id] || 0) * 100) / 100;
      if (b < -0.01) debtors.push({ id: f.id, amt: -b });
      if (b >  0.01) creditors.push({ id: f.id, amt:  b });
    }

    debtors.sort((a,b) => b.amt - a.amt);
    creditors.sort((a,b) => b.amt - a.amt);

    const res = [];
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const pay  = debtors[i];
      const recv = creditors[j];
      const amt = Math.min(pay.amt, recv.amt);

      res.push({ from: pay.id, to: recv.id, amount: Math.round(amt * 100) / 100 });

      pay.amt  = Math.round((pay.amt  - amt) * 100) / 100;
      recv.amt = Math.round((recv.amt - amt) * 100) / 100;

      if (pay.amt <= 0.01) i++;
      if (recv.amt <= 0.01) j++;
    }
    return res;
  }, [friends, balances]);

  const makeUpiUrl = ({ toId, amount, note }) => {
    const vpa = upiOf(toId);
    if (!vpa) return "";
    const pn  = encodeURIComponent(nameOf(toId));
    const pa  = encodeURIComponent(vpa);
    const am  = encodeURIComponent(amount.toFixed(2));
    const tn  = encodeURIComponent(note || "Expense Split Settlement");
    return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&tn=${tn}&cu=INR`;
  };

  const openModal = (s, type) => {
    const url = type === "upi" ? makeUpiUrl({ toId: s.to, amount: s.amount }) : "";
    setModal({
      from: nameOf(s.from),
      fromId: s.from,
      to: nameOf(s.to),
      toId: s.to,
      toUpi: upiOf(s.to),
      amount: s.amount,
      upiUrl: url,
      type
    });
  };

  const closeModal = () => setModal(null);

  const confirmCash = () => {
    if (onSettle) {
      onSettle(modal.fromId, modal.toId, modal.amount);
    }
    setModal(null);
  };

  return (
    <div className="card p-3 mb-3">
      <h5>Who Owes Whom</h5>
      {settlements.length === 0 ? (
        <p className="text-muted mb-0">Everything is settled 🎉</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>From (payer)</th>
                <th>To (receiver)</th>
                <th>Amount</th>
                <th>Settle</th>
              </tr>
            </thead>
            <tbody>
              {settlements.map((s, idx) => (
                <tr key={idx}>
                  <td>{nameOf(s.from)}</td>
                  <td>
                    {nameOf(s.to)}{" "}
                    {upiOf(s.to) ? <span className="badge bg-light text-dark">{upiOf(s.to)}</span> : <span className="text-muted small">(no UPI)</span>}
                  </td>
                  <td>₹{s.amount.toFixed(2)}</td>
                  <td className="d-flex gap-2">
                    <button className="btn btn-outline-primary btn-sm" onClick={() => openModal(s, "upi")}>
                      UPI/QR
                    </button>
                    <button className="btn btn-outline-success btn-sm" onClick={() => openModal(s, "cash")}>
                      Cash
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="modal-backdrop-custom" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h5 className="mb-2">Settle Payment</h5>
            <p className="mb-2">
              <strong>{modal.from}</strong> ➜ <strong>{modal.to}</strong><br/>
              Amount: <strong>₹{modal.amount.toFixed(2)}</strong>
            </p>

            {modal.type === "upi" ? (
              modal.toUpi ? (
                <>
                  <div className="d-flex justify-content-center my-3">
                    <QRCodeCanvas value={modal.upiUrl} size={200} />
                  </div>
                  <div className="alert alert-light">
                    <div className="small mb-1">Scan the QR with any UPI app or use the link:</div>
                    <code className="d-block text-truncate">{modal.upiUrl}</code>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigator.clipboard.writeText(modal.upiUrl)}
                    >
                      Copy UPI Link
                    </button>
                    <a className="btn btn-success" href={modal.upiUrl}>
                      Open in UPI App
                    </a>
                    <button className="btn btn-outline-secondary ms-auto" onClick={closeModal}>Close</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="alert alert-warning">
                    <strong>{modal.to}</strong> has no UPI ID saved. Please update their UPI ID.
                  </div>
                  <button className="btn btn-outline-secondary" onClick={closeModal}>Close</button>
                </>
              )
            ) : (
              <>
                <div className="alert alert-info">
                  <p>If <strong>{modal.from}</strong> paid <strong>{modal.to}</strong> in <b>cash</b>, the receiver must confirm below:</p>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-success" onClick={confirmCash}>Confirm Payment</button>
                  <button className="btn btn-outline-secondary" onClick={closeModal}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

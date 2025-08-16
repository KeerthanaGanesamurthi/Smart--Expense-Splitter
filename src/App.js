import React, { useEffect, useMemo, useState } from "react";
import AddFriend from "./components/AddFriend";
import AddExpense from "./components/AddExpense";
import ExpenseList from "./components/ExpenseList";
import BalanceSummary from "./components/BalanceSummary";
import ExpenseChart from "./components/ExpenseChart";
import SettleWithUPI from "./components/SettleWithUPI";


export default function App() {
  const [friends, setFriends] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // load from LocalStorage
  useEffect(() => {
    setFriends(JSON.parse(localStorage.getItem("friends") || "[]"));
    setExpenses(JSON.parse(localStorage.getItem("expenses") || "[]"));
  }, []);

  // save to LocalStorage
  useEffect(() => {
    localStorage.setItem("friends", JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // balances map: { [friendId]: number }
  const balances = useMemo(() => {
    const map = Object.fromEntries(friends.map(f => [f.id, 0]));
    if (friends.length === 0) return map;

    for (const e of expenses) {
      const participants = e.participants?.length ? e.participants : friends.map(f => f.id);
      const split = e.amount / participants.length;

      for (const pid of participants) {
        if (pid === e.paidBy) {
          map[pid] += e.amount - split;
        } else {
          map[pid] -= split;
        }
      }
    }
    // round small floats
    Object.keys(map).forEach(k => map[k] = Math.round(map[k] * 100) / 100);
    return map;
  }, [friends, expenses]);

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">💰 Smart Expense Splitter</h2>
      <div className="row g-3">
        <div className="col-lg-4">
          <AddFriend friends={friends} setFriends={setFriends} />
          <AddExpense friends={friends} expenses={expenses} setExpenses={setExpenses} />
        </div>

        <div className="col-lg-8">
          <BalanceSummary friends={friends} balances={balances} />
          <SettleWithUPI friends={friends} balances={balances} />
          <ExpenseList friends={friends} expenses={expenses} />
          <ExpenseChart friends={friends} expenses={expenses} />
        </div>
      </div>
      <p className="text-center text-muted mt-4">
        Built with React + Bootstrap + LocalStorage + Recharts + qrcode.react
      </p>
    </div>
  );
}

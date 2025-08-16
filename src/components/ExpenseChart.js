import React, { useMemo } from "react";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";

export default function ExpenseChart({ friends, expenses }) {
  // aggregate total paid by person (not split), to show contribution
  const totals = useMemo(() => {
    const map = Object.fromEntries(friends.map(f => [f.id, 0]));
    for (const e of expenses) map[e.paidBy] += e.amount;
    return friends
      .map(f => ({ id: f.id, name: f.name, value: Math.round(map[f.id] * 100) / 100 }))
      .filter(d => d.value > 0);
  }, [friends, expenses]);

  if (!totals.length) return (
    <div className="card p-3">
      <h5>Expense Breakdown</h5>
      <p className="text-muted mb-0">Add some expenses to see the chart.</p>
    </div>
  );

  const COLORS = ["#0d6efd","#20c997","#dc3545","#ffc107","#6f42c1","#6610f2","#198754","#fd7e14"];

  return (
    <div className="card p-3">
      <h5>Expense Breakdown (Who Paid)</h5>
      <PieChart width={360} height={260}>
        <Pie dataKey="value" data={totals} cx="50%" cy="50%" outerRadius={90} label>
          {totals.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

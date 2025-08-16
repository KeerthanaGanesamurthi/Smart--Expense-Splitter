import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ friends, balances }) {
  const data = {
    labels: friends.map(f => f.name),
    datasets: [
      {
        label: "Net Balance",
        data: friends.map(f => balances[f.id] || 0),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40"
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: function (ctx) {
            const val = ctx.raw;
            return `${ctx.label}: ₹${val.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <div className="card p-3 mb-3">
      <h5 className="mb-2">Expense Distribution</h5>
      <Pie data={data} options={options} />
    </div>
  );
}

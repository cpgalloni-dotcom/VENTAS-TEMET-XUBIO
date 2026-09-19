import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function QuadrantPieChart({ productsList }) {
  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  // Vibrant distinct colors matching pie chart template
  const pieColors = [
    '#f43f5e', // Red/Pink
    '#fb923c', // Orange
    '#94a3b8', // Gray/Silver
    '#ec4899', // Magenta
    '#06b6d4', // Cyan
    '#84cc16', // Lime
    '#a855f7', // Purple
    '#eab308'  // Yellow
  ];

  const chartData = {
    labels: productsList.map((p, idx) => {
      const code = labels[idx] || `P${idx + 1}`;
      return `${code}, ${p.percentage.toFixed(2)}%`;
    }),
    datasets: [
      {
        data: productsList.map(p => p.totalSales),
        backgroundColor: pieColors.slice(0, productsList.length),
        borderColor: '#0f172a',
        borderWidth: 2,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#cbd5e1',
          font: {
            size: 11,
            weight: '500'
          },
          boxWidth: 12,
          padding: 12
        }
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            return productsList[index]?.name;
          },
          label: (context) => {
            const index = context.dataIndex;
            const item = productsList[index];
            return `Ventas: $ ${item.totalSales.toLocaleString('es-AR')} (${item.percentage.toFixed(2)}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col h-full">
      <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-100 tracking-wide">
          Percentage of sales
        </h2>
        <span className="text-[11px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">
          Distribución %
        </span>
      </div>
      <div className="flex-1 min-h-[260px] relative flex items-center justify-center">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}

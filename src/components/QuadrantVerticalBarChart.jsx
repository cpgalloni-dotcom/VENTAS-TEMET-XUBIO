import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { formatCompactCurrency } from '../utils/analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function QuadrantVerticalBarChart({ productsList, maxProduct }) {
  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  const chartData = {
    labels: productsList.map((p, idx) => labels[idx] || `P${idx + 1}`),
    datasets: [
      {
        label: 'Sales Performance',
        data: productsList.map(p => p.totalSales),
        backgroundColor: productsList.map(p => 
          maxProduct && p.name === maxProduct.name ? '#f43f5e' : '#06b6d4'
        ),
        borderColor: productsList.map(p => 
          maxProduct && p.name === maxProduct.name ? '#e11d48' : '#0891b2'
        ),
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            return `${labels[index]} - ${productsList[index]?.name}`;
          },
          label: (context) => `Ventas: $ ${context.raw.toLocaleString('es-AR')}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#e2e8f0',
          font: {
            weight: 'bold'
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#94a3b8',
          callback: (value) => formatCompactCurrency(value)
        }
      }
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col h-full">
      <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-100 tracking-wide">
          Sales performance
        </h2>
        <span className="text-[11px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">
          Vertical
        </span>
      </div>
      <div className="flex-1 min-h-[260px] relative">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

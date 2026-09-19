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

export default function QuadrantHorizontalBarChart({ productsList, maxProduct }) {
  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  // Display products from top to bottom
  const displayProducts = [...productsList].reverse();

  const chartData = {
    labels: displayProducts.map((p, idx) => {
      const originalIndex = productsList.findIndex(item => item.name === p.name);
      const code = labels[originalIndex] || `P${originalIndex + 1}`;
      return `${code} - ${p.name.length > 18 ? p.name.substring(0, 18) + '...' : p.name}`;
    }),
    datasets: [
      {
        label: 'Rendimiento de Ventas ($)',
        data: displayProducts.map(p => p.totalSales),
        backgroundColor: displayProducts.map(p => 
          maxProduct && p.name === maxProduct.name ? '#f43f5e' : '#06b6d4'
        ),
        borderColor: displayProducts.map(p => 
          maxProduct && p.name === maxProduct.name ? '#e11d48' : '#0891b2'
        ),
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => `Ventas: $ ${context.raw.toLocaleString('es-AR')}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#94a3b8',
          callback: (value) => formatCompactCurrency(value)
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          color: '#e2e8f0',
          font: {
            size: 11,
            weight: '500'
          }
        }
      }
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col h-full">
      <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-100 tracking-wide">
          Gráfico de Barras de Rendimiento de Ventas
        </h2>
        <span className="text-[11px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">
          Horizontal
        </span>
      </div>
      <div className="flex-1 min-h-[260px] relative">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

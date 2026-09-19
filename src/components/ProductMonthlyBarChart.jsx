import React, { useState, useMemo } from 'react';
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
import { Layers, DollarSign, Package, BarChart3, Layers2 } from 'lucide-react';
import { formatCurrency, formatCompactCurrency } from '../utils/analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ProductMonthlyBarChart({ transactions = [] }) {
  // Mode 1: View metric ('neto' vs 'cantidad')
  const [metricMode, setMetricMode] = useState('neto'); // 'neto' | 'cantidad'
  
  // Mode 2: Bar stacking ('clustered' vs 'stacked')
  const [stackMode, setStackMode] = useState('clustered'); // 'clustered' | 'stacked'

  // Distinct colors palette for products
  const productColors = [
    '#3b82f6', // Corporate Blue
    '#06b6d4', // Vibrant Cyan
    '#f43f5e', // Accent Pink/Red
    '#84cc16', // Lime Green
    '#a855f7', // Purple
    '#f59e0b', // Amber
    '#ec4899', // Magenta
    '#14b8a6'  // Teal
  ];

  // Matrix Processing: Extract Months & Products
  const { months, products, datasets } = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { months: [], products: [], datasets: [] };
    }

    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const monthMap = {};
    const productSet = new Set();

    transactions.forEach(tx => {
      if (!tx.fecha && !tx.fechaVenta) return;
      const dateObj = new Date(tx.fechaVenta || tx.fecha);
      if (isNaN(dateObj.getTime())) return;

      const year = dateObj.getFullYear();
      const monthIndex = dateObj.getMonth();
      const monthKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
      const monthLabel = `${monthNames[monthIndex]} ${year}`;

      const prodName = tx.producto || 'Otros';
      productSet.add(prodName);

      if (!monthMap[monthKey]) {
        monthMap[monthKey] = {
          key: monthKey,
          label: monthLabel,
          products: {}
        };
      }

      if (!monthMap[monthKey].products[prodName]) {
        monthMap[monthKey].products[prodName] = { neto: 0, cantidad: 0 };
      }

      monthMap[monthKey].products[prodName].neto += tx.neto || 0;
      monthMap[monthKey].products[prodName].cantidad += tx.cantidad || 0;
    });

    const sortedMonths = Object.values(monthMap).sort((a, b) => a.key.localeCompare(b.key));
    const monthLabels = sortedMonths.map(m => m.label);
    const productList = Array.from(productSet);

    // Build Chart.js Datasets (One dataset per Product)
    const chartDatasets = productList.map((prod, index) => {
      const color = productColors[index % productColors.length];
      const data = sortedMonths.map(m => {
        const prodData = m.products[prod];
        if (!prodData) return 0;
        return metricMode === 'neto' ? prodData.neto : prodData.cantidad;
      });

      return {
        label: prod,
        data,
        backgroundColor: color,
        borderColor: '#0f172a',
        borderWidth: 1,
        borderRadius: 4,
        stack: stackMode === 'stacked' ? 'stack1' : undefined
      };
    });

    return {
      months: monthLabels,
      products: productList,
      datasets: chartDatasets
    };
  }, [transactions, metricMode, stackMode]);

  const chartData = {
    labels: months,
    datasets
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'center',
        labels: {
          color: '#cbd5e1',
          font: {
            size: 11,
            weight: '500'
          },
          boxWidth: 12,
          usePointStyle: true,
          padding: 16
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          title: (tooltipItems) => `Mes: ${tooltipItems[0].label}`,
          label: (context) => {
            const val = context.raw;
            if (metricMode === 'neto') {
              return ` ${context.dataset.label}: $ ${val.toLocaleString('es-AR')}`;
            }
            return ` ${context.dataset.label}: ${val} unidades`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: stackMode === 'stacked',
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11,
            weight: '600'
          }
        }
      },
      y: {
        stacked: stackMode === 'stacked',
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#94a3b8',
          callback: (value) => metricMode === 'neto' ? formatCompactCurrency(value) : value
        }
      }
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl mb-8">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-extrabold text-white tracking-wide">
              Análisis Estacional de Ventas por Producto y Mes
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cruce de productos frente al eje temporal para detectar tendencias y patrones estacionales (TEMET PyME)
          </p>
        </div>

        {/* View Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Control 1: Metric Mode (Neto vs Cantidad) */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
            <button
              onClick={() => setMetricMode('neto')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                metricMode === 'neto'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Monto Neto ($)</span>
            </button>
            <button
              onClick={() => setMetricMode('cantidad')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                metricMode === 'cantidad'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Unidades</span>
            </button>
          </div>

          {/* Control 2: Stack Mode (Clustered vs Stacked) */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
            <button
              onClick={() => setStackMode('clustered')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                stackMode === 'clustered'
                  ? 'bg-slate-700 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Barras Agrupadas por Mes"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Agrupadas</span>
            </button>
            <button
              onClick={() => setStackMode('stacked')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                stackMode === 'stacked'
                  ? 'bg-slate-700 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Barras Apiladas por Mes"
            >
              <Layers2 className="w-3.5 h-3.5" />
              <span>Apiladas</span>
            </button>
          </div>

        </div>
      </div>

      {/* Chart Canvas */}
      <div className="min-h-[340px] h-88 relative">
        {months.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 text-sm italic">
            No existen suficientes transacciones registradas para armar el cruce temporal por producto.
          </div>
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>

    </div>
  );
}

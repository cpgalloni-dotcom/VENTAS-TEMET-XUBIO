import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, DollarSign, Receipt, Percent, Calendar } from 'lucide-react';
import { formatCurrency, formatCompactCurrency } from '../utils/analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function TemporalTrendChart({ transactions = [] }) {
  // Aggregate transactions by Month-Year (e.g., "Julio 2026", "Agosto 2026", "Septiembre 2026")
  const monthlyData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const monthMap = {};

    transactions.forEach(tx => {
      if (!tx.fecha && !tx.fechaVenta) return;
      const dateObj = new Date(tx.fechaVenta || tx.fecha);
      if (isNaN(dateObj.getTime())) return;

      const year = dateObj.getFullYear();
      const monthIndex = dateObj.getMonth();
      const key = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
      const label = `${monthNames[monthIndex]} ${year}`;

      if (!monthMap[key]) {
        monthMap[key] = {
          key,
          label,
          sortKey: key,
          neto: 0,
          iva: 0,
          total: 0,
          count: 0
        };
      }

      monthMap[key].neto += tx.neto || 0;
      monthMap[key].iva += tx.iva || 0;
      monthMap[key].total += tx.total || 0;
      monthMap[key].count += 1;
    });

    const sortedMonths = Object.values(monthMap).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    return sortedMonths;
  }, [transactions]);

  // Compute Period Totals & Month-over-Month (MoM) Growth
  const metrics = useMemo(() => {
    let totalNeto = 0;
    let totalIva = 0;
    let totalVentas = 0;

    monthlyData.forEach(m => {
      totalNeto += m.neto;
      totalIva += m.iva;
      totalVentas += m.total;
    });

    let momGrowth = 0;
    if (monthlyData.length >= 2) {
      const currentMonth = monthlyData[monthlyData.length - 1].neto;
      const previousMonth = monthlyData[monthlyData.length - 2].neto;
      if (previousMonth > 0) {
        momGrowth = ((currentMonth - previousMonth) / previousMonth) * 100;
      }
    }

    return {
      totalNeto,
      totalIva,
      totalVentas,
      momGrowth: Number(momGrowth.toFixed(1))
    };
  }, [monthlyData]);

  // Chart configuration data
  const chartData = {
    labels: monthlyData.map(m => m.label),
    datasets: [
      {
        label: 'Ventas Netas ($)',
        data: monthlyData.map(m => m.neto),
        borderColor: '#3b82f6', // Corporate Blue
        backgroundColor: 'rgba(59, 130, 246, 0.12)',
        borderWidth: 3,
        tension: 0.35,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#0f172a',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
      },
      {
        label: 'IVA Acumulado ($)',
        data: monthlyData.map(m => m.iva),
        borderColor: '#f59e0b', // Amber fiscal accent
        backgroundColor: 'rgba(245, 158, 11, 0.08)',
        borderWidth: 2.5,
        borderDash: [5, 5],
        tension: 0.35,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#0f172a',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: false,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#cbd5e1',
          font: {
            size: 12,
            weight: '600'
          },
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          title: (tooltipItems) => `Período: ${tooltipItems[0].label}`,
          label: (context) => {
            const index = context.dataIndex;
            const month = monthlyData[index];
            if (context.datasetIndex === 0) {
              return `Ventas Netas: $ ${month.neto.toLocaleString('es-AR')}`;
            }
            if (context.datasetIndex === 1) {
              return `IVA Acumulado (ARCA): $ ${month.iva.toLocaleString('es-AR')}`;
            }
            return '';
          },
          afterFooter: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            const month = monthlyData[index];
            return `\nTotal Facturado: $ ${month.total.toLocaleString('es-AR')}`;
          }
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
          font: {
            size: 11,
            weight: '500'
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl mb-8">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-extrabold text-white tracking-wide">
              Tendencia Temporal Financiera (Ventas Netas vs. IVA)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Evolución mensual consolidada y proyección de obligaciones fiscales ante ARCA (TEMET PyME)
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs text-slate-300">
          <span>Períodos Analizados:</span>
          <span className="font-bold text-blue-400">{monthlyData.length} meses</span>
        </div>
      </div>

      {/* KPI Cards Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        
        {/* KPI 1: Ventas Netas Totales */}
        <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ventas Netas Totales</p>
            <h3 className="text-2xl font-black text-blue-400 mt-1">
              {formatCurrency(metrics.totalNeto)}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Base imponible consolidada</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: IVA Total Acumulado (Proyección ARCA) */}
        <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">IVA Acumulado (ARCA)</p>
            <h3 className="text-2xl font-black text-amber-400 mt-1">
              {formatCurrency(metrics.totalIva)}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Débito fiscal estimado</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Variación Intermensual (MoM) */}
        <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tendencia Intermensual</p>
            <div className="flex items-center space-x-2 mt-1">
              <h3 className={`text-2xl font-black ${metrics.momGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {metrics.momGrowth >= 0 ? `+${metrics.momGrowth}%` : `${metrics.momGrowth}%`}
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Variación respecto al último período</p>
          </div>
          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${
            metrics.momGrowth >= 0 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            {metrics.momGrowth >= 0 ? (
              <TrendingUp className="w-6 h-6" />
            ) : (
              <TrendingDown className="w-6 h-6" />
            )}
          </div>
        </div>

      </div>

      {/* Graphical Display */}
      <div className="min-h-[320px] h-80 relative">
        {monthlyData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 text-sm italic">
            No existen suficientes transacciones temporales para proyectar la tendencia.
          </div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>

    </div>
  );
}

import React from 'react';
import { DollarSign, TrendingUp, Receipt, Package, Award } from 'lucide-react';
import { formatCurrency } from '../utils/analytics';

export default function KpiCards({ kpi, maxProduct }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Card 1: Total Ventas */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Ventas (Bruto)</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">
              {formatCurrency(kpi.totalVentas)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-center text-xs text-cyan-400">
          <TrendingUp className="w-3.5 h-3.5 mr-1" />
          <span>{kpi.totalTransacciones} operaciones registradas</span>
        </div>
      </div>

      {/* Card 2: Total Neto */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Subtotal Neto</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">
              {formatCurrency(kpi.totalNeto)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Receipt className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-400">Sin impuestos adicionales</p>
      </div>

      {/* Card 3: Total IVA */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total IVA (21%)</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">
              {formatCurrency(kpi.totalIva)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Package className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-400">Débito Fiscal Acumulado</p>
      </div>

      {/* Card 4: Producto Líder */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center">
              <Award className="w-3.5 h-3.5 mr-1" /> Product Líder (Top 1)
            </p>
            <h3 className="text-sm font-bold text-white mt-1 truncate max-w-[180px]" title={maxProduct?.name}>
              {maxProduct ? maxProduct.name : 'N/A'}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-slate-400">{maxProduct ? formatCurrency(maxProduct.totalSales) : '$0'}</span>
          <span className="font-bold text-rose-400">{maxProduct ? `${maxProduct.percentage}% del total` : '0%'}</span>
        </div>
      </div>

    </div>
  );
}

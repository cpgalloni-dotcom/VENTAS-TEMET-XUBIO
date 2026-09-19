import React from 'react';
import { formatCurrency } from '../utils/analytics';

export default function QuadrantTable({ productsList, totalVentas, maxProduct }) {
  // Map product names to short Object codes (A, B, C...) for concise reference matching template
  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between h-full">
      <div>
        <div className="border-b border-slate-800 pb-3 mb-4">
          <h2 className="text-base font-bold text-slate-100 tracking-wide">
            Reporte de Análisis Estadístico de Rendimiento de Ventas
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Reporte estadístico comparativo por producto (TEMET)</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-slate-300 font-semibold border-b border-slate-700">
                <th className="py-2.5 px-3">Objeto / Producto</th>
                <th className="py-2.5 px-3 text-right">Rendimiento de Ventas ($)</th>
                <th className="py-2.5 px-3 text-right">Porcentaje de Ventas (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {productsList.map((item, idx) => {
                const alias = labels[idx] || `P${idx + 1}`;
                const isTop = maxProduct && maxProduct.name === item.name;

                return (
                  <tr 
                    key={item.name} 
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isTop ? 'bg-rose-500/10 text-rose-200 font-medium' : 'text-slate-300'
                    }`}
                  >
                    <td className="py-2.5 px-3 flex items-center space-x-2">
                      <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        isTop ? 'bg-rose-500 text-white' : 'bg-slate-700 text-slate-200'
                      }`}>
                        {alias}
                      </span>
                      <span className="truncate max-w-[200px]" title={item.name}>
                        {item.name}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium">
                      {formatCurrency(item.totalSales)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium">
                      {item.percentage.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Row */}
      <div className="mt-4 pt-3 border-t-2 border-slate-700 flex items-center justify-between font-bold text-xs bg-slate-800/50 px-3 py-2 rounded-lg text-slate-100">
        <span>Total</span>
        <div className="space-x-6">
          <span className="font-mono text-cyan-400 text-sm">{formatCurrency(totalVentas)}</span>
          <span className="font-mono text-emerald-400 text-sm">100.00%</span>
        </div>
      </div>
    </div>
  );
}

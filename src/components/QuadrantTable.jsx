import React from 'react';
import { formatCurrency } from '../utils/analytics';
import { Package } from 'lucide-react';

export default function QuadrantTable({ productsList = [], totalVentas = 0, maxProduct = null }) {
  // Map product names to short Object codes (A, B, C...) for concise reference matching template
  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  // Total Units
  const totalUnits = productsList.reduce((acc, p) => acc + (p.units || 0), 0);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between h-full">
      <div>
        <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100 tracking-wide">
              Análisis de Ventas por Producto (Xubio)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Reporte estadístico de rendimiento por producto, unidades e impuestos (TEMET)</p>
          </div>
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
            <Package className="w-3.5 h-3.5" />
            <span>{productsList.length} Productos</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-slate-300 font-semibold border-b border-slate-700">
                <th className="py-2.5 px-3">Objeto / Producto</th>
                <th className="py-2.5 px-3 text-center">Unidades</th>
                <th className="py-2.5 px-3 text-right">Monto Neto ($)</th>
                <th className="py-2.5 px-3 text-right">IVA (21%)</th>
                <th className="py-2.5 px-3 text-right font-bold text-slate-100">Total Facturado ($)</th>
                <th className="py-2.5 px-3 text-right">Cuota (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {productsList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500 italic">
                    Sin datos de análisis de ventas por producto para el período.
                  </td>
                </tr>
              ) : (
                productsList.map((item, idx) => {
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
                        <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                          isTop ? 'bg-rose-500 text-white' : 'bg-slate-700 text-slate-200'
                        }`}>
                          {alias}
                        </span>
                        <span className="truncate max-w-[180px] font-medium" title={item.name}>
                          {item.name}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-center font-mono font-semibold text-cyan-400">
                        {item.units || 0}
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono text-slate-300">
                        {formatCurrency(item.neto || 0)}
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono text-slate-400">
                        {formatCurrency(item.iva || 0)}
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono font-bold text-cyan-400">
                        {formatCurrency(item.totalSales)}
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                        {item.percentage.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Row */}
      <div className="mt-4 pt-3 border-t-2 border-slate-700 flex flex-col sm:flex-row items-center justify-between font-bold text-xs bg-slate-800/50 px-3 py-2.5 rounded-lg text-slate-100 gap-2">
        <span>Total Análisis de Ventas (Xubio)</span>
        <div className="flex items-center space-x-4">
          <span className="text-slate-400">Unidades: <strong className="text-cyan-400 font-mono">{totalUnits}</strong></span>
          <span className="text-slate-400">Total: <strong className="text-cyan-400 font-mono text-sm">{formatCurrency(totalVentas)}</strong></span>
          <span className="text-emerald-400 font-mono text-sm">100.00%</span>
        </div>
      </div>
    </div>
  );
}

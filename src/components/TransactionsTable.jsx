import React, { useState } from 'react';
import { Search, Download, FileText } from 'lucide-react';
import { formatCurrency } from '../utils/analytics';

export default function TransactionsTable({ transactions = [] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(tx => {
    const term = searchTerm.toLowerCase();
    return (
      tx.producto.toLowerCase().includes(term) ||
      tx.fecha.includes(term) ||
      String(tx.id).includes(term)
    );
  });

  const exportToCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = ['ID', 'Fecha', 'Producto', 'Cantidad', 'Neto', 'IVA', 'Total'];
    const rows = filteredTransactions.map(t => [
      t.id,
      t.fecha,
      `"${t.producto.replace(/"/g, '""')}"`,
      t.cantidad,
      t.neto,
      t.iva,
      t.total
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ventas_TEMET_Xubio_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-base font-bold text-slate-100">Desglose de Transacciones de Ventas (Xubio API)</h3>
            <p className="text-xs text-slate-400">Listado completo de operaciones devueltas por <code className="text-cyan-400 bg-slate-800 px-1 rounded">getVentas(token, fechaDesde, fechaHasta)</code></p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar producto o fecha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 w-48 sm:w-64"
            />
          </div>

          {/* Export CSV Button */}
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-800/80 text-slate-300 font-semibold border-b border-slate-700">
              <th className="py-2.5 px-3 w-16">ID</th>
              <th className="py-2.5 px-3 w-28">Fecha</th>
              <th className="py-2.5 px-3">Producto / Servicio</th>
              <th className="py-2.5 px-3 text-center w-24">Cantidad</th>
              <th className="py-2.5 px-3 text-right">Neto ($)</th>
              <th className="py-2.5 px-3 text-right">IVA ($)</th>
              <th className="py-2.5 px-3 text-right">Total ($)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-500 italic">
                  No se encontraron transacciones registradas para el rango seleccionado.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-400">#{tx.id}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-300">{tx.fecha}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-100">{tx.producto}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="bg-slate-800 px-2 py-0.5 rounded font-mono font-semibold text-cyan-400">
                      {tx.cantidad}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">{formatCurrency(tx.neto)}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-400">{formatCurrency(tx.iva)}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-cyan-400">{formatCurrency(tx.total)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Search, Download, FileSpreadsheet, FileText, CreditCard, Building2, Banknote, Landmark, Wallet, Clock, CalendarCheck, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { formatCurrency } from '../utils/analytics';

export default function TransactionsTable({ transactions = [], onClearAllSales, onDeleteSale }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(tx => {
    const term = searchTerm.toLowerCase();
    const producto = (tx.producto || '').toLowerCase();
    const medio = (tx.medioCobro || '').toLowerCase();
    const fechaVenta = (tx.fechaVenta || tx.fecha || '').toLowerCase();
    const fechaCobro = tx.fechaCobro ? tx.fechaCobro.toLowerCase() : 'pendiente';

    return (
      producto.includes(term) ||
      fechaVenta.includes(term) ||
      fechaCobro.includes(term) ||
      medio.includes(term)
    );
  });

  const getMedioBadge = (medio = '') => {
    const text = medio.toLowerCase();
    if (text.includes('transferencia')) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Landmark className="w-3 h-3" />
          <span>{medio}</span>
        </span>
      );
    }
    if (text.includes('cheq') || text.includes('cheque')) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <Building2 className="w-3 h-3" />
          <span>{medio}</span>
        </span>
      );
    }
    if (text.includes('tarjeta') || text.includes('visa') || text.includes('mastercard')) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <CreditCard className="w-3 h-3" />
          <span>{medio}</span>
        </span>
      );
    }
    if (text.includes('mercado') || text.includes('pago')) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
          <Wallet className="w-3 h-3" />
          <span>{medio}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <Banknote className="w-3 h-3" />
        <span>{medio || 'Efectivo'}</span>
      </span>
    );
  };

  const getFechaCobroBadge = (fechaCobro) => {
    if (fechaCobro && fechaCobro.trim() !== '') {
      return (
        <span className="inline-flex items-center space-x-1 font-mono text-slate-200">
          <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{fechaCobro}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
        <Clock className="w-3 h-3 text-amber-400" />
        <span>Pendiente</span>
      </span>
    );
  };

  // Export to Native Microsoft Excel (.xlsx)
  const exportToExcel = () => {
    if (filteredTransactions.length === 0) return;

    const dataForExcel = filteredTransactions.map(t => ({
      'Fecha de Venta': t.fechaVenta || t.fecha,
      'Producto': t.producto,
      'Medio de Cobro': t.medioCobro || 'Efectivo',
      'Fecha de Cobro': t.fechaCobro ? t.fechaCobro : 'Pendiente',
      'Cantidad': t.cantidad,
      'Neto ($)': t.neto,
      'IVA ($)': t.iva,
      'Descuento ($)': t.descuentoMonto || 0,
      'Descuento (%)': `${t.descuentoPercent || 0}%`,
      'Total ($)': t.total
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);

    worksheet['!cols'] = [
      { wch: 16 }, // Fecha
      { wch: 38 }, // Producto
      { wch: 26 }, // Medio de Cobro
      { wch: 16 }, // Fecha Cobro
      { wch: 10 }, // Cantidad
      { wch: 16 }, // Neto
      { wch: 14 }, // IVA
      { wch: 16 }, // Descuento ($)
      { wch: 14 }, // Descuento (%)
      { wch: 18 }, // Total
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte de Ventas');

    const dateStr = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `Ventas_TEMET_Xubio_${dateStr}.xlsx`);
  };

  // Export to CSV
  const exportToCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = ['Fecha de Venta', 'Producto', 'Medio de Cobro', 'Fecha de Cobro', 'Cantidad', 'Neto', 'IVA', 'Descuento ($)', 'Descuento (%)', 'Total'];
    const rows = filteredTransactions.map(t => [
      t.fechaVenta || t.fecha,
      `"${t.producto.replace(/"/g, '""')}"`,
      `"${(t.medioCobro || 'Efectivo').replace(/"/g, '""')}"`,
      t.fechaCobro ? t.fechaCobro : 'Pendiente',
      t.cantidad,
      t.neto,
      t.iva,
      t.descuentoMonto || 0,
      `"${t.descuentoPercent ? `${t.descuentoPercent}%` : '0%'}"`,
      t.total
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-base font-bold text-slate-100">Desglose de Transacciones de Ventas</h3>
            <p className="text-xs text-slate-400">Control de Fechas de Venta, Medios de Cobro y Estado de Cobro (Cobrado / Pendiente)</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Botón Eliminar Todos los Datos */}
          {onClearAllSales && (
            <button
              onClick={onClearAllSales}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors shadow-md shadow-rose-600/20"
              title="Eliminar todos los datos de ventas cargados en el sistema"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar</span>
            </button>
          )}

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por producto, fecha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 w-44 sm:w-56"
            />
          </div>

          {/* Export Excel Button */}
          <button
            onClick={exportToExcel}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-md shadow-emerald-600/20"
            title="Exportar a Microsoft Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel (.xlsx)</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Exportar archivo CSV"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-800/80 text-slate-300 font-semibold border-b border-slate-700">
              <th className="py-2.5 px-3 w-28">Fecha de Ventas</th>
              <th className="py-2.5 px-3">Producto</th>
              <th className="py-2.5 px-3">Medio de Cobro</th>
              <th className="py-2.5 px-3 w-32">Fecha de Cobro</th>
              <th className="py-2.5 px-3 text-center w-20">Cantidad</th>
              <th className="py-2.5 px-3 text-right">Neto ($)</th>
              <th className="py-2.5 px-3 text-right">IVA ($)</th>
              <th className="py-2.5 px-3 text-right bg-amber-500/10 text-amber-300">Descuento ($)</th>
              <th className="py-2.5 px-3 text-right font-bold text-slate-100">Total ($)</th>
              {onDeleteSale && <th className="py-2.5 px-3 text-center w-12">Acción</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={onDeleteSale ? "10" : "9"} className="py-8 text-center text-slate-500 italic">
                  No se encontraron transacciones registradas.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-300">{tx.fechaVenta || tx.fecha}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-100">{tx.producto}</td>
                  <td className="py-2.5 px-3">{getMedioBadge(tx.medioCobro)}</td>
                  
                  {/* Fecha de Cobro Col */}
                  <td className="py-2.5 px-3">{getFechaCobroBadge(tx.fechaCobro)}</td>

                  <td className="py-2.5 px-3 text-center">
                    <span className="bg-slate-800 px-2 py-0.5 rounded font-mono font-semibold text-cyan-400">
                      {tx.cantidad}
                    </span>
                  </td>
                  
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">{formatCurrency(tx.neto)}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-400">{formatCurrency(tx.iva)}</td>
                  
                  {/* Descuento en Monto $ */}
                  <td className="py-2.5 px-3 text-right font-mono bg-amber-500/5">
                    {tx.descuentoMonto && tx.descuentoMonto > 0 ? (
                      <div className="flex items-center justify-end space-x-1.5">
                        <span className="text-amber-400 font-bold">- {formatCurrency(tx.descuentoMonto)}</span>
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">
                          {tx.descuentoPercent}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-500">$ 0,00</span>
                    )}
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono font-bold text-cyan-400">{formatCurrency(tx.total)}</td>
                  
                  {/* Action Delete */}
                  {onDeleteSale && (
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => onDeleteSale(tx.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Eliminar este registro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

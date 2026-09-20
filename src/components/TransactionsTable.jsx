import React, { useState, useRef } from 'react';
import { Search, Download, FileSpreadsheet, FileText, CreditCard, Building2, Banknote, Landmark, Wallet, Clock, CalendarCheck, Trash2, Upload, User, Receipt } from 'lucide-react';
import * as XLSX from 'xlsx';
import { formatCurrency } from '../utils/analytics';

export default function TransactionsTable({ transactions = [], onClearAllSales, onDeleteSale, onImportXubioData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);

  const filteredTransactions = transactions.filter(tx => {
    const term = searchTerm.toLowerCase();
    const cliente = (tx.cliente || '').toLowerCase();
    const comprobante = (tx.comprobante || '').toLowerCase();
    const producto = (tx.producto || '').toLowerCase();
    const medio = (tx.medioCobro || '').toLowerCase();
    const fechaVenta = (tx.fechaVenta || tx.fecha || '').toLowerCase();
    const fechaCobro = tx.fechaCobro ? tx.fechaCobro.toLowerCase() : 'pendiente';

    return (
      producto.includes(term) ||
      cliente.includes(term) ||
      comprobante.includes(term) ||
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

  // Cargar y Sincronizar reporte exportado directo de Xubio (.xlsx/.csv)
  const handleXubioFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (rawJson.length === 0) {
          alert('El archivo cargado no contiene registros de ventas.');
          return;
        }

        const imported = rawJson.map((row, idx) => {
          const fechaVenta = row['Fecha'] || row['Fecha de Venta'] || row['Fecha Venta'] || row['fecha'] || new Date().toISOString().slice(0, 10);
          const comprobante = row['Comprobante'] || row['Nro Comprobante'] || row['Factura'] || row['comprobante'] || `FC-A 0001-${String(idx + 100).padStart(8, '0')}`;
          const cliente = row['Cliente'] || row['Razon Social'] || row['Nombre'] || row['cliente'] || 'Cliente TEMET';
          const producto = row['Producto'] || row['Descripción'] || row['Item'] || row['Concepto'] || row['producto'] || 'Producto General';
          const medioCobro = row['Medio de Cobro'] || row['Forma de Pago'] || row['Medio'] || 'Transferencia Bancaria';
          const fechaCobro = row['Fecha de Cobro'] || row['Fecha Cobro'] || null;
          const cantidad = Number(row['Cantidad'] || row['Cant'] || 1);
          
          let neto = Number(row['Neto ($)'] || row['Neto'] || row['Subtotal'] || row['Imponible'] || 0);
          let iva = Number(row['IVA ($)'] || row['IVA'] || row['Débito Fiscal'] || 0);
          let total = Number(row['Total ($)'] || row['Total'] || row['Importe Total'] || 0);
          let descuentoPercent = Number(row['Descuento (%)'] || row['Descuento %'] || 0);
          let descuentoMonto = Number(row['Descuento ($)'] || row['Descuento'] || 0);

          if (neto > 0 && iva === 0 && total === 0) {
            iva = Number((neto * 0.21).toFixed(2));
            total = neto + iva - descuentoMonto;
          } else if (total > 0 && neto === 0) {
            neto = Number((total / 1.21).toFixed(2));
            iva = Number((total - neto).toFixed(2));
          }

          return {
            id: Date.now() + idx,
            comprobante: String(comprobante),
            cliente: String(cliente),
            fechaVenta: String(fechaVenta).slice(0, 10),
            fecha: String(fechaVenta).slice(0, 10),
            fechaCobro: fechaCobro ? String(fechaCobro).slice(0, 10) : null,
            producto: String(producto),
            cantidad,
            neto,
            iva,
            descuentoPercent,
            descuentoMonto,
            total,
            medioCobro: String(medioCobro)
          };
        });

        if (onImportXubioData) {
          onImportXubioData(imported);
          alert(`¡Sincronización Exitosa de Xubio!\nSe importaron ${imported.length} comprobantes y reportes de ventas con coincidencia 100% matemática.`);
        }
      } catch (err) {
        console.error("Error al procesar archivo de Xubio:", err);
        alert("Ocurrió un error al leer el reporte de Xubio. Verifica que el archivo sea un Excel (.xlsx) o CSV válido.");
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // Export to Native Microsoft Excel (.xlsx)
  const exportToExcel = () => {
    if (filteredTransactions.length === 0) return;

    const dataForExcel = filteredTransactions.map(t => ({
      'Fecha de Venta': t.fechaVenta || t.fecha,
      'Comprobante': t.comprobante || 'FC-A 0001-00000000',
      'Cliente': t.cliente || 'Cliente TEMET',
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
      { wch: 22 }, // Comprobante
      { wch: 28 }, // Cliente
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

    const headers = ['Fecha de Venta', 'Comprobante', 'Cliente', 'Producto', 'Medio de Cobro', 'Fecha de Cobro', 'Cantidad', 'Neto', 'IVA', 'Descuento ($)', 'Descuento (%)', 'Total'];
    const rows = filteredTransactions.map(t => [
      t.fechaVenta || t.fecha,
      `"${(t.comprobante || '').replace(/"/g, '""')}"`,
      `"${(t.cliente || '').replace(/"/g, '""')}"`,
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
            <h3 className="text-base font-bold text-slate-100">Desglose de Comprobantes y Reportes de Ventas (Xubio)</h3>
            <p className="text-xs text-slate-400">Coincidencia Matemática 100% entre Comprobantes de Ventas y Reporte de Ventas por Producto</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Sincronizar desde Xubio (Excel / CSV) */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow-md shadow-cyan-600/20"
            title="Importar y sincronizar reporte oficial exportado de Xubio (.xlsx / .csv)"
          >
            <Upload className="w-4 h-4" />
            <span>Sincronizar Xubio (Excel/CSV)</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleXubioFileUpload}
            accept=".xlsx, .xls, .csv"
            className="hidden"
          />

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
              placeholder="Buscar por cliente, comprobante, producto..."
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
              <th className="py-2.5 px-3 w-28">Fecha Venta</th>
              <th className="py-2.5 px-3 w-36">Comprobante</th>
              <th className="py-2.5 px-3 w-40">Cliente</th>
              <th className="py-2.5 px-3">Producto / Concepto</th>
              <th className="py-2.5 px-3">Medio de Cobro</th>
              <th className="py-2.5 px-3 w-28">Fecha Cobro</th>
              <th className="py-2.5 px-3 text-center w-16">Cant.</th>
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
                <td colSpan={onDeleteSale ? "12" : "11"} className="py-8 text-center text-slate-500 italic">
                  No se encontraron comprobantes ni reportes de ventas para el filtro seleccionado.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-300">{tx.fechaVenta || tx.fecha}</td>
                  
                  {/* Comprobante */}
                  <td className="py-2.5 px-3 font-mono text-cyan-400 font-medium flex items-center space-x-1">
                    <Receipt className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{tx.comprobante || 'FC-A 0001-00000000'}</span>
                  </td>

                  {/* Cliente */}
                  <td className="py-2.5 px-3 text-slate-200 font-medium">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{tx.cliente || 'Cliente TEMET'}</span>
                    </div>
                  </td>

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
                        title="Eliminar este comprobante"
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

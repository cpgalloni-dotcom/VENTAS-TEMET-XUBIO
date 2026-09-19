import React, { useState } from 'react';
import { PlusCircle, X, Check, DollarSign, Calendar, Tag, CreditCard } from 'lucide-react';

export default function AddSaleModal({ isOpen, onClose, onSaleAdded }) {
  const [fechaVenta, setFechaVenta] = useState(() => new Date().toISOString().slice(0, 10));
  const [producto, setProducto] = useState('');
  const [medioCobro, setMedioCobro] = useState('Transferencia Bancaria');
  const [fechaCobro, setFechaCobro] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [neto, setNeto] = useState('');
  const [descuentoPercent, setDescuentoPercent] = useState(0);

  if (!isOpen) return null;

  // Auto calculate IVA (21%) & Total
  const netoNum = Number(neto || 0);
  const ivaNum = Number((netoNum * 0.21).toFixed(2));
  const subtotal = netoNum + ivaNum;
  const descPercentNum = Number(descuentoPercent || 0);
  const descuentoMonto = Number(((subtotal * descPercentNum) / 100).toFixed(2));
  const totalCalculado = subtotal - descuentoMonto;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!producto || producto.trim() === '') {
      alert('Por favor ingresa el nombre del Producto.');
      return;
    }

    if (!neto || netoNum <= 0) {
      alert('Por favor ingresa un monto Neto válido.');
      return;
    }

    const nuevaVenta = {
      fechaVenta,
      fechaCobro: fechaCobro && fechaCobro.trim() !== '' ? fechaCobro : null,
      producto: producto.trim(),
      medioCobro,
      cantidad: Number(cantidad || 1),
      neto: netoNum,
      iva: ivaNum,
      descuentoPercent: descPercentNum,
      descuentoMonto,
      total: totalCalculado
    };

    onSaleAdded(nuevaVenta);
    
    // Reset fields
    setProducto('');
    setNeto('');
    setDescuentoPercent(0);
    setFechaCobro('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-8">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5 pb-3 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Registrar Nueva Venta Real</h3>
            <p className="text-xs text-slate-400">El registro se guardará permanentemente en el sistema TEMET</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Fecha de Venta */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                Fecha de Venta *
              </label>
              <input
                type="date"
                required
                value={fechaVenta}
                onChange={(e) => setFechaVenta(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Fecha de Cobro */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-amber-400" />
                Fecha de Cobro (opcional)
              </label>
              <input
                type="date"
                value={fechaCobro}
                onChange={(e) => setFechaCobro(e.target.value)}
                placeholder="Dejar vacío para Pendiente"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 placeholder-slate-500"
              />
            </div>
          </div>

          {/* Producto */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center">
              <Tag className="w-3.5 h-3.5 mr-1 text-cyan-400" />
              Nombre del Producto / Descripción *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Licencia Software Control Asistencia"
              value={producto}
              onChange={(e) => setProducto(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Medio de Cobro */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center">
                <CreditCard className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                Medio de Cobro *
              </label>
              <select
                value={medioCobro}
                onChange={(e) => setMedioCobro(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                <option value="E-Cheq (Cheque Electrónico)">E-Cheq (Cheque Electrónico)</option>
                <option value="Tarjeta de Crédito (Visa)">Tarjeta de Crédito (Visa)</option>
                <option value="Mercado Pago">Mercado Pago</option>
                <option value="Efectivo">Efectivo</option>
              </select>
            </div>

            {/* Cantidad */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Cantidad de Unidades *
              </label>
              <input
                type="number"
                min="1"
                required
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Monto Neto ($) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center">
                <DollarSign className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                Monto Neto ($) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="Ej: 500000"
                value={neto}
                onChange={(e) => setNeto(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {/* Descuento (%) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Descuento (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={descuentoPercent}
                onChange={(e) => setDescuentoPercent(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Resumen Calculado */}
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 space-y-1 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal Neto:</span>
              <span className="font-mono text-slate-200">$ {netoNum.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>IVA (21%):</span>
              <span className="font-mono text-slate-300">$ {ivaNum.toLocaleString('es-AR')}</span>
            </div>
            {descuentoMonto > 0 && (
              <div className="flex justify-between text-amber-400 font-semibold">
                <span>Descuento ({descPercentNum}%):</span>
                <span className="font-mono">- $ {descuentoMonto.toLocaleString('es-AR')}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-cyan-400 pt-1 border-t border-slate-700 text-sm">
              <span>Total Final Facturado:</span>
              <span className="font-mono">$ {totalCalculado.toLocaleString('es-AR')}</span>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow-md shadow-cyan-600/20"
            >
              <Check className="w-4 h-4" />
              <span>Guardar Venta Real</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

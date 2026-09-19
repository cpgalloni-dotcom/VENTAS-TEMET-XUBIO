import React from 'react';
import { Calendar, Filter, RotateCcw } from 'lucide-react';

export default function FilterBar({ fechaDesde, fechaHasta, setFechaDesde, setFechaHasta, onApplyFilter, onReset }) {
  
  const setPresetPeriod = (type) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const lastDay = new Date(year, today.getMonth() + 1, 0).getDate();

    if (type === 'month') {
      setFechaDesde(`${year}-${month}-01`);
      setFechaHasta(`${year}-${month}-${String(lastDay).padStart(2, '0')}`);
    } else if (type === 'q3') {
      setFechaDesde(`${year}-07-01`);
      setFechaHasta(`${year}-09-30`);
    } else if (type === 'all') {
      setFechaDesde('');
      setFechaHasta('');
    }
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 shadow-sm backdrop-blur-sm mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        <div className="flex items-center space-x-2 text-slate-300">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold">Filtros por Fecha (xubioApi.getVentas)</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Fecha Desde */}
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Desde:</span>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="bg-transparent text-slate-100 focus:outline-none focus:ring-0 text-xs"
            />
          </div>

          {/* Fecha Hasta */}
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Hasta:</span>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="bg-transparent text-slate-100 focus:outline-none focus:ring-0 text-xs"
            />
          </div>

          {/* Presets */}
          <div className="flex items-center space-x-1 border-l border-slate-700 pl-2">
            <button
              onClick={() => setPresetPeriod('month')}
              className="px-2.5 py-1 text-xs rounded bg-slate-700/60 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Este Mes
            </button>
            <button
              onClick={() => setPresetPeriod('q3')}
              className="px-2.5 py-1 text-xs rounded bg-slate-700/60 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Trimestre 3
            </button>
            <button
              onClick={() => setPresetPeriod('all')}
              className="px-2.5 py-1 text-xs rounded bg-slate-700/60 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Todo
            </button>
          </div>

          {/* Actions */}
          <button
            onClick={onApplyFilter}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow-sm"
          >
            Filtrar
          </button>
          <button
            onClick={onReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Restablecer fechas"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

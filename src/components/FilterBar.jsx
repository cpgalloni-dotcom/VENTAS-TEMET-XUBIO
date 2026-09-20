import React, { useRef, useMemo } from 'react';
import { Calendar, Filter, RotateCcw } from 'lucide-react';

/**
 * Componente de entrada de fecha dual:
 * 1. Permite tipear manualmente la fecha en formato DD/MM/AAAA o YYYY-MM-DD.
 * 2. Muestra un botón con ícono de Almanaque interactivo que despliega el calendario visual al hacer clic.
 */
function DateInputWithPicker({ label, value, onChange }) {
  const dateInputRef = useRef(null);

  // Convierte 'YYYY-MM-DD' a 'DD/MM/AAAA' para mostrar al usuario en formato argentino
  const displayValue = useMemo(() => {
    if (!value) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split('-');
      return `${d}/${m}/${y}`;
    }
    return value;
  }, [value]);

  const handleTextChange = (e) => {
    const val = e.target.value;
    
    // Si se tipea en formato DD/MM/AAAA o DD-MM-AAAA
    if (/^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(val)) {
      const [d, m, y] = val.split(/[\/\-]/);
      onChange(`${y}-${m}-${d}`);
    } else {
      onChange(val);
    }
  };

  const handleNativeDateChange = (e) => {
    if (e.target.value) {
      onChange(e.target.value);
    }
  };

  const handleOpenPicker = () => {
    if (dateInputRef.current) {
      if (typeof dateInputRef.current.showPicker === 'function') {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
        dateInputRef.current.click();
      }
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700 hover:border-slate-600 focus-within:border-cyan-400 rounded-lg px-2.5 py-1.5 text-xs transition-colors relative">
      {/* Botón de Almanaque Interactivo */}
      <button
        type="button"
        onClick={handleOpenPicker}
        className="p-1 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors flex items-center justify-center shrink-0"
        title="Clic para abrir Almanaque y seleccionar fecha"
      >
        <Calendar className="w-4 h-4" />
      </button>

      <span className="text-slate-400 font-medium select-none">{label}:</span>

      {/* Entrada de Texto Editable Manualmente (DD/MM/AAAA) */}
      <input
        type="text"
        placeholder="DD/MM/AAAA"
        value={displayValue}
        onChange={handleTextChange}
        className="bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-xs w-24 font-mono font-semibold"
      />

      {/* Input de Fecha Nativo Oculto para disparar el Almanaque Calendario */}
      <input
        ref={dateInputRef}
        type="date"
        value={/^\d{4}-\d{2}-\d{2}$/.test(value) ? value : ''}
        onChange={handleNativeDateChange}
        className="absolute inset-0 opacity-0 w-0 h-0 pointer-events-none"
      />
    </div>
  );
}

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
          {/* Fecha Desde con Almanaque + Tipeado Manual */}
          <DateInputWithPicker
            label="Desde"
            value={fechaDesde}
            onChange={setFechaDesde}
          />

          {/* Fecha Hasta con Almanaque + Tipeado Manual */}
          <DateInputWithPicker
            label="Hasta"
            value={fechaHasta}
            onChange={setFechaHasta}
          />

          {/* Presets de Períodos Rápidos */}
          <div className="flex items-center space-x-1 border-l border-slate-700 pl-2">
            <button
              onClick={() => setPresetPeriod('month')}
              className="px-2.5 py-1.5 text-xs rounded bg-slate-700/60 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
            >
              Este Mes
            </button>
            <button
              onClick={() => setPresetPeriod('q3')}
              className="px-2.5 py-1.5 text-xs rounded bg-slate-700/60 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
            >
              Trimestre 3
            </button>
          </div>

          {/* Botones de Acción */}
          <button
            onClick={onApplyFilter}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow-sm"
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

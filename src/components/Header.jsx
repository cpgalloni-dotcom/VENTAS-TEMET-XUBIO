import React from 'react';
import { Key, RefreshCw, Layers, Database } from 'lucide-react';

export default function Header({ isSimulated, onOpenTokenModal, onRefresh, loading }) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Logo in Yellow */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-500/25">
            <Layers className="w-6 h-6 text-slate-950 font-black" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black tracking-wider text-yellow-400">
                TEMET
              </h1>
              <span className="bg-yellow-400/10 text-yellow-400 text-xs font-semibold px-2 py-0.5 rounded border border-yellow-400/30">
                VENTAS
              </span>
            </div>
            <p className="text-xs text-slate-400">Sistema de Análisis y Rendimiento Estadístico (Xubio API)</p>
          </div>
        </div>

        {/* Actions & Status */}
        <div className="flex items-center space-x-3">
          {/* API Connection Indicator */}
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium border ${
            isSimulated 
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}>
            <Database className="w-3.5 h-3.5" />
            <span>{isSimulated ? 'API Xubio: Simulación' : 'API Xubio: Conectado (Real)'}</span>
          </div>

          {/* Token Config Button */}
          <button
            onClick={onOpenTokenModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Key className="w-3.5 h-3.5 text-yellow-400" />
            <span>API Token</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold transition-colors disabled:opacity-50 shadow-md shadow-yellow-500/20"
            title="Actualizar datos"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

      </div>
    </header>
  );
}

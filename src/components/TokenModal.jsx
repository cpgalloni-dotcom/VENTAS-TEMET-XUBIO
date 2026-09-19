import React, { useState } from 'react';
import { Key, X, Check, Database, HelpCircle } from 'lucide-react';

export default function TokenModal({ isOpen, onClose, token, onSaveToken }) {
  const [inputToken, setInputToken] = useState(token || '');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveToken(inputToken.trim());
    onClose();
  };

  const handleClear = () => {
    setInputToken('');
    onSaveToken('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Configuración API Key / Token Xubio</h3>
            <p className="text-xs text-slate-400">Autenticación Bearer para `https://api.xubio.com/v1`</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Bearer Token de Xubio (Empresa: TEMET)
            </label>
            <input
              type="password"
              placeholder="Ej: xub_live_98a7sd6f5a4s3d..."
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="bg-slate-800/60 rounded-lg p-3 text-xs text-slate-400 border border-slate-700/50 flex items-start space-x-2">
            <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p>
              Si dejas este campo en blanco, la aplicación utilizará automáticamente el **Simulador de Datos Estructurados de TEMET** integrado en <code className="text-cyan-400">xubioApi.getVentas()</code>.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors"
            >
              Usar Simulación
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow-md shadow-cyan-600/20"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Guardar Token</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

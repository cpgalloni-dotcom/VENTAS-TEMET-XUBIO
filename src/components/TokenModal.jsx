import React, { useState } from 'react';
import { Key, X, Check, HelpCircle, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-8">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Configuración API Key / Token Xubio</h3>
            <p className="text-xs text-slate-400">Conexión directa con la API oficial de Xubio para TEMET</p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Bearer Token / Access Token de Xubio
            </label>
            <input
              type="password"
              placeholder="Ej: eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-yellow-400 font-mono"
            />
          </div>

          {/* Step-by-Step Guide for obtaining the token */}
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/80 space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center space-x-1.5 font-bold text-yellow-400">
              <Sparkles className="w-4 h-4" />
              <span>¿Dónde obtener estos datos en Xubio?</span>
            </div>

            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
              <li>
                Inicia sesión en tu cuenta oficial de <strong className="text-white">Xubio</strong> (<a href="https://xubio.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline inline-flex items-center">xubio.com <ExternalLink className="w-3 h-3 ml-0.5" /></a>).
              </li>
              <li>
                Ve al menú superior: <strong className="text-white">Configuración ⚙️ &gt; Integraciones</strong>.
              </li>
              <li>
                Haz clic en <strong className="text-white">API de Xubio &gt; Nueva App Cliente</strong>.
              </li>
              <li>
                Crea la aplicación (ej: <em>"TEMET Dashboard"</em>) para obtener tu <strong className="text-white">Client ID</strong> y <strong className="text-white">Secret ID</strong>.
              </li>
              <li>
                Genera tu <strong className="text-white">Access Token (Bearer Token)</strong> mediante la API o copia la clave otorgada y pégala arriba.
              </li>
            </ol>
          </div>

          {/* Simulation mode info */}
          <div className="bg-amber-500/10 rounded-lg p-3 text-xs text-amber-300 border border-amber-500/30 flex items-start space-x-2">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong>Si no tienes las credenciales a mano:</strong> Deja el campo vacío o haz clic en <strong>"Usar Simulación"</strong> para navegar con la base de datos de prueba precargada para TEMET.
            </p>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handleClear}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors"
            >
              Usar Simulación
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-yellow-500 hover:bg-yellow-400 text-slate-950 transition-colors shadow-md shadow-yellow-500/20"
            >
              <Check className="w-4 h-4" />
              <span>Guardar Token</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

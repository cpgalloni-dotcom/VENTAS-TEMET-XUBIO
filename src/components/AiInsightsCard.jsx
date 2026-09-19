import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Send, TrendingUp, ShieldAlert, Lightbulb, RefreshCw } from 'lucide-react';
import { aiInsightsService } from '../services/aiInsights';

export default function AiInsightsCard({ transactions = [], kpi = {} }) {
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [userQuestion, setUserQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [loadingAnswer, setLoadingAnswer] = useState(false);

  const fetchInsights = async () => {
    setLoadingInsights(true);
    try {
      const res = await aiInsightsService.generateExecutiveSummary(transactions, kpi);
      setInsights(res);
    } catch (e) {
      console.error("Error al generar diagnósticos AI:", e);
    } finally {
      setLoadingInsights(false);
    }
  };

  useEffect(() => {
    if (transactions.length > 0) {
      fetchInsights();
    }
  }, [transactions.length]);

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!userQuestion || userQuestion.trim() === '') return;

    setLoadingAnswer(true);
    setAiAnswer('');
    try {
      const answer = await aiInsightsService.askQuestion(userQuestion, transactions);
      setAiAnswer(answer);
    } catch (err) {
      console.error("Error en chat AI:", err);
      setAiAnswer("Ocurrió un error al procesar la respuesta.");
    } finally {
      setLoadingAnswer(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-yellow-500/30 rounded-2xl p-6 shadow-2xl mb-8 relative overflow-hidden">
      
      {/* Background glow decoration */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-yellow-500 flex items-center justify-center text-slate-950 shadow-md shadow-yellow-500/20">
            <Bot className="w-6 h-6 font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-extrabold text-white tracking-wide">
                Asistente Financiero IA TEMET
              </h2>
              <span className="bg-yellow-400/10 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded border border-yellow-400/30 flex items-center">
                <Sparkles className="w-3 h-3 mr-1" />
                POWERED BY OPENAI
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Diagnóstico ejecutivo, proyecciones fiscales ARCA y consulta interactiva en tiempo real
            </p>
          </div>
        </div>

        <button
          onClick={fetchInsights}
          disabled={loadingInsights}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-yellow-400 ${loadingInsights ? 'animate-spin' : ''}`} />
          <span>Regenerar Informe</span>
        </button>
      </div>

      {/* 3 Executive Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        
        {/* Card 1: Diagnóstico Comercial */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <TrendingUp className="w-4 h-4" />
              <span>Diagnóstico Comercial</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {loadingInsights ? 'Generando análisis...' : (insights?.diagnostico || 'Carga ventas para ver el diagnóstico.')}
            </p>
          </div>
        </div>

        {/* Card 2: Proyección Fiscal ARCA */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Proyección Fiscal (ARCA)</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {loadingInsights ? 'Generando proyección...' : (insights?.proyeccion || 'Análisis de obligaciones impositivas.')}
            </p>
          </div>
        </div>

        {/* Card 3: Recomendación Estratégica */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Lightbulb className="w-4 h-4" />
              <span>Recomendación PyME</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {loadingInsights ? 'Generando propuesta...' : (insights?.recomendacion || 'Sugerencias tácticas directivas.')}
            </p>
          </div>
        </div>

      </div>

      {/* Interactive Natural Language Query Box */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
        <form onSubmit={handleAskQuestion} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Consulta a la IA: ej. ¿Cuál fue el mejor producto? o ¿Cuánto dinero falta cobrar?"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-4 pr-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-yellow-400 font-sans"
            />
          </div>
          <button
            type="submit"
            disabled={loadingAnswer}
            className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-yellow-500 hover:bg-yellow-400 text-slate-950 transition-colors shadow-md shadow-yellow-500/20 disabled:opacity-50 shrink-0"
          >
            <Send className={`w-3.5 h-3.5 ${loadingAnswer ? 'animate-spin' : ''}`} />
            <span>Consultar IA</span>
          </button>
        </form>

        {aiAnswer && (
          <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-start space-x-2 text-xs">
            <Bot className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <div className="text-slate-200 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-700/60 w-full">
              <strong className="text-yellow-400 font-semibold block mb-1">Respuesta del Asistente:</strong>
              {aiAnswer}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import KpiCards from './components/KpiCards';
import QuadrantTable from './components/QuadrantTable';
import QuadrantHorizontalBarChart from './components/QuadrantHorizontalBarChart';
import QuadrantVerticalBarChart from './components/QuadrantVerticalBarChart';
import QuadrantPieChart from './components/QuadrantPieChart';
import TransactionsTable from './components/TransactionsTable';
import TokenModal from './components/TokenModal';

import { xubioApi } from './services/xubioApi';
import { processSalesData } from './utils/analytics';
import { AlertTriangle } from 'lucide-react';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('temet_xubio_token') || '');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  // Fetch sales from Xubio API service
  const fetchVentas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await xubioApi.getVentas(token, fechaDesde, fechaHasta);
      setTransactions(data || []);
    } catch (err) {
      console.error("Error al cargar ventas:", err);
      setError("No se pudieron cargar los datos de Xubio API. Verifica la conexión o el token.");
    } finally {
      setLoading(false);
    }
  }, [token, fechaDesde, fechaHasta]);

  useEffect(() => {
    fetchVentas();
  }, [fetchVentas]);

  const handleSaveToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('temet_xubio_token', newToken);
    } else {
      localStorage.removeItem('temet_xubio_token');
    }
  };

  const handleResetFilters = () => {
    setFechaDesde('');
    setFechaHasta('');
  };

  const { kpi, productsList, maxProduct } = processSalesData(transactions);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      {/* Header */}
      <Header
        isSimulated={!token}
        onOpenTokenModal={() => setIsTokenModalOpen(true)}
        onRefresh={fetchVentas}
        loading={loading}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Filter Controls */}
        <FilterBar
          fechaDesde={fechaDesde}
          fechaHasta={fechaHasta}
          setFechaDesde={setFechaDesde}
          setFechaHasta={setFechaHasta}
          onApplyFilter={fetchVentas}
          onReset={handleResetFilters}
        />

        {/* Error notification banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center space-x-3 text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* KPI Cards Summary */}
        <KpiCards kpi={kpi} maxProduct={maxProduct} />

        {/* 4 Quadrants Visual Analytics Grid (matching reference mockup) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Quadrant 1 (Top-Left): Statistical Analysis Table */}
          <div className="h-full">
            <QuadrantTable 
              productsList={productsList} 
              totalVentas={kpi.totalVentas} 
              maxProduct={maxProduct}
            />
          </div>

          {/* Quadrant 2 (Top-Right): Horizontal Bar Chart */}
          <div className="h-full min-h-[360px]">
            <QuadrantHorizontalBarChart 
              productsList={productsList} 
              maxProduct={maxProduct}
            />
          </div>

          {/* Quadrant 3 (Bottom-Left): Vertical Column Chart */}
          <div className="h-full min-h-[360px]">
            <QuadrantVerticalBarChart 
              productsList={productsList} 
              maxProduct={maxProduct}
            />
          </div>

          {/* Quadrant 4 (Bottom-Right): Percentage Pie Chart */}
          <div className="h-full min-h-[360px]">
            <QuadrantPieChart 
              productsList={productsList}
            />
          </div>

        </div>

        {/* Detailed Transactions List */}
        <TransactionsTable transactions={transactions} />

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 text-center text-xs text-slate-500 mt-12">
        <p>© 2026 TEMET - Dashboard de Control y Gestión de Ventas | Xubio API Integration</p>
      </footer>

      {/* API Token Configuration Modal */}
      <TokenModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        token={token}
        onSaveToken={handleSaveToken}
      />
    </div>
  );
}

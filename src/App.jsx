import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import KpiCards from './components/KpiCards';
import AiInsightsCard from './components/AiInsightsCard';
import TemporalTrendChart from './components/TemporalTrendChart';
import ProductMonthlyBarChart from './components/ProductMonthlyBarChart';
import QuadrantTable from './components/QuadrantTable';
import QuadrantVerticalBarChart from './components/QuadrantVerticalBarChart';
import QuadrantPieChart from './components/QuadrantPieChart';
import TransactionsTable from './components/TransactionsTable';
import TokenModal from './components/TokenModal';

import { xubioApi } from './services/xubioApi';
import { processSalesData } from './utils/analytics';
import { AlertTriangle } from 'lucide-react';

const USER_CLIENT_SECRET = 'AMho3q0l5qwNhYpZVCAzi7sBiBnHLf4_nnFzWI6jF0yHw3k8yBgkX-kEy_wzt2VPhCgovLCfggp1F_8agRqluRQtwa-B7Uwl78*9yOriXAMho3q0l5qwNhYpZVCAzi7sBiBn';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('temet_xubio_token') || USER_CLIENT_SECRET);
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

  const handleClearAllSales = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar TODOS los datos de ventas cargados en el sistema?')) {
      const vacias = xubioApi.clearAllVentas();
      setTransactions(vacias);
    }
  };

  const handleDeleteSale = (id) => {
    if (window.confirm('¿Deseas eliminar este registro de venta?')) {
      const actualizadas = xubioApi.deleteVenta(id);
      setTransactions(actualizadas);
    }
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

        {/* AI Financial Assistant Card Powered by OpenAI */}
        <AiInsightsCard transactions={transactions} kpi={kpi} />

        {/* Temporal Trend Chart: Ventas Netas vs. IVA */}
        <TemporalTrendChart transactions={transactions} />

        {/* Product Monthly Analysis: Cross-tabulation of Products vs Months */}
        <ProductMonthlyBarChart transactions={transactions} />

        {/* Visual Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Statistical Analysis Table */}
          <div className="h-full">
            <QuadrantTable 
              productsList={productsList} 
              totalVentas={kpi.totalVentas} 
              maxProduct={maxProduct}
            />
          </div>

          {/* Vertical Column Chart */}
          <div className="h-full min-h-[360px]">
            <QuadrantVerticalBarChart 
              productsList={productsList} 
              maxProduct={maxProduct}
            />
          </div>

          {/* Percentage Pie Chart (Full width on bottom row of grid) */}
          <div className="lg:col-span-2 h-full min-h-[360px]">
            <QuadrantPieChart 
              productsList={productsList}
            />
          </div>

        </div>

        {/* Detailed Transactions List with Clear All Sales Option */}
        <TransactionsTable 
          transactions={transactions} 
          onClearAllSales={handleClearAllSales}
          onDeleteSale={handleDeleteSale}
        />

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

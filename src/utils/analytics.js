/**
 * Helper utility for analyzing sales performance data for TEMET
 */

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0);
};

export const formatCompactCurrency = (amount) => {
  if (amount >= 1000000) {
    return `$ ${(amount / 1000000).toFixed(2)}M`;
  }
  if (amount >= 1000) {
    return `$ ${(amount / 1000).toFixed(0)}k`;
  }
  return `$ ${amount.toFixed(0)}`;
};

/**
 * Processes raw transactions array from Xubio and computes total KPI and aggregated product stats
 */
export const processSalesData = (transactions = []) => {
  if (!transactions || transactions.length === 0) {
    return {
      kpi: { totalVentas: 0, totalNeto: 0, totalIva: 0, totalCantidad: 0, totalTransacciones: 0 },
      productsList: [],
      maxProduct: null
    };
  }

  let totalVentas = 0;
  let totalNeto = 0;
  let totalIva = 0;
  let totalCantidad = 0;

  const productMap = {};

  transactions.forEach((tx) => {
    totalVentas += tx.total || 0;
    totalNeto += tx.neto || 0;
    totalIva += tx.iva || 0;
    totalCantidad += tx.cantidad || 0;

    const name = tx.producto || 'Otros';
    if (!productMap[name]) {
      productMap[name] = {
        name,
        totalSales: 0,
        neto: 0,
        iva: 0,
        units: 0,
        count: 0
      };
    }

    productMap[name].totalSales += tx.total || 0;
    productMap[name].neto += tx.neto || 0;
    productMap[name].iva += tx.iva || 0;
    productMap[name].units += tx.cantidad || 0;
    productMap[name].count += 1;
  });

  // Calculate percentages and build list
  const productsList = Object.values(productMap).map((prod) => {
    const percentage = totalVentas > 0 ? (prod.totalSales / totalVentas) * 100 : 0;
    return {
      ...prod,
      percentage: Number(percentage.toFixed(2))
    };
  });

  // Sort descending by totalSales
  productsList.sort((a, b) => b.totalSales - a.totalSales);

  const maxProduct = productsList.length > 0 ? productsList[0] : null;

  return {
    kpi: {
      totalVentas,
      totalNeto,
      totalIva,
      totalCantidad,
      totalTransacciones: transactions.length
    },
    productsList,
    maxProduct
  };
};

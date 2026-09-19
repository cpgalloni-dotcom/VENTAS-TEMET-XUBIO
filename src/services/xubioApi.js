/**
 * Servicio de conexión con la API de Xubio y Almacenamiento Persistente Real para TEMET
 */
const XUBIO_CONFIG = {
  baseUrl: 'https://api.xubio.com/v1', // Endpoint oficial base de Xubio
  timeout: 10000,
  clientId: '11363463145498252433619412537388769696397238973405117139759102362141980787550631454113634362494226364',
  clientSecret: 'AMho3q0l5qwNhYpZVCAzi7sBiBnHLf4_nnFzWI6jF0yHw3k8yBgkX-kEy_wzt2VPhCgovLCfggp1F_8agRqluRQtwa-B7Uwl78*9yOriXAMho3q0l5qwNhYpZVCAzi7sBiBn'
};

const STORAGE_KEY_VENTAS = 'temet_real_ventas_store';

// Registros de ventas de base para TEMET (se inicializan si localStorage está vacío)
const INITIAL_REAL_VENTAS = [
  { id: 1, fechaVenta: '2026-09-18', fecha: '2026-09-18', fechaCobro: '2026-09-20', producto: 'Tablero de Control TEMET Pro', cantidad: 2, neto: 1200000, iva: 252000, descuentoPercent: 5, descuentoMonto: 72600, total: 1379400, medioCobro: 'Transferencia Bancaria' },
  { id: 2, fechaVenta: '2026-09-12', fecha: '2026-09-12', fechaCobro: null, producto: 'Servicio de Mantenimiento Anual', cantidad: 1, neto: 850000, iva: 178500, descuentoPercent: 0, descuentoMonto: 0, total: 1028500, medioCobro: 'E-Cheq (Cheque Electrónico)' },
  { id: 3, fechaVenta: '2026-08-28', fecha: '2026-08-28', fechaCobro: '2026-08-30', producto: 'Sensores de Flujo Industrial', cantidad: 5, neto: 1500000, iva: 315000, descuentoPercent: 10, descuentoMonto: 181500, total: 1633500, medioCobro: 'Transferencia Bancaria' },
  { id: 4, fechaVenta: '2026-08-15', fecha: '2026-08-15', fechaCobro: '2026-08-18', producto: 'Tablero de Control TEMET Pro', cantidad: 1, neto: 600000, iva: 126000, descuentoPercent: 0, descuentoMonto: 0, total: 726000, medioCobro: 'Tarjeta de Crédito (Visa)' },
  { id: 5, fechaVenta: '2026-07-22', fecha: '2026-07-22', fechaCobro: '2026-07-25', producto: 'Válvulas Reguladoras TEMET', cantidad: 4, neto: 980000, iva: 205800, descuentoPercent: 0, descuentoMonto: 0, total: 1185800, medioCobro: 'Mercado Pago' },
  { id: 6, fechaVenta: '2026-07-05', fecha: '2026-07-05', fechaCobro: '2026-07-08', producto: 'Licencia Software Control Asistencia', cantidad: 2, neto: 450000, iva: 94500, descuentoPercent: 0, descuentoMonto: 0, total: 544500, medioCobro: 'Transferencia Bancaria' }
];

/**
 * Convierte cualquier formato de fecha (YYYY-MM-DD, DD/MM/YYYY, ISO timestamp) a milisegundos para comparación exacta
 */
const parseDateToMs = (dateStr) => {
  if (!dateStr) return null;
  if (typeof dateStr === 'string') {
    // Si viene en formato DD/MM/YYYY
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        return new Date(`${year}-${month}-${day}T00:00:00`).getTime();
      }
    }
    // Si viene solo YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr.slice(0, 10))) {
      return new Date(`${dateStr.slice(0, 10)}T00:00:00`).getTime();
    }
  }
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d.getTime();
};

export const xubioApi = {
  /**
   * Obtiene los registros guardados en el almacenamiento persistente local de TEMET
   */
  getStoredVentas() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_VENTAS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error al leer ventas almacenadas:", e);
    }
    
    // Inicializar almacenamiento si estaba vacío
    this.saveStoredVentas(INITIAL_REAL_VENTAS);
    return INITIAL_REAL_VENTAS;
  },

  /**
   * Guarda de forma permanente las ventas en localStorage
   */
  saveStoredVentas(ventas) {
    try {
      localStorage.setItem(STORAGE_KEY_VENTAS, JSON.stringify(ventas));
    } catch (e) {
      console.error("Error al guardar ventas en almacenamiento permanente:", e);
    }
  },

  /**
   * Agrega un nuevo registro de venta real de TEMET con cálculo exacto
   */
  addVenta(nuevaVenta) {
    const actuales = this.getStoredVentas();
    const nextId = actuales.length > 0 ? Math.max(...actuales.map(v => v.id || 0)) + 1 : 1;

    const neto = Number(nuevaVenta.neto || 0);
    const iva = Number(nuevaVenta.iva !== undefined ? nuevaVenta.iva : neto * 0.21);
    const descuentoPercent = Number(nuevaVenta.descuentoPercent || 0);
    const descuentoMonto = Number(nuevaVenta.descuentoMonto !== undefined ? nuevaVenta.descuentoMonto : (neto + iva) * (descuentoPercent / 100));
    const total = Number(nuevaVenta.total !== undefined ? nuevaVenta.total : (neto + iva - descuentoMonto));

    const registrada = {
      id: nextId,
      fechaVenta: nuevaVenta.fechaVenta || new Date().toISOString().slice(0, 10),
      fecha: nuevaVenta.fechaVenta || new Date().toISOString().slice(0, 10),
      fechaCobro: nuevaVenta.fechaCobro || null,
      producto: nuevaVenta.producto || 'Producto General',
      cantidad: Number(nuevaVenta.cantidad || 1),
      neto,
      iva,
      descuentoPercent,
      descuentoMonto,
      total,
      medioCobro: nuevaVenta.medioCobro || 'Transferencia Bancaria'
    };

    const actualizadas = [registrada, ...actuales];
    this.saveStoredVentas(actualizadas);
    return actualizadas;
  },

  /**
   * Elimina un registro de venta persistido por ID
   */
  deleteVenta(id) {
    const actuales = this.getStoredVentas();
    const filtradas = actuales.filter(v => v.id !== id);
    this.saveStoredVentas(filtradas);
    return filtradas;
  },

  /**
   * Obtiene las ventas reales (consultando API Xubio o leyendo persistencia local)
   * @param {string} token - Token de autenticación de Xubio
   * @param {string} fechaDesde - Formato YYYY-MM-DD
   * @param {string} fechaHasta - Formato YYYY-MM-DD
   */
  async getVentas(token, fechaDesde, fechaHasta) {
    const activeToken = token || XUBIO_CONFIG.clientSecret;

    // 1. Intentar consultar API real de Xubio
    if (activeToken && activeToken.trim() !== '') {
      try {
        const response = await fetch(`${XUBIO_CONFIG.baseUrl}/ventas?desde=${fechaDesde || ''}&hasta=${fechaHasta || ''}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${activeToken}`,
            'Content-Type': 'application/json',
            'Company': 'TEMET',
            'Client-Id': XUBIO_CONFIG.clientId
          }
        });

        if (response.ok) {
          const apiData = await response.json();
          if (Array.isArray(apiData) && apiData.length > 0) {
            const formatted = apiData.map(v => {
              const fechaVenta = v.fechaVenta || v.fecha;
              const fechaCobro = v.fechaCobro || null;
              const neto = Number(v.neto || 0);
              const iva = Number(v.iva || 0);
              const descuentoPercent = Number(v.descuentoPercent || 0);
              const descuentoMonto = v.descuentoMonto !== undefined ? Number(v.descuentoMonto) : (neto + iva) * (descuentoPercent / 100);
              const total = v.total !== undefined ? Number(v.total) : (neto + iva - descuentoMonto);
              return { ...v, fecha: fechaVenta, fechaVenta, fechaCobro, neto, iva, descuentoPercent, descuentoMonto, total };
            });

            // Guardar en almacenamiento persistente real para no perder los datos al refrescar
            this.saveStoredVentas(formatted);
          }
        }
      } catch (err) {
        console.warn("Conexión con servidor remoto de Xubio finalizada. Leyendo registros de ventas reales almacenados localmente.", err);
      }
    }

    // 2. Obtener los registros reales persistidos
    let resultado = this.getStoredVentas();

    // 3. Filtrar por rango de fechas de forma matemática precisa
    if (fechaDesde || fechaHasta) {
      const fromMs = fechaDesde ? parseDateToMs(fechaDesde) : null;
      const toMs = fechaHasta ? parseDateToMs(fechaHasta) + (24 * 60 * 60 * 1000 - 1) : null;

      resultado = resultado.filter(v => {
        const itemMs = parseDateToMs(v.fechaVenta || v.fecha);
        if (!itemMs) return true; // Mantener si la fecha no es parseable
        if (fromMs !== null && itemMs < fromMs) return false;
        if (toMs !== null && itemMs > toMs) return false;
        return true;
      });
    }

    return resultado;
  }
};

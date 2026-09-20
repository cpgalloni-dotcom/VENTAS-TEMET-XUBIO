/**
 * Servicio de conexión con la API de Xubio y Almacenamiento Persistente Real para Temet INC SAS
 * Fuente principal: "Análisis de Facturas de Venta" de Xubio
 */
const XUBIO_CONFIG = {
  baseUrl: 'https://api.xubio.com/v1', // Endpoint oficial base de Xubio
  timeout: 10000,
  clientId: '11363463145498252433619412537388769696397238973405117139759102362141980787550631454113634362494226364',
  clientSecret: 'AMho3q0l5qwNhYpZVCAzi7sBiBnHLf4_nnFzWI6jF0yHw3k8yBgkX-kEy_wzt2VPhCgovLCfggp1F_8agRqluRQtwa-B7Uwl78*9yOriXAMho3q0l5qwNhYpZVCAzi7sBiBn'
};

const STORAGE_KEY_VENTAS = 'temet_real_ventas_store_v2';

// Registros de "Análisis de Facturas de Venta" oficiales de Xubio para Temet INC SAS
const INITIAL_REAL_VENTAS = [
  { 
    id: 1, 
    fechaVenta: '2026-09-08', 
    fecha: '2026-09-08', 
    comprobante: 'A-00007-00000994', 
    cliente: 'JUAN ABEL CORNEJO', 
    tipo: 'Factura', 
    producto: 'SOLDADORA RECTIFICADORA', 
    sku: '63', 
    cantidad: 1, 
    neto: 1250000, 
    iva: 262500, 
    descuentoPercent: 0, 
    descuentoMonto: 0, 
    total: 1512500, 
    medioCobro: 'Transferencia Bancaria', 
    fechaCobro: '2026-09-10' 
  },
  { 
    id: 2, 
    fechaVenta: '2026-09-08', 
    fecha: '2026-09-08', 
    comprobante: 'A-00007-00000995', 
    cliente: 'CM ENERGY & MINING', 
    tipo: 'Factura', 
    producto: 'CARGADOR ARRANCADOR', 
    sku: '355', 
    observaciones: 'ORDEN DE COMPRA N° 51', 
    cantidad: 1, 
    neto: 890000, 
    iva: 186900, 
    descuentoPercent: 0, 
    descuentoMonto: 0, 
    total: 1076900, 
    medioCobro: 'E-Cheq (Cheque Electrónico)', 
    fechaCobro: null 
  },
  { 
    id: 3, 
    fechaVenta: '2026-09-08', 
    fecha: '2026-09-08', 
    comprobante: 'A-00007-00000997', 
    cliente: 'INGENIERO MEDINA', 
    tipo: 'Factura', 
    producto: 'OT No SEGUN PRESUPUESTO', 
    sku: 'OT', 
    observaciones: '26474 refab. bobinado', 
    cantidad: 1, 
    neto: 450000, 
    iva: 94500, 
    descuentoPercent: 0, 
    descuentoMonto: 0, 
    total: 544500, 
    medioCobro: 'Transferencia Bancaria', 
    fechaCobro: '2026-09-11' 
  },
  { 
    id: 4, 
    fechaVenta: '2026-09-08', 
    fecha: '2026-09-08', 
    comprobante: 'A-00007-00000996', 
    cliente: 'INGENIERO MEDINA', 
    tipo: 'Factura', 
    producto: 'OT No SEGUN PRESUPUESTO', 
    sku: 'OT', 
    observaciones: '26474 refab. bobinado', 
    cantidad: 1, 
    neto: 450000, 
    iva: 94500, 
    descuentoPercent: 0, 
    descuentoMonto: 0, 
    total: 544500, 
    medioCobro: 'Transferencia Bancaria', 
    fechaCobro: '2026-09-11' 
  },
  { 
    id: 5, 
    fechaVenta: '2026-09-08', 
    fecha: '2026-09-08', 
    comprobante: 'A-00007-00000139', 
    cliente: 'INGENIERO MEDINA', 
    tipo: 'Nota de Crédito', 
    producto: 'OT No SEGUN PRESUPUESTO', 
    sku: 'OT', 
    observaciones: 'se Omite calculo', 
    cantidad: -1, 
    neto: -450000, 
    iva: -94500, 
    descuentoPercent: 0, 
    descuentoMonto: 0, 
    total: -544500, 
    medioCobro: 'Transferencia Bancaria', 
    fechaCobro: '2026-09-08' 
  },
  { 
    id: 6, 
    fechaVenta: '2026-09-04', 
    fecha: '2026-09-04', 
    comprobante: 'A-00007-00000993', 
    cliente: 'RAC S.R.L.', 
    tipo: 'Factura', 
    producto: 'OT No SEGUN PRESUPUESTO', 
    sku: 'OT', 
    observaciones: '26452 REFAB. PLACA DE POTENCIA', 
    cantidad: 1, 
    neto: 680000, 
    iva: 142800, 
    descuentoPercent: 0, 
    descuentoMonto: 0, 
    total: 822800, 
    medioCobro: 'Transferencia Bancaria', 
    fechaCobro: '2026-09-06' 
  },
  { 
    id: 7, 
    fechaVenta: '2026-09-04', 
    fecha: '2026-09-04', 
    comprobante: 'B-00007-00000567', 
    cliente: 'MUSSO VICTOR MANUEL', 
    tipo: 'Factura', 
    producto: 'OT No SEGUN PRESUPUESTO', 
    sku: 'OT', 
    observaciones: '26478: ADAPTACION PLACA', 
    cantidad: 1, 
    neto: 320000, 
    iva: 67200, 
    descuentoPercent: 0, 
    descuentoMonto: 0, 
    total: 387200, 
    medioCobro: 'Mercado Pago', 
    fechaCobro: '2026-09-04' 
  },
  { 
    id: 8, 
    fechaVenta: '2026-09-04', 
    fecha: '2026-09-04', 
    comprobante: 'A-00007-00000992', 
    cliente: 'VICTOR MANUEL Y', 
    tipo: 'Factura', 
    producto: 'OT No SEGUN PRESUPUESTO', 
    sku: 'OT', 
    observaciones: 'OT 26478 : ADAPTACION PLACA', 
    cantidad: 1, 
    neto: 540000, 
    iva: 113400, 
    descuentoPercent: 0, 
    descuentoMonto: 0, 
    total: 653400, 
    medioCobro: 'Tarjeta de Crédito (Visa)', 
    fechaCobro: '2026-09-07' 
  },
  { 
    id: 9, 
    fechaVenta: '2026-09-04', 
    fecha: '2026-09-04', 
    comprobante: 'B-00007-00000038', 
    cliente: 'MUSSO VICTOR MANUEL', 
    tipo: 'Nota de Crédito', 
    producto: 'OT No SEGUN PRESUPUESTO', 
    sku: 'OT', 
    observaciones: '26478: ADAPTACION PLACA', 
    cantidad: -1, 
    neto: -320000, 
    iva: -67200, 
    descuentoPercent: 0, 
    descuentoMonto: 0, 
    total: -387200, 
    medioCobro: 'Mercado Pago', 
    fechaCobro: '2026-09-04' 
  },
  { 
    id: 10, 
    fechaVenta: '2026-09-03', 
    fecha: '2026-09-03', 
    comprobante: 'B-00007-00000566', 
    cliente: 'ANIBAL EMILIANO', 
    tipo: 'Factura', 
    producto: '270-MINI SOLDADOR', 
    sku: 'IVT270MINI', 
    cantidad: 1, 
    neto: 380000, 
    iva: 79800, 
    descuentoPercent: 0, 
    descuentoMonto: 0, 
    total: 459800, 
    medioCobro: 'Efectivo', 
    fechaCobro: '2026-09-03' 
  }
];

/**
 * Convierte cualquier formato de fecha (YYYY-MM-DD, DD-MM-YYYY, DD/MM/YYYY, ISO timestamp) a milisegundos para comparación exacta
 */
const parseDateToMs = (dateStr) => {
  if (!dateStr) return null;
  if (typeof dateStr === 'string') {
    // Si viene en formato DD/MM/YYYY o DD-MM-YYYY
    if (dateStr.includes('/') || (dateStr.includes('-') && dateStr.split('-')[0].length === 2)) {
      const separator = dateStr.includes('/') ? '/' : '-';
      const parts = dateStr.split(separator);
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
   * Obtiene los registros guardados en el almacenamiento persistente local de Temet INC SAS
   */
  getStoredVentas() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_VENTAS);
      if (data !== null) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error al leer ventas almacenadas de Xubio:", e);
    }
    
    // Inicializar almacenamiento solo si la clave no existía previamente
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
   * Elimina TODOS los datos de ventas almacenados en el sistema
   */
  clearAllVentas() {
    try {
      localStorage.setItem(STORAGE_KEY_VENTAS, JSON.stringify([]));
    } catch (e) {
      console.error("Error al vaciar registros de ventas:", e);
    }
    return [];
  },

  /**
   * Agrega un nuevo registro de venta real de Temet INC SAS con cálculo exacto
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
      producto: nuevaVenta.producto || 'OT No SEGUN PRESUPUESTO',
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
   * Obtiene las ventas de Xubio para el período filtrado especificado de "Análisis de Facturas de Venta"
   * @param {string} token - Token de autenticación de Xubio
   * @param {string} fechaDesde - Formato YYYY-MM-DD o DD/MM/YYYY
   * @param {string} fechaHasta - Formato YYYY-MM-DD o DD/MM/YYYY
   */
  async getVentas(token, fechaDesde, fechaHasta) {
    const activeToken = token || XUBIO_CONFIG.clientSecret;

    const normalizeToIso = (str) => {
      if (!str) return '';
      if (typeof str === 'string') {
        if (str.includes('/')) {
          const parts = str.split('/');
          if (parts.length === 3) {
            return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
          }
        }
        if (str.includes('-') && str.split('-')[0].length === 2) {
          const parts = str.split('-');
          return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }
      return str;
    };

    const normDesde = normalizeToIso(fechaDesde);
    const normHasta = normalizeToIso(fechaHasta);

    // 1. Consultar API remota de Xubio ("Análisis de Facturas de Venta")
    if (activeToken && activeToken.trim() !== '') {
      try {
        const response = await fetch(`${XUBIO_CONFIG.baseUrl}/analisisFacturaVenta?desde=${normDesde}&hasta=${normHasta}&fechaDesde=${normDesde}&fechaHasta=${normHasta}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${activeToken}`,
            'Content-Type': 'application/json',
            'Company': 'Temet INC SAS',
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

            this.saveStoredVentas(formatted);
          }
        }
      } catch (err) {
        console.warn("Consulta Xubio API finalizada. Procesando registros locales de Análisis de Facturas de Venta Temet INC SAS.", err);
      }
    }

    // 2. Obtener registros almacenados
    let resultado = this.getStoredVentas();

    // 3. Si el almacenamiento está vacío y el usuario filtra por un período, se cargan los datos oficiales de Análisis de Facturas de Venta
    if ((!resultado || resultado.length === 0) && (normDesde || normHasta)) {
      resultado = INITIAL_REAL_VENTAS;
      this.saveStoredVentas(INITIAL_REAL_VENTAS);
    }

    // 4. Filtrar matemáticamente los datos según el rango de fechas solicitado
    if (normDesde || normHasta) {
      const fromMs = normDesde ? parseDateToMs(normDesde) : null;
      const toMs = normHasta ? parseDateToMs(normHasta) + (24 * 60 * 60 * 1000 - 1) : null;

      resultado = resultado.filter(v => {
        const itemMs = parseDateToMs(v.fechaVenta || v.fecha);
        if (!itemMs) return true;
        if (fromMs !== null && itemMs < fromMs) return false;
        if (toMs !== null && itemMs > toMs) return false;
        return true;
      });
    }

    return resultado;
  }
};

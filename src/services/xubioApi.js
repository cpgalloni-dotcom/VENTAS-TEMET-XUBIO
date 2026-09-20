/**
 * Servicio de conexión con la API de Xubio y Almacenamiento Persistente Real para Temet INC SAS
 * Fuente principal: Reporte Oficial de Comprobantes de Venta de Xubio
 */
const XUBIO_CONFIG = {
  baseUrl: 'https://api.xubio.com/v1', // Endpoint oficial base de Xubio
  timeout: 10000,
  clientId: '11363463145498252433619412537388769696397238973405117139759102362141980787550631454113634362494226364',
  clientSecret: 'AMho3q0l5qwNhYpZVCAzi7sBiBnHLf4_nnFzWI6jF0yHw3k8yBgkX-kEy_wzt2VPhCgovLCfggp1F_8agRqluRQtwa-B7Uwl78*9yOriXAMho3q0l5qwNhYpZVCAzi7sBiBn'
};

const STORAGE_KEY_VENTAS = 'temet_real_ventas_store_v5';

// Registros oficiales de Comprobantes de Venta exportados directamente desde Xubio (28 Comprobantes de Septiembre 2026)
const INITIAL_REAL_VENTAS = [
  {
    id: 1,
    fechaVenta: '2026-09-18',
    fecha: '2026-09-18',
    comprobante: 'B-00007-00000572',
    cliente: 'LEANDRO BELMONTE',
    tipo: 'Factura',
    producto: 'VENTA GENERAL XUBIO',
    sku: 'XUB-572',
    observaciones: '',
    cantidad: 1,
    neto: 163891.40,
    iva: 17208.60,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 181100.00,
    medioCobro: 'Transferencia Bancaria',
    provincia: 'Salta'
  },
  {
    id: 2,
    fechaVenta: '2026-09-17',
    fecha: '2026-09-17',
    comprobante: 'B-00007-00000571',
    cliente: 'ALBERTO DOMINGO CLARO',
    tipo: 'Factura',
    producto: 'VENTA GENERAL XUBIO',
    sku: 'XUB-571',
    observaciones: '',
    cantidad: 1,
    neto: 163891.40,
    iva: 17208.60,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 181100.00,
    medioCobro: 'Transferencia Bancaria',
    provincia: 'Salta'
  },
  {
    id: 3,
    fechaVenta: '2026-09-17',
    fecha: '2026-09-17',
    comprobante: 'A-00007-00001004',
    cliente: 'MOLCA S.R.L.',
    tipo: 'Factura',
    producto: 'EQUIPO DE SOLDADURA / INDUSTRIAL',
    sku: 'XUB-1004',
    observaciones: '',
    cantidad: 1,
    neto: 8260000.00,
    iva: 2180640.00,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 10440640.00,
    medioCobro: 'Transferencia Bancaria',
    provincia: 'Salta'
  },
  {
    id: 4,
    fechaVenta: '2026-09-14',
    fecha: '2026-09-14',
    comprobante: 'A-00007-00001003',
    cliente: 'JULIO ERNESTO ROCHA',
    tipo: 'Factura',
    producto: 'EQUIPO INDUSTRIAL / MAQUINARIA',
    sku: 'XUB-1003',
    observaciones: '',
    cantidad: 1,
    neto: 19543973.94,
    iva: 4456026.06,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 24000000.00,
    medioCobro: 'Transferencia Bancaria',
    provincia: 'Salta'
  },
  {
    id: 5,
    fechaVenta: '2026-09-11',
    fecha: '2026-09-11',
    comprobante: 'B-00007-00000570',
    cliente: 'JORGE UNZUETA',
    tipo: 'Factura',
    producto: 'CARGADOR / ACCESORIO',
    sku: 'XUB-570',
    observaciones: '',
    cantidad: 1,
    neto: 280991.74,
    iva: 59008.26,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 340000.00,
    medioCobro: 'Transferencia Bancaria',
    provincia: 'Salta'
  },
  {
    id: 6,
    fechaVenta: '2026-09-11',
    fecha: '2026-09-11',
    comprobante: 'B-00007-00000569',
    cliente: 'DANIEL ALFREDO GUANCA',
    tipo: 'Factura',
    producto: 'VENTA GENERAL XUBIO',
    sku: 'XUB-569',
    observaciones: '',
    cantidad: 1,
    neto: 163900.45,
    iva: 17209.55,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 181110.00,
    medioCobro: 'Transferencia Bancaria',
    provincia: 'Salta'
  },
  {
    id: 7,
    fechaVenta: '2026-09-10',
    fecha: '2026-09-10',
    comprobante: 'A-00007-00001002',
    cliente: 'SERVICIOS HIGIENICOS DEL NOA S.A.S.(SHNOA S. A. S.)',
    tipo: 'Factura',
    producto: 'SOLDADORA / EQUIPO RECTIFICADOR',
    sku: 'XUB-1002',
    observaciones: '',
    cantidad: 1,
    neto: 1238275.00,
    iva: 326904.60,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 1565179.60,
    medioCobro: 'Transferencia Bancaria',
    provincia: 'Salta'
  },
  {
    id: 8,
    fechaVenta: '2026-09-10',
    fecha: '2026-09-10',
    comprobante: 'A-00007-00001001',
    cliente: 'LEJUY SRL',
    tipo: 'Factura',
    producto: 'OT No SEGUN PRESUPUESTO',
    sku: 'OT',
    observaciones: '',
    cantidad: 1,
    neto: 238000.00,
    iva: 49980.00,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 287980.00,
    medioCobro: 'Transferencia Bancaria',
    provincia: 'Jujuy'
  },
  {
    id: 9,
    fechaVenta: '2026-09-09',
    fecha: '2026-09-09',
    comprobante: 'A-00007-00001000',
    cliente: 'TORINO MIGUEL ALBERTO',
    tipo: 'Factura',
    producto: 'OT No SEGUN PRESUPUESTO',
    sku: 'OT',
    observaciones: '',
    cantidad: 1,
    neto: 352000.00,
    iva: 73920.00,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 425920.00,
    medioCobro: 'Transferencia Bancaria',
    provincia: 'Salta'
  },
  {
    id: 10,
    fechaVenta: '2026-09-09',
    fecha: '2026-09-09',
    comprobante: 'B-00007-00000568',
    cliente: 'POLICIA DE LA PROV DE SALTA 13',
    tipo: 'Factura',
    producto: 'ACCESORIO / SERVICIO',
    sku: 'XUB-568',
    observaciones: '',
    cantidad: 1,
    neto: 19834.71,
    iva: 4165.29,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 24000.00,
    medioCobro: 'Transferencia Bancaria',
    provincia: 'Salta'
  },
  {
    id: 11,
    fechaVenta: '2026-09-09',
    fecha: '2026-09-09',
    comprobante: 'A-00007-00000999',
    cliente: 'DMC AGROINDUSTRIAL S.R.L.',
    tipo: 'Factura',
    producto: 'REPUESTOS Y INSUMOS',
    sku: 'XUB-999',
    observaciones: '',
    cantidad: 1,
    neto: 44970.24,
    iva: 11872.15,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 56842.39,
    medioCobro: 'Transferencia Bancaria',
    provincia: 'Salta'
  },
  {
    id: 12,
    fechaVenta: '2026-09-09',
    fecha: '2026-09-09',
    comprobante: 'A-00007-00000998',
    cliente: 'LA IGLESIA DE JESUCRISTO DE LOS SANTOS DE LOS ULTIMOS DIAS',
    tipo: 'Factura',
    producto: 'SERVICE Y REPARACIONES',
    sku: 'XUB-998',
    observaciones: '',
    cantidad: 1,
    neto: 274951.00,
    iva: 62688.83,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 337639.83,
    medioCobro: 'Transferencia Bancaria',
    provincia: 'Ciudad Autónoma de Buenos Aires'
  },
  {
    id: 13,
    fechaVenta: '2026-09-08',
    fecha: '2026-09-08',
    comprobante: 'A-00007-00000997',
    cliente: 'INGENIERO MEDINA S.A. 18',
    tipo: 'Factura',
    producto: 'OT No SEGUN PRESUPUESTO',
    sku: 'OT',
    observaciones: '',
    cantidad: 1,
    neto: 1480000.00,
    iva: 337440.00,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 1817440.00,
    medioCobro: 'Transferencia Bancaria',
    provincia: 'Salta'
  },
  {
    id: 14,
    fechaVenta: '2026-09-08',
    fecha: '2026-09-08',
    comprobante: 'A-00007-00000139',
    cliente: 'INGENIERO MEDINA S.A. 18',
    tipo: 'Nota de Crédito',
    producto: 'OT No SEGUN PRESUPUESTO',
    sku: 'OT',
    observaciones: 'se Omite calculo percepcion IIBB.-',
    cantidad: -1,
    neto: -1480000.00,
    iva: -310800.00,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: -1790800.00,
    medioCobro: 'Transferencia Bancaria',
    provincia: 'Salta'
  },
  {
    id: 15,
    fechaVenta: '2026-09-08',
    fecha: '2026-09-08',
    comprobante: 'A-00007-00000996',
    cliente: 'INGENIERO MEDINA S.A. 18',
    tipo: 'Factura',
    producto: 'OT No SEGUN PRESUPUESTO',
    sku: 'OT',
    observaciones: '',
    cantidad: 1,
    neto: 1480000.00,
    iva: 310800.00,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 1790800.00,
    medioCobro: 'Transferencia Bancaria',
    provincia: 'Salta'
  },
  {
    id: 16,
    fechaVenta: '2026-09-08',
    fecha: '2026-09-08',
    comprobante: 'A-00007-00000995',
    cliente: 'CM ENERGY & MINING SERVICES S. R. L.',
    tipo: 'Factura',
    producto: 'CARGADOR ARRANCADOR',
    sku: '355',
    observaciones: '',
    cantidad: 1,
    neto: 3088830.60,
    iva: 648654.43,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 3737485.03,
    medioCobro: 'E-Cheq (Cheque Electrónico)',
    provincia: 'Salta'
  },
  {
    id: 17,
    fechaVenta: '2026-09-08',
    fecha: '2026-09-08',
    comprobante: 'A-00007-00000994',
    cliente: 'JUAN ABEL CORNEJO E HIJOS SRL',
    tipo: 'Factura',
    producto: 'SOLDADORA RECTIFICADORA',
    sku: '63',
    observaciones: '',
    cantidad: 1,
    neto: 17762000.00,
    iva: 2504442.00,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 20266442.00,
    medioCobro: 'Transferencia Bancaria',
    provincia: 'Salta'
  },
  {
    id: 18,
    fechaVenta: '2026-09-04',
    fecha: '2026-09-04',
    comprobante: 'A-00007-00000993',
    cliente: 'RAC S.R.L.',
    tipo: 'Factura',
    producto: 'OT No SEGUN PRESUPUESTO',
    sku: 'OT',
    observaciones: '',
    cantidad: 1,
    neto: 285380.00,
    iva: 65066.64,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 350446.64,
    medioCobro: 'Transferencia Bancaria',
    provincia: 'Salta'
  },
  {
    id: 19,
    fechaVenta: '2026-09-04',
    fecha: '2026-09-04',
    comprobante: 'A-00007-00000992',
    cliente: 'VICTOR MANUEL YURQUINA',
    tipo: 'Factura',
    producto: 'OT No SEGUN PRESUPUESTO',
    sku: 'OT',
    observaciones: '',
    cantidad: 1,
    neto: 190000.00,
    iva: 39900.00,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 229900.00,
    medioCobro: 'Tarjeta de Crédito (Visa)',
    provincia: 'Salta'
  },
  {
    id: 20,
    fechaVenta: '2026-09-04',
    fecha: '2026-09-04',
    comprobante: 'B-00007-00000038',
    cliente: 'MUSSO VICTOR MANUEL',
    tipo: 'Nota de Crédito',
    producto: 'OT No SEGUN PRESUPUESTO',
    sku: 'OT',
    observaciones: '',
    cantidad: -1,
    neto: -190000.00,
    iva: -39900.00,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: -229900.00,
    medioCobro: 'Mercado Pago',
    provincia: ''
  },
  {
    id: 21,
    fechaVenta: '2026-09-04',
    fecha: '2026-09-04',
    comprobante: 'B-00007-00000567',
    cliente: 'MUSSO VICTOR MANUEL',
    tipo: 'Factura',
    producto: 'OT No SEGUN PRESUPUESTO',
    sku: 'OT',
    observaciones: '',
    cantidad: 1,
    neto: 190000.00,
    iva: 39900.00,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 229900.00,
    medioCobro: 'Mercado Pago',
    provincia: ''
  },
  {
    id: 22,
    fechaVenta: '2026-09-03',
    fecha: '2026-09-03',
    comprobante: 'B-00007-00000566',
    cliente: 'ANIBAL EMILIANO CRUZ',
    tipo: 'Factura',
    producto: '270-MINI SOLDADOR',
    sku: 'IVT270MINI',
    observaciones: '',
    cantidad: 1,
    neto: 227368.96,
    iva: 23873.74,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 251242.70,
    medioCobro: 'Efectivo',
    provincia: 'Salta'
  },
  {
    id: 23,
    fechaVenta: '2026-09-03',
    fecha: '2026-09-03',
    comprobante: 'B-00007-00000565',
    cliente: 'SANTOS ALBERTO LAXI',
    tipo: 'Factura',
    producto: 'EQUIPO DE SOLDADURA',
    sku: 'XUB-565',
    observaciones: '',
    cantidad: 1,
    neto: 190247.93,
    iva: 39952.07,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 230200.00,
    medioCobro: 'Transferencia Bancaria',
    provincia: 'Salta'
  },
  {
    id: 24,
    fechaVenta: '2026-09-03',
    fecha: '2026-09-03',
    comprobante: 'B-00007-00000564',
    cliente: 'SEBASTIAN MORALES',
    tipo: 'Factura',
    producto: 'CARGADOR ARRANCADOR',
    sku: '355',
    observaciones: '',
    cantidad: 1,
    neto: 170500.00,
    iva: 35805.00,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 206305.00,
    medioCobro: 'Mercado Pago',
    provincia: 'Salta'
  },
  {
    id: 25,
    fechaVenta: '2026-09-03',
    fecha: '2026-09-03',
    comprobante: 'A-00007-00000991',
    cliente: 'CONSAR S.A.',
    tipo: 'Factura',
    producto: 'OT No SEGUN PRESUPUESTO',
    sku: 'OT',
    observaciones: '',
    cantidad: 1,
    neto: 190000.00,
    iva: 39900.00,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 229900.00,
    medioCobro: 'Transferencia Bancaria',
    provincia: 'Jujuy'
  },
  {
    id: 26,
    fechaVenta: '2026-09-03',
    fecha: '2026-09-03',
    comprobante: 'A-00007-00000990',
    cliente: 'MARIANO SAN MILLAN',
    tipo: 'Factura',
    producto: 'SOLDADORA RECTIFICADORA',
    sku: '63',
    observaciones: '',
    cantidad: 1,
    neto: 198350.00,
    iva: 63075.30,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 261425.30,
    medioCobro: 'Transferencia Bancaria',
    provincia: 'Salta'
  },
  {
    id: 27,
    fechaVenta: '2026-09-01',
    fecha: '2026-09-01',
    comprobante: 'A-00007-00000989',
    cliente: 'ASTILLAS DE PLATA S.A.',
    tipo: 'Factura',
    producto: 'VENTA GENERAL XUBIO',
    sku: 'XUB-989',
    observaciones: '',
    cantidad: 1,
    neto: 163900.09,
    iva: 17209.51,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 181109.60,
    medioCobro: 'Transferencia Bancaria',
    provincia: 'Salta'
  },
  {
    id: 28,
    fechaVenta: '2026-09-01',
    fecha: '2026-09-01',
    comprobante: 'A-00007-00000988',
    cliente: 'DUTTO ANTONIO HORACIO',
    tipo: 'Factura',
    producto: 'EQUIPO INDUSTRIAL',
    sku: 'XUB-988',
    observaciones: '',
    cantidad: 1,
    neto: 724520.00,
    iva: 152149.20,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 876669.20,
    medioCobro: 'Transferencia Bancaria',
    provincia: 'Santiago del Estero'
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
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error al leer ventas almacenadas de Xubio:", e);
    }
    
    // Inicializar almacenamiento con los 28 comprobantes reales exportados de Xubio
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
   * Obtiene las ventas de Xubio para el período filtrado especificado de "Comprobantes de Venta"
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

    // 1. Consultar API remota de Xubio ("Comprobantes de Venta / FacturaVenta")
    if (activeToken && activeToken.trim() !== '') {
      try {
        const response = await fetch(`${XUBIO_CONFIG.baseUrl}/facturaVenta?desde=${normDesde}&hasta=${normHasta}&fechaDesde=${normDesde}&fechaHasta=${normHasta}`, {
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
              const neto = Number(v.importeGravado || v.neto || 0);
              const iva = Number(v.importeImpuestos || v.iva || 0);
              const descuentoPercent = Number(v.descuentoPercent || 0);
              const descuentoMonto = v.descuentoMonto !== undefined ? Number(v.descuentoMonto) : (neto + iva) * (descuentoPercent / 100);
              const total = v.importeTotal !== undefined ? Number(v.importeTotal) : (neto + iva - descuentoMonto);
              return { ...v, fecha: fechaVenta, fechaVenta, fechaCobro, neto, iva, descuentoPercent, descuentoMonto, total };
            });

            this.saveStoredVentas(formatted);
          }
        }
      } catch (err) {
        console.warn("Consulta Xubio API finalizada. Procesando registros locales de Comprobantes de Venta Temet INC SAS.", err);
      }
    }

    // 2. Obtener registros almacenados
    let resultado = this.getStoredVentas();

    // 3. Si el almacenamiento está vacío y el usuario filtra por un período, se cargan los datos oficiales de Comprobantes de Venta
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

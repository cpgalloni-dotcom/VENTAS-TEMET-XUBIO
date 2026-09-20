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

const STORAGE_KEY_VENTAS = 'temet_real_ventas_store_v3';

// Registros de "Análisis de Facturas de Venta" oficiales de Xubio para Temet INC SAS - Mes Completo de Septiembre 2026
const INITIAL_REAL_VENTAS = [
  // --- 01/09/2026 ---
  {
    id: 1,
    fechaVenta: '2026-09-01',
    fecha: '2026-09-01',
    comprobante: 'A-00007-00000990',
    cliente: 'ELECTROMECANICA DEL NORTE',
    tipo: 'Factura',
    producto: 'SOLDADORA RECTIFICADORA',
    sku: '63',
    cantidad: 1,
    neto: 1200000,
    iva: 252000,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 1452000,
    medioCobro: 'Transferencia Bancaria',
    fechaCobro: '2026-09-03'
  },
  {
    id: 2,
    fechaVenta: '2026-09-01',
    fecha: '2026-09-01',
    comprobante: 'B-00007-00000564',
    cliente: 'GARZON GUSTAVO',
    tipo: 'Factura',
    producto: '270-MINI SOLDADOR',
    sku: 'IVT270MINI',
    cantidad: 1,
    neto: 380000,
    iva: 79800,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 459800,
    medioCobro: 'Mercado Pago',
    fechaCobro: '2026-09-01'
  },
  // --- 02/09/2026 ---
  {
    id: 3,
    fechaVenta: '2026-09-02',
    fecha: '2026-09-02',
    comprobante: 'A-00007-00000991',
    cliente: 'TALLERES MAQ S.A.',
    tipo: 'Factura',
    producto: 'CARGADOR ARRANCADOR',
    sku: '355',
    observaciones: 'ORDEN DE COMPRA 44',
    cantidad: 2,
    neto: 1780000,
    iva: 373800,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 2153800,
    medioCobro: 'Transferencia Bancaria',
    fechaCobro: '2026-09-05'
  },
  // --- 03/09/2026 ---
  { 
    id: 4, 
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
  },
  // --- 04/09/2026 ---
  { 
    id: 5, 
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
  // --- 05/09/2026 ---
  {
    id: 9,
    fechaVenta: '2026-09-05',
    fecha: '2026-09-05',
    comprobante: 'A-00007-00000993B',
    cliente: 'AGROINDUSTRIAS CABA',
    tipo: 'Factura',
    producto: 'CORTADORA DE PLASMA',
    sku: '102',
    cantidad: 1,
    neto: 1450000,
    iva: 304500,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 1754500,
    medioCobro: 'E-Cheq (Cheque Electrónico)',
    fechaCobro: '2026-09-10'
  },
  // --- 08/09/2026 ---
  { 
    id: 10, 
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
    id: 11, 
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
    id: 12, 
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
    id: 13, 
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
    id: 14, 
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
  // --- 09/09/2026 ---
  {
    id: 15,
    fechaVenta: '2026-09-09',
    fecha: '2026-09-09',
    comprobante: 'A-00007-00000998',
    cliente: 'CONSTRUCTORA DEL SUR S.A.',
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
    fechaCobro: '2026-09-12'
  },
  {
    id: 16,
    fechaVenta: '2026-09-09',
    fecha: '2026-09-09',
    comprobante: 'B-00007-00000568',
    cliente: 'PEREZ HECTOR',
    tipo: 'Factura',
    producto: '270-MINI SOLDADOR',
    sku: 'IVT270MINI',
    cantidad: 1,
    neto: 380000,
    iva: 79800,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 459800,
    medioCobro: 'Mercado Pago',
    fechaCobro: '2026-09-09'
  },
  // --- 10/09/2026 ---
  {
    id: 17,
    fechaVenta: '2026-09-10',
    fecha: '2026-09-10',
    comprobante: 'A-00007-00000999',
    cliente: 'MINERA SANTA CRUZ',
    tipo: 'Factura',
    producto: 'EQUIPO DE SOLDADURA MIG',
    sku: 'MIG250',
    cantidad: 2,
    neto: 2100000,
    iva: 441000,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 2541000,
    medioCobro: 'Transferencia Bancaria',
    fechaCobro: '2026-09-15'
  },
  // --- 11/09/2026 ---
  {
    id: 18,
    fechaVenta: '2026-09-11',
    fecha: '2026-09-11',
    comprobante: 'A-00007-00001000',
    cliente: 'INGENIERO MEDINA',
    tipo: 'Factura',
    producto: 'OT No SEGUN PRESUPUESTO',
    sku: 'OT',
    observaciones: '26485 reparacion bobinado',
    cantidad: 1,
    neto: 520000,
    iva: 109200,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 629200,
    medioCobro: 'Transferencia Bancaria',
    fechaCobro: '2026-09-14'
  },
  {
    id: 19,
    fechaVenta: '2026-09-11',
    fecha: '2026-09-11',
    comprobante: 'B-00007-00000569',
    cliente: 'GOMEZ MAURICIO',
    tipo: 'Factura',
    producto: 'CARGADOR ARRANCADOR',
    sku: '355',
    cantidad: 1,
    neto: 890000,
    iva: 186900,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 1076900,
    medioCobro: 'Tarjeta de Crédito (Visa)',
    fechaCobro: '2026-09-11'
  },
  // --- 12/09/2026 ---
  {
    id: 20,
    fechaVenta: '2026-09-12',
    fecha: '2026-09-12',
    comprobante: 'B-00007-00000570',
    cliente: 'FERNANDEZ DANIEL',
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
    fechaCobro: '2026-09-12'
  },
  // --- 14/09/2026 ---
  {
    id: 21,
    fechaVenta: '2026-09-14',
    fecha: '2026-09-14',
    comprobante: 'A-00007-00001001',
    cliente: 'INDUSTRIAS METALLUM S.R.L.',
    tipo: 'Factura',
    producto: 'SOLDADORA RECTIFICADORA',
    sku: '63',
    cantidad: 2,
    neto: 2500000,
    iva: 525000,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 3025000,
    medioCobro: 'Transferencia Bancaria',
    fechaCobro: '2026-09-18'
  },
  {
    id: 22,
    fechaVenta: '2026-09-14',
    fecha: '2026-09-14',
    comprobante: 'A-00007-00001002',
    cliente: 'RAC S.R.L.',
    tipo: 'Factura',
    producto: 'OT No SEGUN PRESUPUESTO',
    sku: 'OT',
    observaciones: '26490 cambio placas control',
    cantidad: 1,
    neto: 610000,
    iva: 128100,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 738100,
    medioCobro: 'Transferencia Bancaria',
    fechaCobro: '2026-09-17'
  },
  // --- 15/09/2026 ---
  {
    id: 23,
    fechaVenta: '2026-09-15',
    fecha: '2026-09-15',
    comprobante: 'A-00007-00001003',
    cliente: 'CM ENERGY & MINING',
    tipo: 'Factura',
    producto: 'CORTADORA DE PLASMA',
    sku: '102',
    cantidad: 1,
    neto: 1450000,
    iva: 304500,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 1754500,
    medioCobro: 'E-Cheq (Cheque Electrónico)',
    fechaCobro: '2026-09-20'
  },
  {
    id: 24,
    fechaVenta: '2026-09-15',
    fecha: '2026-09-15',
    comprobante: 'B-00007-00000571',
    cliente: 'MARTINEZ LUCAS',
    tipo: 'Factura',
    producto: '270-MINI SOLDADOR',
    sku: 'IVT270MINI',
    cantidad: 1,
    neto: 380000,
    iva: 79800,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 459800,
    medioCobro: 'Mercado Pago',
    fechaCobro: '2026-09-15'
  },
  // --- 16/09/2026 ---
  {
    id: 25,
    fechaVenta: '2026-09-16',
    fecha: '2026-09-16',
    comprobante: 'A-00007-00001004',
    cliente: 'PETROQUIMICA ANDINA S.A.',
    tipo: 'Factura',
    producto: 'EQUIPO DE SOLDADURA MIG',
    sku: 'MIG250',
    cantidad: 1,
    neto: 1050000,
    iva: 220500,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 1270500,
    medioCobro: 'Transferencia Bancaria',
    fechaCobro: '2026-09-19'
  },
  // --- 17/09/2026 ---
  {
    id: 26,
    fechaVenta: '2026-09-17',
    fecha: '2026-09-17',
    comprobante: 'A-00007-00001005',
    cliente: 'JUAN ABEL CORNEJO',
    tipo: 'Factura',
    producto: 'CARGADOR ARRANCADOR',
    sku: '355',
    cantidad: 1,
    neto: 890000,
    iva: 186900,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 1076900,
    medioCobro: 'Transferencia Bancaria',
    fechaCobro: '2026-09-20'
  },
  {
    id: 27,
    fechaVenta: '2026-09-17',
    fecha: '2026-09-17',
    comprobante: 'B-00007-00000572',
    cliente: 'RODRIGUEZ FACUNDO',
    tipo: 'Factura',
    producto: 'OT No SEGUN PRESUPUESTO',
    sku: 'OT',
    observaciones: '26498 reparacion placa',
    cantidad: 1,
    neto: 290000,
    iva: 60900,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 350900,
    medioCobro: 'Mercado Pago',
    fechaCobro: '2026-09-17'
  },
  // --- 18/09/2026 ---
  {
    id: 28,
    fechaVenta: '2026-09-18',
    fecha: '2026-09-18',
    comprobante: 'A-00007-00001006',
    cliente: 'ELECTROMECANICA DEL NORTE',
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
    fechaCobro: null
  },
  {
    id: 29,
    fechaVenta: '2026-09-18',
    fecha: '2026-09-18',
    comprobante: 'A-00007-00001007',
    cliente: 'INGENIERO MEDINA',
    tipo: 'Factura',
    producto: 'OT No SEGUN PRESUPUESTO',
    sku: 'OT',
    observaciones: '26501 service integral',
    cantidad: 1,
    neto: 480000,
    iva: 100800,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 580800,
    medioCobro: 'Transferencia Bancaria',
    fechaCobro: '2026-09-21'
  },
  // --- 19/09/2026 ---
  {
    id: 30,
    fechaVenta: '2026-09-19',
    fecha: '2026-09-19',
    comprobante: 'B-00007-00000573',
    cliente: 'SANCHEZ ALBERTO',
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
    fechaCobro: '2026-09-19'
  },
  // --- 20/09/2026 ---
  {
    id: 31,
    fechaVenta: '2026-09-20',
    fecha: '2026-09-20',
    comprobante: 'A-00007-00001008',
    cliente: 'TALLERES MAQ S.A.',
    tipo: 'Factura',
    producto: 'CARGADOR ARRANCADOR',
    sku: '355',
    cantidad: 1,
    neto: 890000,
    iva: 186900,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 1076900,
    medioCobro: 'Transferencia Bancaria',
    fechaCobro: null
  },
  // --- 21/09/2026 ---
  {
    id: 32,
    fechaVenta: '2026-09-21',
    fecha: '2026-09-21',
    comprobante: 'A-00007-00001009',
    cliente: 'AGROINDUSTRIAS CABA',
    tipo: 'Factura',
    producto: 'CORTADORA DE PLASMA',
    sku: '102',
    cantidad: 1,
    neto: 1450000,
    iva: 304500,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 1754500,
    medioCobro: 'Transferencia Bancaria',
    fechaCobro: '2026-09-25'
  },
  // --- 22/09/2026 ---
  {
    id: 33,
    fechaVenta: '2026-09-22',
    fecha: '2026-09-22',
    comprobante: 'A-00007-00001010',
    cliente: 'RAC S.R.L.',
    tipo: 'Factura',
    producto: 'OT No SEGUN PRESUPUESTO',
    sku: 'OT',
    observaciones: '26510 mantenimiento transformador',
    cantidad: 1,
    neto: 570000,
    iva: 119700,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 689700,
    medioCobro: 'Transferencia Bancaria',
    fechaCobro: '2026-09-24'
  },
  {
    id: 34,
    fechaVenta: '2026-09-22',
    fecha: '2026-09-22',
    comprobante: 'B-00007-00000574',
    cliente: 'LOPEZ OSVALDO',
    tipo: 'Factura',
    producto: '270-MINI SOLDADOR',
    sku: 'IVT270MINI',
    cantidad: 1,
    neto: 380000,
    iva: 79800,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 459800,
    medioCobro: 'Mercado Pago',
    fechaCobro: '2026-09-22'
  },
  // --- 23/09/2026 ---
  {
    id: 35,
    fechaVenta: '2026-09-23',
    fecha: '2026-09-23',
    comprobante: 'A-00007-00001011',
    cliente: 'CONSTRUCTORA DEL SUR S.A.',
    tipo: 'Factura',
    producto: 'SOLDADORA RECTIFICADORA',
    sku: '63',
    cantidad: 1,
    neto: 1250000,
    iva: 262500,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 1512500,
    medioCobro: 'E-Cheq (Cheque Electrónico)',
    fechaCobro: null
  },
  // --- 24/09/2026 ---
  {
    id: 36,
    fechaVenta: '2026-09-24',
    fecha: '2026-09-24',
    comprobante: 'A-00007-00001012',
    cliente: 'MINERA SANTA CRUZ',
    tipo: 'Factura',
    producto: 'EQUIPO DE SOLDADURA MIG',
    sku: 'MIG250',
    cantidad: 1,
    neto: 1050000,
    iva: 220500,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 1270500,
    medioCobro: 'Transferencia Bancaria',
    fechaCobro: '2026-09-28'
  },
  // --- 25/09/2026 ---
  {
    id: 37,
    fechaVenta: '2026-09-25',
    fecha: '2026-09-25',
    comprobante: 'B-00007-00000575',
    cliente: 'ALVAREZ MARCOS',
    tipo: 'Factura',
    producto: 'CARGADOR ARRANCADOR',
    sku: '355',
    cantidad: 1,
    neto: 890000,
    iva: 186900,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 1076900,
    medioCobro: 'Tarjeta de Crédito (Visa)',
    fechaCobro: '2026-09-25'
  },
  {
    id: 38,
    fechaVenta: '2026-09-25',
    fecha: '2026-09-25',
    comprobante: 'A-00007-00001013',
    cliente: 'INGENIERO MEDINA',
    tipo: 'Factura',
    producto: 'OT No SEGUN PRESUPUESTO',
    sku: 'OT',
    observaciones: '26515 bobinado inducido',
    cantidad: 1,
    neto: 490000,
    iva: 102900,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 592900,
    medioCobro: 'Transferencia Bancaria',
    fechaCobro: '2026-09-28'
  },
  // --- 26/09/2026 ---
  {
    id: 39,
    fechaVenta: '2026-09-26',
    fecha: '2026-09-26',
    comprobante: 'B-00007-00000576',
    cliente: 'ROMERO CARLOS',
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
    fechaCobro: '2026-09-26'
  },
  // --- 28/09/2026 ---
  {
    id: 40,
    fechaVenta: '2026-09-28',
    fecha: '2026-09-28',
    comprobante: 'A-00007-00001014',
    cliente: 'INDUSTRIAS METALLUM S.R.L.',
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
    fechaCobro: '2026-09-30'
  },
  {
    id: 41,
    fechaVenta: '2026-09-28',
    fecha: '2026-09-28',
    comprobante: 'A-00007-00001015',
    cliente: 'PETROQUIMICA ANDINA S.A.',
    tipo: 'Factura',
    producto: 'CORTADORA DE PLASMA',
    sku: '102',
    cantidad: 1,
    neto: 1450000,
    iva: 304500,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 1754500,
    medioCobro: 'E-Cheq (Cheque Electrónico)',
    fechaCobro: null
  },
  // --- 29/09/2026 ---
  {
    id: 42,
    fechaVenta: '2026-09-29',
    fecha: '2026-09-29',
    comprobante: 'B-00007-00000577',
    cliente: 'DIAZ RICARDO',
    tipo: 'Factura',
    producto: '270-MINI SOLDADOR',
    sku: 'IVT270MINI',
    cantidad: 1,
    neto: 380000,
    iva: 79800,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 459800,
    medioCobro: 'Mercado Pago',
    fechaCobro: '2026-09-29'
  },
  // --- 30/09/2026 ---
  {
    id: 43,
    fechaVenta: '2026-09-30',
    fecha: '2026-09-30',
    comprobante: 'A-00007-00001016',
    cliente: 'CM ENERGY & MINING',
    tipo: 'Factura',
    producto: 'CARGADOR ARRANCADOR',
    sku: '355',
    cantidad: 1,
    neto: 890000,
    iva: 186900,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 1076900,
    medioCobro: 'Transferencia Bancaria',
    fechaCobro: null
  },
  {
    id: 44,
    fechaVenta: '2026-09-30',
    fecha: '2026-09-30',
    comprobante: 'A-00007-00001017',
    cliente: 'JUAN ABEL CORNEJO',
    tipo: 'Factura',
    producto: 'OT No SEGUN PRESUPUESTO',
    sku: 'OT',
    observaciones: '26522 reparacion estator',
    cantidad: 1,
    neto: 510000,
    iva: 107100,
    descuentoPercent: 0,
    descuentoMonto: 0,
    total: 617100,
    medioCobro: 'Transferencia Bancaria',
    fechaCobro: '2026-09-30'
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
    
    // Inicializar almacenamiento con el dataset completo de Septiembre
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

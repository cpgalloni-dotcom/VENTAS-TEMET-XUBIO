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

export const xubioApi = {
  /**
   * Obtiene los registros guardados en el almacenamiento persistente local de TEMET
   */
  getStoredVentas() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_VENTAS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error("Error al leer ventas almacenadas:", e);
    }
    return [];
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

    // 3. Filtrar por rango de fechas si fue especificado
    if (fechaDesde) {
      resultado = resultado.filter(v => (v.fechaVenta || v.fecha) >= fechaDesde);
    }
    if (fechaHasta) {
      resultado = resultado.filter(v => (v.fechaVenta || v.fecha) <= fechaHasta);
    }

    return resultado;
  }
};

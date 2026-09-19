/**
 * Servicio de conexión con la API de Xubio para TEMET
 */
const XUBIO_CONFIG = {
  baseUrl: 'https://api.xubio.com/v1', // Endpoint oficial base de Xubio
  timeout: 10000,
};

export const xubioApi = {
  /**
   * Obtiene las ventas filtradas por un rango de fechas
   * @param {string} token - Token de autenticación de Xubio (API Key / Bearer)
   * @param {string} fechaDesde - Formato YYYY-MM-DD
   * @param {string} fechaHasta - Formato YYYY-MM-DD
   */
  async getVentas(token, fechaDesde, fechaHasta) {
    try {
      if (token && token.trim() !== '') {
        // En entorno de producción real, realizarías la petición fetch:
        const response = await fetch(`${XUBIO_CONFIG.baseUrl}/ventas?desde=${fechaDesde || ''}&hasta=${fechaHasta || ''}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Company': 'TEMET'
          }
        });
        if (!response.ok) throw new Error('Error al conectar con la API de Xubio');
        return await response.json();
      }

      // Simulación de datos estructurados devueltos por Xubio adaptados para TEMET
      const mockVentas = [
        { id: 1, fecha: '2026-09-01', producto: 'Módulo Biométrico ASA3223A', cantidad: 2, neto: 350000, iva: 73500, total: 423500 },
        { id: 2, fecha: '2026-09-02', producto: 'Licencia Software Control Asistencia', cantidad: 5, neto: 1250000, iva: 262500, total: 1512500 },
        { id: 3, fecha: '2026-09-05', producto: 'Instalación y Configuración Redes', cantidad: 1, neto: 450000, iva: 94500, total: 544500 },
        { id: 4, fecha: '2026-09-10', producto: 'Soporte Técnico Mensual', cantidad: 3, neto: 600000, iva: 126000, total: 726000 },
        { id: 5, fecha: '2026-09-15', producto: 'Módulo Biométrico ASA3223A', cantidad: 4, neto: 700000, iva: 147000, total: 847000 },
        { id: 6, fecha: '2026-08-20', producto: 'Licencia Software Control Asistencia', cantidad: 2, neto: 500000, iva: 105000, total: 605000 },
        { id: 7, fecha: '2026-07-12', producto: 'Soporte Técnico Mensual', cantidad: 2, neto: 400000, iva: 84000, total: 484000 },
        { id: 8, fecha: '2026-09-18', producto: 'Control de Acceso Dahua DHI-ASI1201E', cantidad: 3, neto: 850000, iva: 178500, total: 1028500 },
        { id: 9, fecha: '2026-09-19', producto: 'Licencia Software Control Asistencia', cantidad: 3, neto: 750000, iva: 157500, total: 907500 }
      ];

      // Aplicar filtro por rango de fechas
      let resultado = [...mockVentas];
      if (fechaDesde) {
        resultado = resultado.filter(v => v.fecha >= fechaDesde);
      }
      if (fechaHasta) {
        resultado = resultado.filter(v => v.fecha <= fechaHasta);
      }

      return resultado;
    } catch (error) {
      console.error("Xubio API Error:", error);
      throw error;
    }
  }
};

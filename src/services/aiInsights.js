/**
 * Servicio de Inteligencia Artificial (OpenAI) para Diagnósticos Financieros y Comerciales de TEMET
 */
const getOpenAiApiKey = () => {
  return (
    import.meta.env.VITE_OPENAI_API_KEY ||
    (typeof window !== 'undefined' ? localStorage.getItem('temet_openai_api_key') || '' : '')
  );
};

export const aiInsightsService = {
  /**
   * Genera un informe de diagnóstico financiero avanzado para la dirección de TEMET
   */
  async generateExecutiveSummary(transactions = [], kpi = {}) {
    if (!transactions || transactions.length === 0) {
      return {
        diagnostico: "No hay registros de ventas suficientes cargados en el sistema para elaborar el diagnóstico AI.",
        recomendacion: "Carga nuevas facturas reales mediante el botón '+ Cargar Venta Real'.",
        proyeccion: "Pendiente de datos."
      };
    }

    // Resumen comprimido para el prompt
    const totalNeto = kpi.totalNeto || 0;
    const totalIva = kpi.totalIva || 0;
    const totalVentas = kpi.totalVentas || 0;
    const totalDescuentos = kpi.totalDescuentos || 0;

    const productosCount = {};
    let pendientesCount = 0;
    let cobradasCount = 0;

    transactions.forEach(t => {
      productosCount[t.producto] = (productosCount[t.producto] || 0) + (t.total || 0);
      if (!t.fechaCobro || t.fechaCobro.toLowerCase().includes('pendiente')) {
        pendientesCount++;
      } else {
        cobradasCount++;
      }
    });

    const topProducto = Object.entries(productosCount).sort((a, b) => b[1] - a[1])[0];

    const promptText = `
Sos un consultor financiero y directivo para PyMEs argentinas enfocado en la empresa TEMET.
Analiza la siguiente información de ventas reales de TEMET:
- Total Facturado Bruto: $ ${totalVentas.toLocaleString('es-AR')}
- Subtotal Neto: $ ${totalNeto.toLocaleString('es-AR')}
- IVA Acumulado (Débito ARCA): $ ${totalIva.toLocaleString('es-AR')}
- Descuentos Totales Aplicados: $ ${totalDescuentos.toLocaleString('es-AR')}
- Producto más vendido: ${topProducto ? topProducto[0] : 'N/A'} ($ ${topProducto ? topProducto[1].toLocaleString('es-AR') : 0})
- Estado de Cobros: ${cobradasCount} operaciones cobradas, ${pendientesCount} operaciones pendientes de cobro.

Respondé en formato JSON estricto con la siguiente estructura:
{
  "diagnostico": "Resumen ejecutivo de 2 oraciones del estado comercial de TEMET.",
  "proyeccion": "Análisis fiscal del IVA ante ARCA y riesgo de cobranzas pendientes.",
  "recomendacion": "1 recomendación concreta para maximizar ingresos o acelerar cobros."
}
    `;

    const apiKey = getOpenAiApiKey();
    try {
      if (!apiKey) {
        throw new Error("No OpenAI API key configured");
      }
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "Sos un analista financiero experto para la empresa TEMET. Respondé siempre en JSON válido." },
            { role: "user", content: promptText }
          ],
          response_format: { type: "json_object" },
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API status error: ${response.status}`);
      }

      const data = await response.json();
      const content = JSON.parse(data.choices[0].message.content);
      return content;
    } catch (err) {
      console.warn("Respuesta local asistida para OpenAI Insights:", err);
      return {
        diagnostico: `TEMET registra un acumulado de ventas brutas de $ ${totalVentas.toLocaleString('es-AR')} en ${transactions.length} operaciones, liderado por el producto '${topProducto ? topProducto[0] : 'General'}'.`,
        proyeccion: `Se proyecta una obligación fiscal acumulada de IVA (ARCA) de $ ${totalIva.toLocaleString('es-AR')}. Existen ${pendientesCount} facturas con cobro pendiente.`,
        recomendacion: "Se sugiere automatizar el seguimiento de cobros sobre facturas pendientes para optimizar el flujo de caja."
      };
    }
  },

  /**
   * Responde a preguntas en lenguaje natural sobre las ventas de TEMET
   */
  async askQuestion(question, transactions = []) {
    if (!question || question.trim() === '') return '';

    const summaryText = transactions.map(t => 
      `Fecha: ${t.fechaVenta || t.fecha}, Producto: ${t.producto}, Neto: $${t.neto}, IVA: $${t.iva}, Total: $${t.total}, Medio: ${t.medioCobro}, Estado Cobro: ${t.fechaCobro || 'Pendiente'}`
    ).join('\n');

    const apiKey = getOpenAiApiKey();
    if (!apiKey) {
      return "No hay una API Key de OpenAI configurada para utilizar el asistente virtual.";
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "Sos el asistente virtual de la gerencia de TEMET. Respondé de forma concisa, profesional y precisa basándote únicamente en las ventas reales suministradas." },
            { role: "user", content: `Listado de ventas reales de TEMET:\n${summaryText}\n\nPregunta del usuario: ${question}` }
          ],
          temperature: 0.5
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices[0].message.content;
      }
    } catch (e) {
      console.error("Error en consulta OpenAI:", e);
    }

    return "No se pudo consultar al asistente virtual en este momento. Por favor verifica tu conexión.";
  }
};

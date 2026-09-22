import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const XUBIO_CONFIG = {
  baseUrl: 'https://api.xubio.com/v1',
  clientId: process.env.XUBIO_CLIENT_ID || '113634631454982524336194125373887',
  clientSecret: process.env.XUBIO_CLIENT_SECRET || 'AMho3q0l5qwNhYpZVCAzi7sBiBnHLf4_n'
};

// Proxy para obtener token de Xubio desde el servidor backend (evita CORS en el navegador)
app.post('/api/xubio/token', async (req, res) => {
  try {
    const { clientId, clientSecret } = req.body || {};
    const cid = clientId || XUBIO_CONFIG.clientId;
    const csecret = clientSecret || XUBIO_CONFIG.clientSecret;

    const response = await fetch(`${XUBIO_CONFIG.baseUrl}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: cid,
        client_secret: csecret
      })
    });

    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    } else {
      return res.status(response.status).json({ error: 'Error de autenticación con Xubio API' });
    }
  } catch (err) {
    console.error("Proxy Token Error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Proxy para consultar comprobantes de venta desde el servidor backend (evita CORS en el navegador)
app.get('/api/xubio/facturaVenta', async (req, res) => {
  try {
    const { desde, hasta, token } = req.query;
    const authHeader = req.headers.authorization || (token ? `Bearer ${token}` : `Bearer ${XUBIO_CONFIG.clientSecret}`);

    const response = await fetch(`${XUBIO_CONFIG.baseUrl}/facturaVenta?desde=${desde || ''}&hasta=${hasta || ''}&fechaDesde=${desde || ''}&fechaHasta=${hasta || ''}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Company': 'Temet INC SAS',
        'Client-Id': XUBIO_CONFIG.clientId
      }
    });

    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    } else {
      const text = await response.text();
      return res.status(response.status).send(text);
    }
  } catch (err) {
    console.error("Proxy Ventas Error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Servir archivos estáticos del build de React (Vite)
app.use(express.static(path.join(__dirname, 'dist')));

// SPA Fallback Middleware para cualquier ruta no capturada por /api o archivos estáticos
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server TEMET Xubio Proxy corriendo en puerto ${PORT}`);
});

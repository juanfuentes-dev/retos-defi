// API local: un pequeño servidor web SOLO en tu computadora (127.0.0.1).
// La usan el servidor MCP y cualquier panel que quieras hacer después.
import http from 'node:http';
import { config } from './config.js';
import { listarPlantillas, guardarPlantilla, borrarPlantilla } from './plantillas.js';

function leerCuerpo(req) {
  return new Promise((resolve, reject) => {
    let datos = '';
    req.on('data', (c) => (datos += c));
    req.on('end', () => {
      try { resolve(datos ? JSON.parse(datos) : {}); } catch { reject(new Error('JSON inválido')); }
    });
  });
}

export function iniciarApi({ programador, enviar, estado }) {
  const servidor = http.createServer(async (req, res) => {
    const responder = (codigo, cuerpo) => {
      res.writeHead(codigo, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(cuerpo));
    };
    if (config.apiToken && req.headers.authorization !== `Bearer ${config.apiToken}`) {
      return responder(401, { error: 'Falta la clave (API_TOKEN)' });
    }
    try {
      const url = new URL(req.url, 'http://localhost');
      const ruta = `${req.method} ${url.pathname}`;
      if (ruta === 'GET /estado') return responder(200, { pausado: estado.pausado, listo: estado.listo });
      if (ruta === 'GET /plantillas') return responder(200, listarPlantillas());
      if (ruta === 'POST /plantillas') {
        const { nombre, texto } = await leerCuerpo(req);
        if (!nombre || !texto) return responder(400, { error: 'Faltan nombre y texto' });
        guardarPlantilla(nombre, texto);
        return responder(200, { ok: true });
      }
      if (req.method === 'DELETE' && url.pathname.startsWith('/plantillas/')) {
        return responder(200, { ok: borrarPlantilla(decodeURIComponent(url.pathname.slice(12))) });
      }
      if (ruta === 'GET /programaciones') return responder(200, programador.listar());
      if (ruta === 'POST /programaciones') return responder(200, programador.agregar(await leerCuerpo(req)));
      if (req.method === 'DELETE' && url.pathname.startsWith('/programaciones/')) {
        return responder(200, { ok: programador.cancelar(url.pathname.slice(16)) });
      }
      if (ruta === 'POST /enviar') {
        const { numero, texto } = await leerCuerpo(req);
        if (!numero || !texto) return responder(400, { error: 'Faltan numero y texto' });
        await enviar(String(numero).replace(/\D/g, ''), texto);
        return responder(200, { ok: true });
      }
      responder(404, { error: 'Ruta no encontrada' });
    } catch (e) {
      responder(400, { error: e.message });
    }
  });
  servidor.listen(config.apiPuerto, '127.0.0.1', () =>
    console.log(`🔌 API local en http://127.0.0.1:${config.apiPuerto}`),
  );
  return servidor;
}

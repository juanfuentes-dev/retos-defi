// 🧩 Servidor MCP: le da "manos" a una IA para usar tu bot de WhatsApp.
// Una app compatible con MCP (LM Studio, Claude Desktop, Cursor...) podrá
// enviar mensajes, programarlos y manejar plantillas hablándole en español.
//
// IMPORTANTE: el bot (npm start) debe estar corriendo, porque este servidor
// le habla a su API local.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const BASE = `http://127.0.0.1:${process.env.API_PUERTO || 3001}`;
const TOKEN = process.env.API_TOKEN || '';

async function api(metodo, ruta, cuerpo) {
  const res = await fetch(BASE + ruta, {
    method: metodo,
    headers: { 'Content-Type': 'application/json', ...(TOKEN && { Authorization: `Bearer ${TOKEN}` }) },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  const datos = await res.json();
  if (!res.ok) throw new Error(datos.error || `Error ${res.status}`);
  return datos;
}

// Convierte cualquier resultado en el formato que espera MCP.
const comoTexto = (fn) => async (args) => {
  try {
    const r = await fn(args);
    return { content: [{ type: 'text', text: JSON.stringify(r, null, 2) }] };
  } catch (e) {
    return { content: [{ type: 'text', text: `Error: ${e.message}. ¿Está corriendo el bot (npm start)?` }], isError: true };
  }
};

const servidor = new McpServer({ name: 'whatsapp-local', version: '1.0.0' });

servidor.registerTool('enviar_whatsapp', {
  description: 'Envía un mensaje de WhatsApp ahora mismo a un número (con código de país, sin +).',
  inputSchema: { numero: z.string().describe('Ej. 50370001111'), texto: z.string() },
}, comoTexto(({ numero, texto }) => api('POST', '/enviar', { numero, texto })));

servidor.registerTool('programar_mensaje', {
  description: 'Programa un mensaje. Horario en español: "diario 08:00", "lunes a viernes 7:30", "sabado 10:00", "2026-12-24 09:00", "en 30 minutos". Usa texto O plantilla.',
  inputSchema: {
    destinos: z.array(z.string()).describe('Números con código de país'),
    horario: z.string(),
    texto: z.string().optional(),
    plantilla: z.string().optional().describe('Nombre de una plantilla guardada'),
    variables: z.record(z.string(), z.string()).optional().describe('Valores para {{variables}} de la plantilla'),
  },
}, comoTexto((args) => api('POST', '/programaciones', args)));

servidor.registerTool('listar_programados', {
  description: 'Lista los mensajes programados activos.',
  inputSchema: {},
}, comoTexto(() => api('GET', '/programaciones')));

servidor.registerTool('cancelar_programado', {
  description: 'Cancela un mensaje programado por su id.',
  inputSchema: { id: z.string() },
}, comoTexto(({ id }) => api('DELETE', `/programaciones/${encodeURIComponent(id)}`)));

servidor.registerTool('listar_plantillas', {
  description: 'Muestra las plantillas de mensajes guardadas.',
  inputSchema: {},
}, comoTexto(() => api('GET', '/plantillas')));

servidor.registerTool('guardar_plantilla', {
  description: 'Crea o cambia una plantilla. Puede llevar {{variables}} como {{nombre}}, y automáticas {{fecha}}, {{hora}}, {{dia}}, {{saludo}}.',
  inputSchema: { nombre: z.string(), texto: z.string() },
}, comoTexto(({ nombre, texto }) => api('POST', '/plantillas', { nombre, texto })));

await servidor.connect(new StdioServerTransport());
console.error('🧩 Servidor MCP "whatsapp-local" listo (stdio)');

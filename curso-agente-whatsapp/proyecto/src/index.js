// 🚀 Punto de entrada: conecta WhatsApp + IA local + plantillas + programador + API.
import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { config } from './config.js';
import { preguntarIA } from './ia.js';
import { historialDe, recordar, silenciar, estaSilenciado } from './memoria.js';
import { buscarRespuestaRapida } from './respuestas.js';
import { crearProgramador } from './programador.js';
import { ejecutarComando } from './comandos.js';
import { iniciarApi } from './api.js';

const { Client, LocalAuth } = pkg;
const estado = { pausado: false, listo: false };
const enviadosPorBot = new Set(); // para distinguir lo que manda el bot de lo que mandas tú
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: '.sesion' }), // guarda la sesión: el QR se escanea una sola vez
  puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] },
});

async function enviarAChat(chatId, texto) {
  enviadosPorBot.add(texto);
  setTimeout(() => enviadosPorBot.delete(texto), 60_000);
  return client.sendMessage(chatId, texto);
}

// Envía a un número normal (ej. 50370001111).
async function enviar(numero, texto) {
  if (numero.includes('@')) return enviarAChat(numero, texto);
  const id = await client.getNumberId(numero);
  if (!id) throw new Error(`El número ${numero} no tiene WhatsApp`);
  return enviarAChat(id._serialized, texto);
}

let programador;

client.on('qr', (qr) => {
  console.log('\n📱 Escanea este QR con WhatsApp → Dispositivos vinculados → Vincular dispositivo\n');
  qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => console.log('🔐 Sesión guardada'));
client.on('auth_failure', (m) => console.error('❌ Falló el inicio de sesión:', m));
client.on('disconnected', (r) => {
  console.log('⚠️ WhatsApp se desconectó:', r);
  estado.listo = false;
});

client.on('ready', () => {
  estado.listo = true;
  console.log(`✅ Bot listo usando el modelo "${config.modelo}" (${config.iaTipo})`);
  if (!programador) {
    programador = crearProgramador({ enviar });
    iniciarApi({ programador, enviar, estado });
  }
});

// Mensajes que TÚ escribes (desde el celular o la PC).
client.on('message_create', async (msg) => {
  if (!msg.fromMe) return;
  if (enviadosPorBot.delete(msg.body)) return; // lo mandó el bot, no tú

  if (msg.body.startsWith('!')) {
    if (!programador) return;
    const miChat = client.info.wid._serialized;
    try {
      const respuesta = await ejecutarComando(msg.body, { programador, enviar, estado });
      if (respuesta) await enviarAChat(miChat, respuesta);
    } catch (e) {
      await enviarAChat(miChat, `❌ ${e.message}`);
    }
    return;
  }
  // Contestaste a mano a un cliente: el bot se calla en ese chat un rato.
  if (msg.to !== client.info.wid._serialized) {
    silenciar(msg.to);
    console.log(`🙋 Respondiste tú en ${msg.to}. Bot en silencio ${config.silencioMinutos} min ahí.`);
  }
});

// Mensajes que te llegan de otras personas.
client.on('message', async (msg) => {
  try {
    if (msg.from === 'status@broadcast' || msg.isStatus) return;
    const esGrupo = msg.from.endsWith('@g.us');
    if (esGrupo && !config.responderGrupos) return;

    // El admin también puede mandar comandos desde otro teléfono.
    if (msg.body.startsWith('!') && config.adminNumero) {
      const contacto = await msg.getContact();
      if (contacto.number === config.adminNumero && programador) {
        const r = await ejecutarComando(msg.body, { programador, enviar, estado });
        if (r) await enviarAChat(msg.from, r);
        return;
      }
    }

    if (estado.pausado || estaSilenciado(msg.from)) return;

    if (!msg.body) {
      if (msg.hasMedia) await enviarAChat(msg.from, 'Por ahora solo puedo leer mensajes de texto 🙏. Un asesor revisará tu archivo.');
      return;
    }

    console.log(`💬 ${msg.from}: ${msg.body}`);

    // 1) Respuesta rápida (gratis e instantánea)
    const rapida = buscarRespuestaRapida(msg.body);
    if (rapida) {
      await esperar(1000 + Math.random() * 2000);
      await enviarAChat(msg.from, rapida);
      recordar(msg.from, 'user', msg.body);
      recordar(msg.from, 'assistant', rapida);
      return;
    }

    // 2) IA local
    const chat = await msg.getChat();
    await chat.sendStateTyping();
    const respuesta = await preguntarIA(historialDe(msg.from), msg.body);
    await chat.clearState();
    if (!respuesta) return;
    recordar(msg.from, 'user', msg.body);
    recordar(msg.from, 'assistant', respuesta);
    await enviarAChat(msg.from, respuesta);
    console.log(`🤖 → ${respuesta}`);
  } catch (e) {
    console.error('❌ Error respondiendo:', e.message);
  }
});

process.on('SIGINT', async () => {
  console.log('\n👋 Apagando el bot...');
  programador?.detener();
  await client.destroy().catch(() => {});
  process.exit(0);
});

console.log('⏳ Iniciando WhatsApp (la primera vez tarda un poco)...');
client.initialize();

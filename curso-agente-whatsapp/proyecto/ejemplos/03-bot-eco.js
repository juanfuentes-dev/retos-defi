// Módulo 3: tu primer bot. Solo repite lo que le escriben. Sin IA.
// Ejecuta:  npm run eco    (y escanea el QR)
import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
const { Client, LocalAuth } = pkg;

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: '.sesion' }),
  puppeteer: { headless: true, args: ['--no-sandbox'] },
});

client.on('qr', (qr) => qrcode.generate(qr, { small: true }));
client.on('ready', () => console.log('✅ Conectado. Pídele a alguien que te escriba "hola".'));
client.on('message', async (msg) => {
  if (msg.from.endsWith('@g.us') || msg.from === 'status@broadcast') return;
  console.log('Llegó:', msg.body);
  await msg.reply(`🦜 Dijiste: ${msg.body}`);
});
client.initialize();

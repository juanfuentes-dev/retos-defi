// Módulo 2: prueba que tu IA local responde (sin WhatsApp todavía).
// Ejecuta:  npm run probar-ia
import { preguntarIA } from '../src/ia.js';
import { config } from '../src/config.js';

console.log(`Preguntando a "${config.modelo}"...`);
const inicio = Date.now();
const r = await preguntarIA([], '¿Cuánto cuesta el curso de Excel y cuándo es?');
console.log(`\n🤖 ${r}\n\n⏱️ Tardó ${((Date.now() - inicio) / 1000).toFixed(1)} segundos`);

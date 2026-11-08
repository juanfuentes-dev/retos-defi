// Memoria corta de cada conversación, para que la IA tenga contexto.
// Vive en la RAM: si reinicias el bot, se olvida (a propósito, es más privado).
import { config } from './config.js';

const conversaciones = new Map();

export function historialDe(chatId) {
  return conversaciones.get(chatId) || [];
}

export function recordar(chatId, rol, contenido) {
  const h = historialDe(chatId);
  h.push({ role: rol, content: contenido });
  conversaciones.set(chatId, h.slice(-config.maxHistorial));
}

export function olvidar(chatId) {
  conversaciones.delete(chatId);
}

// "Modo humano": cuando tú contestas a mano, el bot se calla un rato en ese chat.
const silenciados = new Map();

export function silenciar(chatId, minutos = config.silencioMinutos) {
  silenciados.set(chatId, Date.now() + minutos * 60_000);
}

export function estaSilenciado(chatId) {
  const hasta = silenciados.get(chatId);
  if (!hasta) return false;
  if (Date.now() > hasta) {
    silenciados.delete(chatId);
    return false;
  }
  return true;
}

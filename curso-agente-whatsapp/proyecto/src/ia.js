// Habla con la IA que corre en TU computadora (Ollama o LM Studio).
// Nada sale a internet: por eso no pagas tokens.
import fs from 'node:fs';
import { config } from './config.js';

export function instrucciones() {
  let negocio = '';
  try {
    negocio = fs.readFileSync(config.conocimiento, 'utf8');
  } catch {
    negocio = 'Eres un asistente amable de un pequeño negocio.';
  }
  return `${negocio}

REGLAS IMPORTANTES:
- Responde SIEMPRE en español, corto (máximo 3-4 oraciones), como un mensaje de WhatsApp.
- Usa SOLO la información de arriba. Si no sabes algo, di que un asesor humano le responderá pronto.
- Nunca inventes precios, horarios ni promociones.
- No digas que eres un modelo de lenguaje.`;
}

// Algunos modelos (Qwen3, DeepSeek-R1) "piensan en voz alta" entre <think></think>. Lo quitamos.
export function limpiarRespuesta(texto) {
  return texto.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}

export async function preguntarIA(historial, mensaje) {
  const mensajes = [
    { role: 'system', content: instrucciones() },
    ...historial,
    { role: 'user', content: mensaje },
  ];

  const esOllama = config.iaTipo === 'ollama';
  const url = esOllama ? `${config.iaUrl}/api/chat` : `${config.iaUrl}/v1/chat/completions`;
  const cuerpo = esOllama
    ? { model: config.modelo, messages: mensajes, stream: false, keep_alive: '30m', options: { temperature: 0.4 } }
    : { model: config.modelo, messages: mensajes, temperature: 0.4 };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo),
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok) throw new Error(`La IA respondió con error ${res.status}: ${await res.text()}`);
  const datos = await res.json();
  const texto = esOllama ? datos.message?.content : datos.choices?.[0]?.message?.content;
  return limpiarRespuesta(texto || '');
}

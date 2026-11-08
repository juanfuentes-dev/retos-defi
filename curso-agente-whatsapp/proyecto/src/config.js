// Toda la configuración sale del archivo .env (ver .env.ejemplo).
const env = process.env;

export const config = {
  iaTipo: env.IA_TIPO || 'ollama',
  iaUrl: (env.IA_URL || 'http://127.0.0.1:11434').replace(/\/$/, ''),
  modelo: env.MODELO || 'qwen2.5:3b',
  adminNumero: (env.ADMIN_NUMERO || '').replace(/\D/g, ''),
  maxHistorial: Number(env.MAX_HISTORIAL || 10),
  silencioMinutos: Number(env.SILENCIO_MINUTOS || 60),
  responderGrupos: env.RESPONDER_GRUPOS === 'true',
  apiPuerto: Number(env.API_PUERTO || 3001),
  apiToken: env.API_TOKEN || '',
  dataDir: env.DATA_DIR || 'data',
  conocimiento: env.CONOCIMIENTO || 'conocimiento/negocio.md',
};

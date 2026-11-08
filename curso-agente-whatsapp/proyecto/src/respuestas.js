// Respuestas rápidas: si el mensaje trae ciertas palabras, contestamos al instante
// SIN usar la IA. Es lo más rápido y no gasta nada de tu computadora.
import { leer } from './almacen.js';

function normalizar(t) {
  return t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export function buscarRespuestaRapida(mensaje, reglas = leer('respuestas', [])) {
  const texto = normalizar(mensaje);
  for (const regla of reglas) {
    const coincide = regla.palabras.some((p) => {
      const palabra = normalizar(p);
      return new RegExp(`(^|\\W)${palabra.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\W|$)`).test(texto);
    });
    if (coincide) return regla.respuesta;
  }
  return null;
}

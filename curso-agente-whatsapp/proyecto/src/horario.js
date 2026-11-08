// Convierte frases en español a horarios que entiende la computadora.
//
//   "diario 08:00"                 -> todos los días a las 8 am
//   "lunes a viernes 07:30"        -> de lunes a viernes
//   "lunes,miercoles,viernes 18:00"-> solo esos días
//   "sabado 10:00"                 -> todos los sábados
//   "2026-12-24 09:00"             -> una sola vez, ese día
//   "en 30 minutos"                -> una sola vez, dentro de 30 min
//   "cron */15 * * * *"            -> formato cron avanzado
//
// Devuelve { tipo: 'repetir', cron, descripcion } o { tipo: 'una_vez', fecha, descripcion }.

const DIAS = {
  domingo: 0, lunes: 1, martes: 2, miercoles: 3, jueves: 4, viernes: 5, sabado: 6,
};

function sinAcentos(t) {
  return t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

function leerHora(texto) {
  const m = texto.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2] || 0);
  if (m[3] === 'pm' && h < 12) h += 12;
  if (m[3] === 'am' && h === 12) h = 0;
  if (h > 23 || min > 59) return null;
  return { h, min, resto: texto.slice(0, m.index).trim() };
}

export function interpretarHorario(entrada, ahora = new Date()) {
  const texto = sinAcentos(entrada).replace(/\s+/g, ' ');

  if (texto.startsWith('cron ')) {
    const cron = texto.slice(5).trim();
    if (cron.split(' ').length < 5) throw new Error('Cron inválido. Ejemplo: cron 0 8 * * 1-5');
    return { tipo: 'repetir', cron, descripcion: `cron ${cron}` };
  }

  const en = texto.match(/^en (\d+) (minuto|minutos|hora|horas|dia|dias)$/);
  if (en) {
    const n = Number(en[1]);
    const ms = en[2].startsWith('min') ? 60e3 : en[2].startsWith('hora') ? 3600e3 : 86400e3;
    const fecha = new Date(ahora.getTime() + n * ms);
    return { tipo: 'una_vez', fecha: fecha.toISOString(), descripcion: `una vez, ${fecha.toLocaleString('es')}` };
  }

  const hora = leerHora(texto);
  if (!hora) throw new Error('No entendí la hora. Usa por ejemplo 08:00 o 6:30 pm');
  const { h, min, resto } = hora;
  const hhmm = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;

  const f = resto.match(/^(\d{4})-(\d{2})-(\d{2})$/) || resto.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (f) {
    const [a, m, d] = f[0].includes('-') ? [f[1], f[2], f[3]] : [f[3], f[2], f[1]];
    const fecha = new Date(Number(a), Number(m) - 1, Number(d), h, min);
    if (Number.isNaN(fecha.getTime())) throw new Error('Fecha inválida');
    if (fecha <= ahora) throw new Error('Esa fecha ya pasó');
    return { tipo: 'una_vez', fecha: fecha.toISOString(), descripcion: `una vez, ${resto} ${hhmm}` };
  }

  if (['diario', 'todos los dias', 'cada dia', 'todos'].includes(resto)) {
    return { tipo: 'repetir', cron: `${min} ${h} * * *`, descripcion: `todos los días ${hhmm}` };
  }
  if (resto === 'fin de semana' || resto === 'fines de semana') {
    return { tipo: 'repetir', cron: `${min} ${h} * * 0,6`, descripcion: `fines de semana ${hhmm}` };
  }

  const rango = resto.match(/^(\w+) a (\w+)$/);
  if (rango && rango[1] in DIAS && rango[2] in DIAS) {
    const cron = `${min} ${h} * * ${DIAS[rango[1]]}-${DIAS[rango[2]]}`;
    return { tipo: 'repetir', cron, descripcion: `${rango[1]} a ${rango[2]} ${hhmm}` };
  }

  const lista = resto.split(/\s*(?:,|\by\b)\s*/).filter(Boolean);
  if (lista.length && lista.every((d) => d in DIAS)) {
    const cron = `${min} ${h} * * ${lista.map((d) => DIAS[d]).join(',')}`;
    return { tipo: 'repetir', cron, descripcion: `${lista.join(', ')} ${hhmm}` };
  }

  throw new Error(
    'No entendí el horario. Ejemplos: "diario 08:00", "lunes a viernes 7:30", "sabado 10:00", "2026-12-24 09:00", "en 30 minutos"',
  );
}

// Para mensajes de "una sola vez": ¿cuáles ya deben enviarse?
export function pendientesDeEnviar(programaciones, ahora = new Date()) {
  return programaciones.filter(
    (p) => p.activo && p.tipo === 'una_vez' && new Date(p.fecha) <= ahora,
  );
}

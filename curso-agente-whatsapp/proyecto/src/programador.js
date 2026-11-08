// Programador de mensajes: envía mensajes solos a la hora que digas.
import crypto from 'node:crypto';
import cron from 'node-cron';
import { leer, guardar } from './almacen.js';
import { interpretarHorario, pendientesDeEnviar } from './horario.js';
import { obtenerPlantilla, renderizar } from './plantillas.js';

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

export function crearProgramador({ enviar, log = console.log }) {
  const tareas = new Map();
  let programaciones = leer('programaciones', []);

  const persistir = () => guardar('programaciones', programaciones);

  function textoDe(p) {
    if (p.plantilla) {
      const base = obtenerPlantilla(p.plantilla);
      if (!base) throw new Error(`La plantilla "${p.plantilla}" no existe`);
      return renderizar(base, p.variables);
    }
    return renderizar(p.texto, p.variables);
  }

  async function ejecutar(p) {
    try {
      const texto = textoDe(p);
      for (const destino of p.destinos) {
        await enviar(destino, texto);
        log(`📤 Programado ${p.id} enviado a ${destino}`);
        // Pausa entre envíos para parecer humano y evitar bloqueos de WhatsApp.
        if (p.destinos.length > 1) await esperar(4000 + Math.random() * 6000);
      }
      p.ultimoEnvio = new Date().toISOString();
    } catch (e) {
      log(`❌ Error en programado ${p.id}: ${e.message}`);
      p.ultimoError = e.message;
    }
    if (p.tipo === 'una_vez') p.activo = false;
    persistir();
  }

  function activar(p) {
    if (p.tipo === 'repetir' && p.activo) {
      tareas.set(p.id, cron.schedule(p.cron, () => ejecutar(p)));
    }
  }

  // Revisa cada minuto los mensajes de "una sola vez".
  const revisor = cron.schedule('* * * * *', () => {
    for (const p of pendientesDeEnviar(programaciones)) ejecutar(p);
  });

  programaciones.forEach(activar);

  return {
    agregar({ destinos, horario, texto, plantilla, variables = {} }) {
      if (!texto && !plantilla) throw new Error('Falta el texto o la plantilla');
      if (plantilla && !obtenerPlantilla(plantilla)) throw new Error(`La plantilla "${plantilla}" no existe`);
      const lista = (Array.isArray(destinos) ? destinos : String(destinos).split(','))
        .map((d) => String(d).replace(/\D/g, ''))
        .filter(Boolean);
      if (!lista.length) throw new Error('Falta al menos un número de destino');
      const h = interpretarHorario(horario);
      const p = {
        id: crypto.randomBytes(3).toString('hex'),
        destinos: lista,
        ...h,
        texto: texto || null,
        plantilla: plantilla || null,
        variables,
        activo: true,
        creado: new Date().toISOString(),
      };
      programaciones.push(p);
      persistir();
      activar(p);
      return p;
    },
    listar: () => programaciones.filter((p) => p.activo),
    cancelar(id) {
      const p = programaciones.find((x) => x.id === id && x.activo);
      if (!p) return false;
      p.activo = false;
      tareas.get(id)?.stop();
      tareas.delete(id);
      persistir();
      return true;
    },
    detener() {
      revisor.stop();
      tareas.forEach((t) => t.stop());
    },
  };
}

// Comandos que solo TÚ (el número ADMIN_NUMERO) puedes mandar por WhatsApp.
// Escríbelos en el chat contigo mismo ("Mensaje a ti mismo") o desde otro teléfono.
import { listarPlantillas, guardarPlantilla, borrarPlantilla, obtenerPlantilla, renderizar } from './plantillas.js';

export const AYUDA = `🤖 *Comandos del bot*

*Plantillas*
!plantillas → ver todas
!plantilla nombre | texto con {{variables}} → crear o cambiar
!verplantilla nombre → ver una
!borrarplantilla nombre

*Programar mensajes*
!programar números | horario | texto
!programar números | horario | plantilla:nombre | var=valor; var2=valor
!programados → ver lo programado
!cancelar id

Horarios: "diario 08:00", "lunes a viernes 7:30", "sabado 10:00", "lunes,jueves 6 pm", "2026-12-24 09:00", "en 30 minutos"

*Otros*
!enviar número | texto → enviar ahora
!pausa / !activar → apagar o prender respuestas con IA
!estado`;

// Separa "!programar a | b | c" en { comando: 'programar', partes: ['a','b','c'] }
export function interpretarComando(texto) {
  const limpio = texto.trim();
  if (!limpio.startsWith('!')) return null;
  const espacio = limpio.indexOf(' ');
  const comando = (espacio === -1 ? limpio.slice(1) : limpio.slice(1, espacio)).toLowerCase();
  const resto = espacio === -1 ? '' : limpio.slice(espacio + 1).trim();
  const partes = resto ? resto.split('|').map((p) => p.trim()) : [];
  return { comando, resto, partes };
}

// "nombre=Ana; curso=Excel" -> { nombre: 'Ana', curso: 'Excel' }
export function leerVariables(texto = '') {
  const vars = {};
  for (const par of texto.split(';')) {
    const i = par.indexOf('=');
    if (i > 0) vars[par.slice(0, i).trim()] = par.slice(i + 1).trim();
  }
  return vars;
}

export async function ejecutarComando(texto, deps) {
  try {
    return await ejecutar(texto, deps);
  } catch (e) {
    return `❌ ${e.message}`;
  }
}

async function ejecutar(texto, { programador, enviar, estado }) {
  const c = interpretarComando(texto);
  if (!c) return null;
  const [p1, p2, p3, p4] = c.partes;

  switch (c.comando) {
    case 'ayuda':
      return AYUDA;

    case 'estado':
      return `Bot: ${estado.pausado ? '⏸️ en pausa' : '✅ activo'}\nProgramados: ${programador.listar().length}\nPlantillas: ${Object.keys(listarPlantillas()).length}`;

    case 'pausa':
      estado.pausado = true;
      return '⏸️ Listo, ya no respondo con IA. Usa !activar para volver.';

    case 'activar':
      estado.pausado = false;
      return '✅ De vuelta, respondiendo con IA.';

    case 'plantillas': {
      const todas = listarPlantillas();
      const nombres = Object.keys(todas);
      if (!nombres.length) return 'No hay plantillas. Crea una con: !plantilla nombre | texto';
      return '📝 *Plantillas*\n' + nombres.map((n) => `• *${n}*: ${todas[n].slice(0, 60)}${todas[n].length > 60 ? '…' : ''}`).join('\n');
    }

    case 'plantilla': {
      if (!p1 || !p2) return 'Uso: !plantilla nombre | texto. Ej: !plantilla bienvenida | Hola {{nombre}}, bienvenido';
      guardarPlantilla(p1, c.resto.slice(c.resto.indexOf('|') + 1).trim());
      return `✅ Plantilla *${p1.toLowerCase()}* guardada.`;
    }

    case 'verplantilla': {
      const t = obtenerPlantilla(c.resto || '');
      return t ? `📝 *${c.resto}*\n\n${t}\n\n👀 Vista previa:\n${renderizar(t, { nombre: 'Ana' })}` : 'No existe esa plantilla.';
    }

    case 'borrarplantilla':
      return borrarPlantilla(c.resto || '') ? '🗑️ Plantilla borrada.' : 'No existe esa plantilla.';

    case 'programar': {
      if (!p1 || !p2 || !p3) return 'Uso: !programar 50370001111 | diario 08:00 | Buenos días {{nombre}}';
      const esPlantilla = p3.toLowerCase().startsWith('plantilla:');
      const p = programador.agregar({
        destinos: p1,
        horario: p2,
        texto: esPlantilla ? null : c.partes.slice(2).join(' | '),
        plantilla: esPlantilla ? p3.slice(10).trim() : null,
        variables: esPlantilla ? leerVariables(p4) : {},
      });
      return `⏰ Programado (id *${p.id}*)\nA: ${p.destinos.join(', ')}\nCuándo: ${p.descripcion}`;
    }

    case 'programados': {
      const lista = programador.listar();
      if (!lista.length) return 'No hay mensajes programados.';
      return '⏰ *Programados*\n' + lista.map((p) =>
        `• *${p.id}* → ${p.destinos.join(', ')} | ${p.descripcion} | ${p.plantilla ? 'plantilla:' + p.plantilla : (p.texto || '').slice(0, 40)}`,
      ).join('\n');
    }

    case 'cancelar':
      return programador.cancelar(c.resto) ? '🗑️ Cancelado.' : 'No encontré ese id. Mira !programados';

    case 'enviar': {
      if (!p1 || !p2) return 'Uso: !enviar 50370001111 | texto';
      await enviar(p1.replace(/\D/g, ''), renderizar(c.partes.slice(1).join(' | ')));
      return '📤 Enviado.';
    }

    default:
      return 'No conozco ese comando. Escribe !ayuda';
  }
}

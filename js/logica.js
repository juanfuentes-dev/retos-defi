(function (raiz) {
  const CONFIG = typeof module !== 'undefined' ? require('./config') : raiz.CONFIG;

  // Todas las funciones devuelven estados nuevos; nunca modifican el original.

  function crearEquipo(id) {
    return { id, nombre: `Equipo ${id}`, tokens: 0, retosResueltos: [], historial: [] };
  }

  function crearEstado() {
    const equipos = Array.from({ length: CONFIG.equiposIniciales }, (_, indice) => crearEquipo(indice + 1));
    return { equipos, primerosRespuestas: {} };
  }

  function buscarEquipo(estado, equipoId) {
    return estado.equipos.find((equipo) => equipo.id === equipoId) || null;
  }

  function nivelPara(tokens) {
    return CONFIG.niveles.reduce(
      (nivelActual, nivel) => (tokens >= nivel.tokensMinimos ? nivel : nivelActual),
      CONFIG.niveles[0]
    );
  }

  function progresoNivel(tokens) {
    const nivel = nivelPara(tokens);
    const siguiente = CONFIG.niveles.find((candidato) => candidato.numero === nivel.numero + 1) || null;
    if (!siguiente) return { nivel, siguiente: null, porcentaje: 100 };

    const tramo = siguiente.tokensMinimos - nivel.tokensMinimos;
    const avance = tokens - nivel.tokensMinimos;
    return { nivel, siguiente, porcentaje: Math.min(100, Math.round((avance / tramo) * 100)) };
  }

  function registro(motivo, cantidad) {
    return { fecha: new Date().toISOString(), motivo, cantidad };
  }

  function actualizarEquipo(estado, equipoId, cambios) {
    return {
      ...estado,
      equipos: estado.equipos.map((equipo) =>
        equipo.id === equipoId ? { ...equipo, ...cambios(equipo) } : equipo
      ),
    };
  }

  function esRespuestaCorrecta(reto, respuesta) {
    if (reto.tipo === 'calculo') {
      return Number.isFinite(respuesta) && Math.abs(respuesta - reto.respuesta) <= reto.tolerancia;
    }
    return respuesta === reto.respuesta;
  }

  function calcularTokensGanados(reto, correcto, primero) {
    if (!correcto) return 0;
    const base = CONFIG.tokensPorDificultad[reto.dificultad];
    return primero ? base + CONFIG.bonoPrimeroEnResponder : base;
  }

  function responderReto(estado, equipoId, reto, respuesta) {
    const equipo = buscarEquipo(estado, equipoId);
    if (!equipo) return { estado, resultado: { ok: false, error: 'Equipo no encontrado.' } };
    if (equipo.retosResueltos.includes(reto.id)) {
      return { estado, resultado: { ok: false, error: 'Este equipo ya respondió este reto.' } };
    }

    const correcto = esRespuestaCorrecta(reto, respuesta);
    const primero = correcto && !estado.primerosRespuestas[reto.id];
    const tokensGanados = calcularTokensGanados(reto, correcto, primero);
    const nivelAnterior = nivelPara(equipo.tokens);
    const nivelNuevo = nivelPara(equipo.tokens + tokensGanados);

    const conPrimero = primero
      ? { ...estado, primerosRespuestas: { ...estado.primerosRespuestas, [reto.id]: equipoId } }
      : estado;
    const siguiente = actualizarEquipo(conPrimero, equipoId, (actual) => ({
      tokens: actual.tokens + tokensGanados,
      retosResueltos: [...actual.retosResueltos, reto.id],
      historial: [
        ...actual.historial,
        registro(`Reto: ${reto.titulo}${correcto ? '' : ' (incorrecto)'}`, tokensGanados),
      ],
    }));

    return {
      estado: siguiente,
      resultado: {
        ok: true,
        correcto,
        primero,
        tokensGanados,
        nivel: nivelNuevo,
        subioNivel: nivelNuevo.numero > nivelAnterior.numero,
      },
    };
  }

  function ajustarTokens(estado, equipoId, cantidad, motivo) {
    const equipo = buscarEquipo(estado, equipoId);
    if (!equipo) return { estado, error: 'Equipo no encontrado.' };
    if (!Number.isInteger(cantidad) || cantidad === 0) {
      return { estado, error: 'La cantidad debe ser un número entero distinto de cero.' };
    }

    const motivoLimpio = String(motivo || '').trim().slice(0, CONFIG.longitudMaximaMotivo) || 'Ajuste del docente';
    const tokensFinales = Math.max(0, equipo.tokens + cantidad);
    const cambio = tokensFinales - equipo.tokens;

    return {
      estado: actualizarEquipo(estado, equipoId, (actual) => ({
        tokens: tokensFinales,
        historial: [...actual.historial, registro(motivoLimpio, cambio)],
      })),
      error: null,
    };
  }

  function renombrarEquipo(estado, equipoId, nombre) {
    if (!buscarEquipo(estado, equipoId)) return { estado, error: 'Equipo no encontrado.' };

    const limpio = String(nombre || '').trim();
    if (limpio === '' || limpio.length > CONFIG.longitudMaximaNombre) {
      return {
        estado,
        error: `El nombre debe tener entre 1 y ${CONFIG.longitudMaximaNombre} caracteres.`,
      };
    }
    return { estado: actualizarEquipo(estado, equipoId, () => ({ nombre: limpio })), error: null };
  }

  function esEquipoValido(equipo) {
    return (
      equipo !== null &&
      typeof equipo === 'object' &&
      Number.isInteger(equipo.id) &&
      typeof equipo.nombre === 'string' &&
      Number.isInteger(equipo.tokens) &&
      equipo.tokens >= 0 &&
      Array.isArray(equipo.retosResueltos) &&
      Array.isArray(equipo.historial)
    );
  }

  function esEstadoValido(estado) {
    return (
      estado !== null &&
      typeof estado === 'object' &&
      Array.isArray(estado.equipos) &&
      estado.equipos.length > 0 &&
      estado.equipos.every(esEquipoValido) &&
      estado.primerosRespuestas !== null &&
      typeof estado.primerosRespuestas === 'object'
    );
  }

  const LOGICA = {
    crearEstado,
    buscarEquipo,
    nivelPara,
    progresoNivel,
    esRespuestaCorrecta,
    responderReto,
    ajustarTokens,
    renombrarEquipo,
    esEstadoValido,
  };

  if (typeof module !== 'undefined') module.exports = LOGICA;
  else raiz.LOGICA = LOGICA;
})(typeof window !== 'undefined' ? window : globalThis);

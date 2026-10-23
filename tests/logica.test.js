const test = require('node:test');
const assert = require('node:assert/strict');
const CONFIG = require('../js/config');
const LOGICA = require('../js/logica');

const RETO_OPCION = {
  id: 'r-opcion',
  titulo: 'Reto de prueba',
  tipo: 'opcion',
  dificultad: 1,
  respuesta: 0,
  tema: 'Tokens',
  explicacion: 'x',
};

const RETO_CALCULO = {
  id: 'r-calculo',
  titulo: 'Cálculo de prueba',
  tipo: 'calculo',
  dificultad: 3,
  respuesta: 1500,
  tolerancia: 1,
  tema: 'DeFi',
  explicacion: 'x',
};

test('crearEstado genera seis equipos sin tokens', () => {
  const estado = LOGICA.crearEstado();
  assert.equal(estado.equipos.length, CONFIG.equiposIniciales);
  assert.ok(estado.equipos.every((equipo) => equipo.tokens === 0));
  assert.deepEqual(estado.primerosRespuestas, {});
});

test('nivelPara usa los umbrales de config', () => {
  assert.equal(LOGICA.nivelPara(0).numero, 1);
  assert.equal(LOGICA.nivelPara(59).numero, 1);
  assert.equal(LOGICA.nivelPara(60).numero, 2);
  assert.equal(LOGICA.nivelPara(400).numero, 5);
  assert.equal(LOGICA.nivelPara(9999).numero, 5);
});

test('progresoNivel calcula el porcentaje hacia el siguiente nivel', () => {
  const progreso = LOGICA.progresoNivel(105);
  assert.equal(progreso.nivel.numero, 2);
  assert.equal(progreso.siguiente.numero, 3);
  assert.equal(progreso.porcentaje, 50);
  assert.equal(LOGICA.progresoNivel(500).porcentaje, 100);
});

test('respuesta correcta da tokens y bono al primero', () => {
  const inicial = LOGICA.crearEstado();
  const { estado, resultado } = LOGICA.responderReto(inicial, 1, RETO_OPCION, 0);
  const equipo = LOGICA.buscarEquipo(estado, 1);

  assert.equal(resultado.ok, true);
  assert.equal(resultado.correcto, true);
  assert.equal(resultado.primero, true);
  assert.equal(equipo.tokens, CONFIG.tokensPorDificultad[1] + CONFIG.bonoPrimeroEnResponder);
  assert.equal(estado.primerosRespuestas[RETO_OPCION.id], 1);
});

test('solo el primer equipo correcto recibe el bono', () => {
  const primero = LOGICA.responderReto(LOGICA.crearEstado(), 1, RETO_OPCION, 0).estado;
  const { estado, resultado } = LOGICA.responderReto(primero, 2, RETO_OPCION, 0);

  assert.equal(resultado.primero, false);
  assert.equal(LOGICA.buscarEquipo(estado, 2).tokens, CONFIG.tokensPorDificultad[1]);
  assert.equal(estado.primerosRespuestas[RETO_OPCION.id], 1);
});

test('respuesta incorrecta no da tokens pero cuenta como intento', () => {
  const { estado, resultado } = LOGICA.responderReto(LOGICA.crearEstado(), 1, RETO_OPCION, 3);
  const equipo = LOGICA.buscarEquipo(estado, 1);

  assert.equal(resultado.correcto, false);
  assert.equal(resultado.tokensGanados, 0);
  assert.deepEqual(equipo.retosResueltos, [RETO_OPCION.id]);
  assert.equal(estado.primerosRespuestas[RETO_OPCION.id], undefined);
});

test('un equipo no puede responder dos veces el mismo reto', () => {
  const primera = LOGICA.responderReto(LOGICA.crearEstado(), 1, RETO_OPCION, 3).estado;
  const { estado, resultado } = LOGICA.responderReto(primera, 1, RETO_OPCION, 0);

  assert.equal(resultado.ok, false);
  assert.equal(estado, primera);
});

test('responderReto no muta el estado original', () => {
  const original = LOGICA.crearEstado();
  const copia = JSON.stringify(original);
  LOGICA.responderReto(original, 1, RETO_OPCION, 0);
  assert.equal(JSON.stringify(original), copia);
});

test('responderReto informa cuando el equipo sube de nivel', () => {
  const estadoConCasiNivel = LOGICA.ajustarTokens(LOGICA.crearEstado(), 1, 55, 'prueba').estado;
  const { resultado } = LOGICA.responderReto(estadoConCasiNivel, 1, RETO_OPCION, 0);

  assert.equal(resultado.subioNivel, true);
  assert.equal(resultado.nivel.numero, 2);
});

test('cálculo acepta valores dentro de la tolerancia', () => {
  assert.equal(LOGICA.esRespuestaCorrecta(RETO_CALCULO, 1500), true);
  assert.equal(LOGICA.esRespuestaCorrecta(RETO_CALCULO, 1501), true);
  assert.equal(LOGICA.esRespuestaCorrecta(RETO_CALCULO, 1502), false);
  assert.equal(LOGICA.esRespuestaCorrecta(RETO_CALCULO, NaN), false);
});

test('ajustarTokens suma, resta sin bajar de cero y registra historial', () => {
  const sumado = LOGICA.ajustarTokens(LOGICA.crearEstado(), 2, 25, 'Participación');
  assert.equal(LOGICA.buscarEquipo(sumado.estado, 2).tokens, 25);

  const restado = LOGICA.ajustarTokens(sumado.estado, 2, -100, '');
  const equipo = LOGICA.buscarEquipo(restado.estado, 2);
  assert.equal(equipo.tokens, 0);
  assert.equal(equipo.historial.at(-1).cantidad, -25);
  assert.equal(equipo.historial.at(-1).motivo, 'Ajuste del docente');
});

test('ajustarTokens rechaza cantidades no válidas', () => {
  const estado = LOGICA.crearEstado();
  assert.ok(LOGICA.ajustarTokens(estado, 1, 0, '').error);
  assert.ok(LOGICA.ajustarTokens(estado, 1, 1.5, '').error);
  assert.ok(LOGICA.ajustarTokens(estado, 99, 5, '').error);
});

test('renombrarEquipo valida longitud y aplica el nombre limpio', () => {
  const estado = LOGICA.crearEstado();
  assert.ok(LOGICA.renombrarEquipo(estado, 1, '   ').error);
  assert.ok(LOGICA.renombrarEquipo(estado, 1, 'x'.repeat(CONFIG.longitudMaximaNombre + 1)).error);

  const { estado: nuevo, error } = LOGICA.renombrarEquipo(estado, 1, '  Los Mineros  ');
  assert.equal(error, null);
  assert.equal(LOGICA.buscarEquipo(nuevo, 1).nombre, 'Los Mineros');
});

test('esEstadoValido acepta respaldos correctos y rechaza datos basura', () => {
  assert.equal(LOGICA.esEstadoValido(LOGICA.crearEstado()), true);
  assert.equal(LOGICA.esEstadoValido(null), false);
  assert.equal(LOGICA.esEstadoValido({ equipos: [] , primerosRespuestas: {} }), false);
  assert.equal(LOGICA.esEstadoValido({ equipos: [{ id: 1, nombre: 'a', tokens: -5, retosResueltos: [], historial: [] }], primerosRespuestas: {} }), false);
});

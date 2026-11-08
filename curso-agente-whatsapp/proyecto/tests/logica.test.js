import { test } from 'node:test';
import assert from 'node:assert/strict';
import { interpretarHorario, pendientesDeEnviar } from '../src/horario.js';
import { renderizar } from '../src/plantillas.js';
import { buscarRespuestaRapida } from '../src/respuestas.js';
import { interpretarComando, leerVariables } from '../src/comandos.js';
import { limpiarRespuesta } from '../src/ia.js';

const AHORA = new Date(2026, 10, 8, 10, 0); // 8 nov 2026, 10:00

test('horarios repetidos', () => {
  assert.equal(interpretarHorario('diario 08:00').cron, '0 8 * * *');
  assert.equal(interpretarHorario('Todos los días 6:30 pm').cron, '30 18 * * *');
  assert.equal(interpretarHorario('lunes a viernes 7:30').cron, '30 7 * * 1-5');
  assert.equal(interpretarHorario('lunes, miércoles y viernes 18:00').cron, '0 18 * * 1,3,5');
  assert.equal(interpretarHorario('sábado 10:00').cron, '0 10 * * 6');
  assert.equal(interpretarHorario('fin de semana 9 am').cron, '0 9 * * 0,6');
  assert.equal(interpretarHorario('cron */15 * * * *').cron, '*/15 * * * *');
});

test('horarios de una sola vez', () => {
  const a = interpretarHorario('2026-12-24 09:00', AHORA);
  assert.equal(a.tipo, 'una_vez');
  assert.equal(new Date(a.fecha).getTime(), new Date(2026, 11, 24, 9, 0).getTime());
  const b = interpretarHorario('24/12/2026 9:00', AHORA);
  assert.equal(b.fecha, a.fecha);
  const c = interpretarHorario('en 30 minutos', AHORA);
  assert.equal(new Date(c.fecha).getTime(), AHORA.getTime() + 30 * 60e3);
  assert.throws(() => interpretarHorario('2020-01-01 09:00', AHORA), /ya pasó/);
  assert.throws(() => interpretarHorario('cuando sea'), /hora/);
  assert.throws(() => interpretarHorario('marzo 08:00'), /No entendí/);
});

test('pendientes de enviar', () => {
  const lista = [
    { id: 'a', activo: true, tipo: 'una_vez', fecha: new Date(2026, 10, 8, 9, 0).toISOString() },
    { id: 'b', activo: true, tipo: 'una_vez', fecha: new Date(2026, 10, 8, 11, 0).toISOString() },
    { id: 'c', activo: false, tipo: 'una_vez', fecha: new Date(2026, 10, 8, 9, 0).toISOString() },
    { id: 'd', activo: true, tipo: 'repetir', cron: '0 8 * * *' },
  ];
  assert.deepEqual(pendientesDeEnviar(lista, AHORA).map((p) => p.id), ['a']);
});

test('plantillas', () => {
  assert.equal(renderizar('Hola {{nombre}}, hoy es {{dia}}', { nombre: 'Ana' }, AHORA), 'Hola Ana, hoy es domingo');
  assert.equal(renderizar('{{saludo}}', {}, AHORA), 'Buenos días');
  assert.equal(renderizar('Falta {{x}}', {}, AHORA), 'Falta {{x}}');
});

test('respuestas rápidas', () => {
  const reglas = [{ palabras: ['horario', 'dirección'], respuesta: 'R' }];
  assert.equal(buscarRespuestaRapida('¿Cuál es el HORARIO?', reglas), 'R');
  assert.equal(buscarRespuestaRapida('me das la direccion', reglas), 'R');
  assert.equal(buscarRespuestaRapida('horarios no cuenta como palabra exacta', reglas), null);
  assert.equal(buscarRespuestaRapida('precio del curso', reglas), null);
});

test('comandos', () => {
  assert.deepEqual(interpretarComando('!programar 503 | diario 08:00 | hola').partes, ['503', 'diario 08:00', 'hola']);
  assert.equal(interpretarComando('!AYUDA').comando, 'ayuda');
  assert.equal(interpretarComando('hola'), null);
  assert.deepEqual(leerVariables('nombre=Ana; curso = Excel'), { nombre: 'Ana', curso: 'Excel' });
});

test('limpiar pensamiento de modelos tipo Qwen3', () => {
  assert.equal(limpiarRespuesta('<think>mmm</think>\nHola!'), 'Hola!');
});

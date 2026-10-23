const test = require('node:test');
const assert = require('node:assert/strict');
const CONFIG = require('../js/config');
const RETOS = require('../js/retos');

test('cada reto tiene id único y dificultad conocida', () => {
  const ids = RETOS.map((reto) => reto.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(RETOS.every((reto) => CONFIG.tokensPorDificultad[reto.dificultad] !== undefined));
});

test('las respuestas de opción apuntan a una opción existente', () => {
  RETOS.filter((reto) => reto.tipo === 'opcion').forEach((reto) => {
    assert.ok(reto.respuesta >= 0 && reto.respuesta < reto.opciones.length, reto.id);
  });
});

test('los retos de cálculo tienen respuesta numérica y tolerancia', () => {
  RETOS.filter((reto) => reto.tipo === 'calculo').forEach((reto) => {
    assert.equal(typeof reto.respuesta, 'number', reto.id);
    assert.equal(typeof reto.tolerancia, 'number', reto.id);
  });
});

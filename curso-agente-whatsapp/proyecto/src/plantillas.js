// Plantillas: mensajes reutilizables con huecos como {{nombre}} o {{fecha}}.
import { leer, guardar } from './almacen.js';

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

// Variables que siempre están disponibles en cualquier plantilla.
export function variablesAutomaticas(ahora = new Date()) {
  const dd = String(ahora.getDate()).padStart(2, '0');
  const mm = String(ahora.getMonth() + 1).padStart(2, '0');
  const hh = String(ahora.getHours()).padStart(2, '0');
  const mi = String(ahora.getMinutes()).padStart(2, '0');
  return {
    fecha: `${dd}/${mm}/${ahora.getFullYear()}`,
    hora: `${hh}:${mi}`,
    dia: DIAS[ahora.getDay()],
    saludo: ahora.getHours() < 12 ? 'Buenos días' : ahora.getHours() < 19 ? 'Buenas tardes' : 'Buenas noches',
  };
}

// Cambia {{variable}} por su valor. Si falta un valor, deja el hueco tal cual.
export function renderizar(texto, variables = {}, ahora = new Date()) {
  const todas = { ...variablesAutomaticas(ahora), ...variables };
  return texto.replace(/\{\{\s*(\w+)\s*\}\}/g, (hueco, clave) =>
    clave in todas ? String(todas[clave]) : hueco,
  );
}

export function listarPlantillas() {
  return leer('plantillas', {});
}

export function obtenerPlantilla(nombre) {
  return listarPlantillas()[nombre.toLowerCase()];
}

export function guardarPlantilla(nombre, texto) {
  const todas = listarPlantillas();
  todas[nombre.toLowerCase()] = texto;
  guardar('plantillas', todas);
}

export function borrarPlantilla(nombre) {
  const todas = listarPlantillas();
  const existia = nombre.toLowerCase() in todas;
  delete todas[nombre.toLowerCase()];
  guardar('plantillas', todas);
  return existia;
}

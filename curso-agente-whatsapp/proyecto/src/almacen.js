// Guarda y lee datos en archivos JSON dentro de la carpeta data/.
// Es la "base de datos" más simple posible: puedes abrir los archivos y verlos.
import fs from 'node:fs';
import path from 'node:path';
import { config } from './config.js';

function ruta(nombre) {
  return path.resolve(config.dataDir, `${nombre}.json`);
}

export function leer(nombre, defecto) {
  try {
    return JSON.parse(fs.readFileSync(ruta(nombre), 'utf8'));
  } catch {
    return defecto;
  }
}

export function guardar(nombre, valor) {
  const archivo = ruta(nombre);
  fs.mkdirSync(path.dirname(archivo), { recursive: true });
  // Se escribe primero a un archivo temporal para no corromper datos si se apaga la PC.
  fs.writeFileSync(`${archivo}.tmp`, JSON.stringify(valor, null, 2));
  fs.renameSync(`${archivo}.tmp`, archivo);
}

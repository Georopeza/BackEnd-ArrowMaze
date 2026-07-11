import fs from 'fs';
import path from 'path';

import { StructuredLevelJsonDto } from '../../../../docs/contract/level.contract';

/**
 * Sube desde [startDir] hasta encontrar un directorio con `package.json`
 * (raíz del repo).
 *
 * Subir un número fijo de niveles desde `__dirname` es frágil: en modo
 * desarrollo (`ts-node-dev` sobre `src/`) hacen falta 4 niveles, pero en el
 * build compilado (`dist/src/...`, porque `rootDir` es `.` y por eso `tsc`
 * conserva el prefijo `src/`) hacen falta 5 — la constante original solo
 * contaba 4 y por eso `dist/levels` (inexistente) fallaba en producción.
 * Buscar `package.json` funciona igual en ambos casos.
 */
function findRepoRoot(startDir: string): string {
  let dir = startDir;
  while (!fs.existsSync(path.join(dir, 'package.json'))) {
    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error(`Could not locate repo root (package.json) from ${startDir}`);
    }
    dir = parent;
  }
  return dir;
}

/** Ruta por defecto del directorio de niveles seed (`levels/` en la raíz del repo). */
export const DEFAULT_LEVELS_DIRECTORY = path.join(findRepoRoot(__dirname), 'levels');

/**
 * Carga el catálogo seed leyendo todos los archivos `*.json` de [levelsDir].
 *
 * El nombre del archivo no define el orden de juego: la progresión usa
 * `levelNumber` dentro de cada JSON. Los archivos se leen en orden
 * lexicográfico solo para comportamiento determinista al cargar.
 *
 * @param levelsDir Carpeta con definiciones `StructuredLevelJsonDto` (un nivel por archivo).
 * @returns Lista de DTOs parseados; la validación estructural la aplica el llamador.
 * @throws Error si el directorio no existe o un archivo no es JSON válido.
 */
export function loadLevelCatalogFromDirectory(
  levelsDir: string = DEFAULT_LEVELS_DIRECTORY,
): StructuredLevelJsonDto[] {
  if (!fs.existsSync(levelsDir)) {
    throw new Error(`Level catalog directory not found: ${levelsDir}`);
  }

  const jsonFiles = fs
    .readdirSync(levelsDir)
    .filter(file => file.endsWith('.json'))
    .sort();

  if (jsonFiles.length === 0) {
    throw new Error(`No level JSON files found in: ${levelsDir}`);
  }

  return jsonFiles.map(file => {
    const filePath = path.join(levelsDir, file);
    let parsed: unknown;

    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      parsed = JSON.parse(raw);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to parse level file "${file}": ${message}`);
    }

    return parsed as StructuredLevelJsonDto;
  });
}

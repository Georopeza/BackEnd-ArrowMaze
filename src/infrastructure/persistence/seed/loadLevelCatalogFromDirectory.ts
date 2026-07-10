import fs from 'fs';
import path from 'path';

import { StructuredLevelJsonDto } from '../../../../docs/contract/level.contract';

/**
 * Ruta por defecto del directorio de niveles seed (`levels/` en la raíz del repo).
 *
 * Resuelve desde `dist/infrastructure/persistence/seed/` o `src/...` hacia arriba
 * cuatro niveles hasta la raíz del proyecto.
 */
export const DEFAULT_LEVELS_DIRECTORY = path.resolve(__dirname, '../../../../levels');

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

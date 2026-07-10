import fs from 'fs';
import path from 'path';

import { AppContainer } from '../../http/container';
import { StructuredLevelJsonDto } from '../../../../docs/contract/level.contract';
import { parseLevelJsonFile } from './parseLevelJsonFile';
import { DEFAULT_LEVELS_DIRECTORY } from './loadLevelCatalogFromDirectory';

/** Resultado de sincronizar uno o varios archivos del catálogo con el repositorio. */
export interface SyncLevelCatalogResult {
  /** Cantidad de niveles upsertados correctamente en esta ejecución. */
  synced: number;
  /** Identificadores de los niveles sincronizados. */
  levelIds: string[];
}

/**
 * Lista rutas absolutas de todos los `*.json` en [levelsDir] (orden lexicográfico).
 *
 * @param levelsDir Carpeta del catálogo seed; por defecto [DEFAULT_LEVELS_DIRECTORY].
 * @returns Rutas absolutas a cada archivo de nivel.
 * @throws Error si el directorio no existe.
 */
export function listLevelJsonFiles(levelsDir: string = DEFAULT_LEVELS_DIRECTORY): string[] {
  if (!fs.existsSync(levelsDir)) {
    throw new Error(`Level catalog directory not found: ${levelsDir}`);
  }

  return fs
    .readdirSync(levelsDir)
    .filter(file => file.endsWith('.json'))
    .sort()
    .map(file => path.join(levelsDir, file));
}

/**
 * Inserta o actualiza un nivel en el repositorio a partir de un archivo JSON.
 *
 * Reutiliza [UpsertLevelUseCase] (validación de solvabilidad incluida).
 *
 * @param container Composition root con el caso de uso de upsert.
 * @param filePath Ruta absoluta al archivo `.json` del nivel.
 * @returns DTO persistido tras la validación y el guardado.
 * @throws Propaga errores de parseo o de dominio (p. ej. nivel no resoluble).
 */
export async function upsertLevelFromFile(
  container: AppContainer,
  filePath: string,
): Promise<StructuredLevelJsonDto> {
  const dto = parseLevelJsonFile(filePath);
  return container.upsertLevel.execute(dto);
}

/**
 * Sincroniza todos los JSON de [levelsDir] con el repositorio (seed / recarga completa).
 *
 * @param container Composition root ya construido.
 * @param levelsDir Carpeta del catálogo; por defecto [DEFAULT_LEVELS_DIRECTORY].
 * @returns Cantidad de niveles sincronizados e ids afectados.
 * @throws Error si el directorio está vacío o algún upsert falla.
 */
export async function syncLevelCatalogFromDirectory(
  container: AppContainer,
  levelsDir: string = DEFAULT_LEVELS_DIRECTORY,
): Promise<SyncLevelCatalogResult> {
  const files = listLevelJsonFiles(levelsDir);

  if (files.length === 0) {
    throw new Error(`No level JSON files found in: ${levelsDir}`);
  }

  const levelIds: string[] = [];

  for (const filePath of files) {
    const saved = await upsertLevelFromFile(container, filePath);
    levelIds.push(saved.id);
  }

  return { synced: levelIds.length, levelIds };
}

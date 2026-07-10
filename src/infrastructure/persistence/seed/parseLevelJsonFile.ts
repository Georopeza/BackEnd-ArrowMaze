import fs from 'fs';

import { StructuredLevelJsonDto } from '../../../../docs/contract/level.contract';

/**
 * Lee y parsea un archivo JSON de nivel (`StructuredLevelJsonDto`).
 *
 * @param filePath Ruta absoluta al archivo `.json`.
 * @returns DTO del nivel parseado.
 * @throws Error si el archivo no existe o el JSON es inválido.
 */
export function parseLevelJsonFile(filePath: string): StructuredLevelJsonDto {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Level file not found: ${filePath}`);
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as StructuredLevelJsonDto;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse level file "${filePath}": ${message}`);
  }
}

import { StructuredLevelJsonDto } from '../../../../docs/contract/level.contract';
import { SEED_LEVELS_01_TO_05 } from './catalogEntries/seedLevels01to05';
import { SEED_LEVELS_06_TO_10 } from './catalogEntries/seedLevels06to10';
import { SEED_LEVELS_11_TO_15 } from './catalogEntries/seedLevels11to15';

/**
 * Número total de niveles que el bootstrap inserta al arrancar el servidor.
 *
 * Usado en tests de integración para verificar `GET /levels` sin duplicar
 * la longitud del array en varios archivos.
 */
export const LEVEL_SEED_CATALOG_SIZE = 15;

/**
 * Catálogo completo de niveles en formato wire (`StructuredLevelJsonDto`).
 *
 * Fuente compartida con el frontend (`docs/levels/simple-1.json` para el
 * nivel 1). Cada entrada debe ser jugable según `LevelSolvabilityValidator`
 * antes de mergear (ver `levelSeedCatalog.spec.ts`).
 *
 * Se inserta al arrancar el servidor vía [seedLevelCatalog] cuando
 * `createServer(..., { seedLevels: true })`.
 */
export const LEVEL_SEED_CATALOG: StructuredLevelJsonDto[] = [
  ...SEED_LEVELS_01_TO_05,
  ...SEED_LEVELS_06_TO_10,
  ...SEED_LEVELS_11_TO_15,
];

/**
 * Devuelve el catálogo ordenado por `levelNumber` ascendente.
 *
 * Útil para documentación o herramientas que requieran progresión lineal;
 * el orden del array fuente ya es 1…15, pero esta función garantiza la
 * invariante tras futuras ediciones del catálogo.
 */
export function getOrderedSeedCatalog(): StructuredLevelJsonDto[] {
  return [...LEVEL_SEED_CATALOG].sort((a, b) => a.levelNumber - b.levelNumber);
}

/**
 * Valida invariantes estructurales del catálogo (sin reglas de solvabilidad).
 *
 * Comprueba ids únicos, `levelNumber` únicos y coherencia mínima de campos.
 * La jugabilidad se valida en tests con `LevelSolvabilityValidator`.
 *
 * @throws Error si el catálogo viola alguna invariante.
 */
export function assertSeedCatalogInvariants(catalog: StructuredLevelJsonDto[] = LEVEL_SEED_CATALOG): void {
  const ids = new Set<string>();
  const levelNumbers = new Set<number>();

  for (const level of catalog) {
    if (ids.has(level.id)) {
      throw new Error(`Duplicate seed level id: ${level.id}`);
    }
    ids.add(level.id);

    if (levelNumbers.has(level.levelNumber)) {
      throw new Error(`Duplicate seed levelNumber: ${level.levelNumber}`);
    }
    levelNumbers.add(level.levelNumber);

    if (level.width < 1 || level.height < 1) {
      throw new Error(`Level ${level.id}: invalid board dimensions`);
    }

    if (level.maxMoves < 1) {
      throw new Error(`Level ${level.id}: maxMoves must be positive`);
    }
  }
}

// Falla rápido al importar el módulo si el catálogo tiene ids duplicados.
assertSeedCatalogInvariants();

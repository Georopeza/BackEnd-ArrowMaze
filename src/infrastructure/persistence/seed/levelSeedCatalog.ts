import { StructuredLevelJsonDto } from '../../../../docs/contract/level.contract';
import { loadLevelCatalogFromDirectory } from './loadLevelCatalogFromDirectory';

/**
 * Catálogo completo de niveles en formato wire (`StructuredLevelJsonDto`).
 *
 * Cada nivel vive en un archivo JSON bajo `levels/` en la raíz del repo
 * (convención `NN-id.json`, p. ej. `01-simple-1.json`). Para añadir niveles
 * en el futuro basta con agregar un JSON válido a esa carpeta y reiniciar
 * el servidor con seed habilitado.
 *
 * Fuente compartida con el frontend (`docs/levels/simple-1.json` para el
 * nivel 1). Cada entrada debe ser jugable según `LevelSolvabilityValidator`
 * antes de mergear (ver `levelSeedCatalog.spec.ts`).
 *
 * Se inserta al arrancar el servidor vía [seedLevelCatalog] cuando
 * `createServer(..., { seedLevels: true })`.
 */
export const LEVEL_SEED_CATALOG: StructuredLevelJsonDto[] = loadLevelCatalogFromDirectory();

/**
 * Número total de niveles que el bootstrap inserta al arrancar el servidor.
 *
 * Derivado del catálogo cargado desde disco para no duplicar la cantidad
 * en varios archivos al crecer el juego.
 */
export const LEVEL_SEED_CATALOG_SIZE = LEVEL_SEED_CATALOG.length;

/**
 * Devuelve el catálogo ordenado por `levelNumber` ascendente.
 *
 * Útil para documentación o herramientas que requieran progresión lineal.
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

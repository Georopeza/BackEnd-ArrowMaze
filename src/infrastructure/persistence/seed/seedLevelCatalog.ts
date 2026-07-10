import { AppContainer } from '../../http/container';
import { LEVEL_SEED_CATALOG_SIZE } from './levelSeedCatalog';
import { syncLevelCatalogFromDirectory } from './syncLevelCatalogFromDirectory';

/**
 * Resultado detallado de una ejecución de seed del catálogo de niveles.
 */
export interface SeedLevelCatalogResult {
  /** Cantidad de niveles insertados o actualizados correctamente. */
  seeded: number;
  /** Total esperado según [LEVEL_SEED_CATALOG_SIZE]. */
  expected: number;
}

/**
 * Inserta el catálogo inicial de niveles (JSON en `levels/`) en el repositorio.
 *
 * Reutiliza [syncLevelCatalogFromDirectory] y las mismas reglas de negocio
 * que un `PUT /levels/:id` (validación de solvabilidad + persistencia).
 * Idempotente: volver a ejecutar sobre el mismo proceso sobrescribe por `id`.
 *
 * @param container Composition root ya construido (mismas instancias que HTTP).
 * @returns Resumen con cantidad sembrada y total esperado.
 * @throws Propaga errores de dominio (p. ej. nivel no resoluble) para fallar el bootstrap.
 */
export async function seedLevelCatalog(container: AppContainer): Promise<SeedLevelCatalogResult> {
  const result = await syncLevelCatalogFromDirectory(container);

  return {
    seeded: result.synced,
    expected: LEVEL_SEED_CATALOG_SIZE,
  };
}

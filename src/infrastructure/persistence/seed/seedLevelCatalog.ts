import { AppContainer } from '../../http/container';
import { LEVEL_SEED_CATALOG, LEVEL_SEED_CATALOG_SIZE } from './levelSeedCatalog';

/**
 * Resultado detallado de una ejecución de seed del catálogo de niveles.
 */
export interface SeedLevelCatalogResult {
  /** Cantidad de niveles insertados o actualizados correctamente. */
  seeded: number;
  /** Total esperado según [LEVEL_SEED_CATALOG]. */
  expected: number;
}

/**
 * Inserta el catálogo inicial de niveles en el repositorio in-memory.
 *
 * Reutiliza [UpsertLevelUseCase] para aplicar las mismas reglas de negocio
 * que un `PUT /levels/:id` (validación de solvabilidad + persistencia).
 * Idempotente: volver a ejecutar sobre el mismo proceso sobrescribe por `id`.
 *
 * @param container Composition root ya construido (mismas instancias que HTTP).
 * @returns Resumen con cantidad sembrada y total esperado.
 * @throws Propaga errores de dominio (p. ej. nivel no resoluble) para fallar el bootstrap.
 */
export async function seedLevelCatalog(container: AppContainer): Promise<SeedLevelCatalogResult> {
  let seeded = 0;

  for (const levelDto of LEVEL_SEED_CATALOG) {
    await container.upsertLevel.execute(levelDto);
    seeded += 1;
  }

  return {
    seeded,
    expected: LEVEL_SEED_CATALOG_SIZE,
  };
}

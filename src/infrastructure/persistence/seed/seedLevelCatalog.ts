import { AppContainer } from '../../http/container';
import { LEVEL_SEED_CATALOG_SIZE } from './levelSeedCatalog';
import { SyncLevelCatalogFailure, syncLevelCatalogFromDirectory } from './syncLevelCatalogFromDirectory';

/**
 * Resultado detallado de una ejecución de seed del catálogo de niveles.
 */
export interface SeedLevelCatalogResult {
  /** Cantidad de niveles insertados o actualizados correctamente. */
  seeded: number;
  /** Total esperado según [LEVEL_SEED_CATALOG_SIZE]. */
  expected: number;
  /** Archivos de nivel que se omitieron por fallar el parseo o la validación de solvabilidad. */
  failed: SyncLevelCatalogFailure[];
}

/**
 * Inserta el catálogo inicial de niveles (JSON en `levels/`) en el repositorio.
 *
 * Reutiliza [syncLevelCatalogFromDirectory] y las mismas reglas de negocio
 * que un `PUT /levels/:id` (validación de solvabilidad + persistencia).
 * Idempotente: volver a ejecutar sobre el mismo proceso sobrescribe por `id`.
 *
 * Resiliente por nivel: un archivo roto o no resoluble se omite y se reporta
 * en `failed`, pero el bootstrap **ya no aborta** por eso — el resto del
 * catálogo válido queda servido igual. (Antes, un único nivel malo tumbaba
 * el arranque completo del servidor; ver `AI_USAGE.md`.)
 *
 * @param container Composition root ya construido (mismas instancias que HTTP).
 * @returns Resumen con cantidad sembrada, total esperado y archivos fallidos.
 * @throws Solo si `levels/` no existe o está vacío (error de configuración, no de contenido).
 */
export async function seedLevelCatalog(container: AppContainer): Promise<SeedLevelCatalogResult> {
  const result = await syncLevelCatalogFromDirectory(container);

  return {
    seeded: result.synced,
    expected: LEVEL_SEED_CATALOG_SIZE,
    failed: result.failed,
  };
}

import { AppContainer } from '../../http/container';
import { LEVEL_SEED_CATALOG } from './levelSeedCatalog';

/**
 * Inserta el catálogo inicial de niveles en el repositorio in-memory.
 *
 * Reutiliza [UpsertLevelUseCase] para aplicar las mismas reglas de negocio
 * que un `PUT /levels/:id` (validación de solvabilidad + persistencia).
 * Idempotente: volver a ejecutar sobre el mismo proceso sobrescribe por `id`.
 *
 * @param container Composition root ya construido (mismas instancias que HTTP).
 * @returns Cantidad de niveles procesados correctamente.
 */
export async function seedLevelCatalog(container: AppContainer): Promise<number> {
  let seeded = 0;

  for (const levelDto of LEVEL_SEED_CATALOG) {
    await container.upsertLevel.execute(levelDto);
    seeded += 1;
  }

  return seeded;
}

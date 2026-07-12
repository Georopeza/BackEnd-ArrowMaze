import { Direction } from '../../../src/domain/value-objects/Direction';
import {
  LevelSolvabilityValidator,
  StructuredLevelJsonDto as ValidatorDto,
} from '../../../src/domain/services/LevelSolvabilityValidator';
import {
  LEVEL_SEED_CATALOG,
  LEVEL_SEED_CATALOG_SIZE,
  assertSeedCatalogInvariants,
  getOrderedSeedCatalog,
} from '../../../src/infrastructure/persistence/seed/levelSeedCatalog';
import { listLevelJsonFiles } from '../../../src/infrastructure/persistence/seed/syncLevelCatalogFromDirectory';

/**
 * Convierte un DTO del contrato compartido al shape que usa el validador de dominio.
 *
 * El validador interno espera `Direction` enum en lugar de strings wire-format.
 */
function toValidatorDto(dto: (typeof LEVEL_SEED_CATALOG)[number]): ValidatorDto {
  return {
    id: dto.id,
    levelNumber: dto.levelNumber,
    difficulty: dto.difficulty,
    maxMoves: dto.maxMoves,
    maxTimeInSeconds: dto.maxTimeInSeconds,
    width: dto.width,
    height: dto.height,
    walls: dto.walls,
    arrows: dto.arrows.map(arrow => ({
      id: arrow.id,
      direction: Direction[arrow.direction as keyof typeof Direction],
      head: arrow.head,
      body: arrow.body,
    })),
  };
}

describe('LEVEL_SEED_CATALOG', () => {
  const validator = new LevelSolvabilityValidator();

  it('should_match_the_number_of_json_files_in_the_levels_directory', () => {
    // El tamaño del catálogo debe seguir a `levels/*.json`, no a un número
    // fijo: cada archivo nuevo que el equipo agregue debe reflejarse aquí
    // sin tener que tocar este test. Si algún día `loadLevelCatalogFromDirectory`
    // empezara a filtrar/saltar archivos, esta comparación lo detectaría.
    const fileCount = listLevelJsonFiles().length;
    expect(LEVEL_SEED_CATALOG).toHaveLength(fileCount);
    expect(LEVEL_SEED_CATALOG_SIZE).toBe(fileCount);
  });

  it('should_have_unique_ids_and_level_numbers', () => {
    expect(() => assertSeedCatalogInvariants()).not.toThrow();
  });

  it('should_be_ordered_ascending_by_level_number_when_using_getOrderedSeedCatalog', () => {
    // No asumimos numeración consecutiva (1,2,3,4,...): el progreso del
    // jugador se calcula por orden relativo, no por aritmética de +1
    // (ver RecordVictoryUseCase._findNextLevel en el cliente), así que
    // huecos en levelNumber tras retirar niveles son válidos.
    const ordered = getOrderedSeedCatalog();
    for (let i = 1; i < ordered.length; i += 1) {
      expect(ordered[i].levelNumber).toBeGreaterThan(ordered[i - 1].levelNumber);
    }
  });

  it.each(LEVEL_SEED_CATALOG.map(level => [level.id, level] as const))(
    'should_be_solvable_according_to_LevelSolvabilityValidator (%s)',
    (_id, levelDto) => {
      const playable = validator.isPlayable(toValidatorDto(levelDto));
      expect(playable).toBe(true);
    },
  );
});

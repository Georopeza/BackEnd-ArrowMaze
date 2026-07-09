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

  it('should_contain_fifteen_levels', () => {
    expect(LEVEL_SEED_CATALOG).toHaveLength(LEVEL_SEED_CATALOG_SIZE);
    expect(LEVEL_SEED_CATALOG_SIZE).toBe(15);
  });

  it('should_have_unique_ids_and_level_numbers', () => {
    expect(() => assertSeedCatalogInvariants()).not.toThrow();
  });

  it('should_be_ordered_by_level_number_when_using_getOrderedSeedCatalog', () => {
    const ordered = getOrderedSeedCatalog();
    for (let i = 0; i < ordered.length; i += 1) {
      expect(ordered[i].levelNumber).toBe(i + 1);
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

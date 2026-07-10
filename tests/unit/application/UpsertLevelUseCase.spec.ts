import { UpsertLevelUseCase } from '../../../src/application/use-cases/UpsertLevelUseCase';
import { LevelNotSolvableError } from '../../../src/application/errors';
import { ILevelRepository } from '../../../src/domain/repositories/ILevelRepository';
import { LevelJsonMapper } from '../../../src/infrastructure/mappers/LevelJsonMapper';
import { StructuredLevelJsonDto } from '../../../docs/contract/level.contract';

/**
 * Nivel trivial de una sola flecha con salida despejada: siempre resoluble,
 * usado para probar el camino feliz sin depender del algoritmo de
 * `LevelSolvabilityValidator` en sí (ese ya tiene su propia suite de tests
 * de dominio).
 */
const solvableLevelDto: StructuredLevelJsonDto = {
  id: 'level-1',
  levelNumber: 1,
  difficulty: 'EASY',
  maxMoves: 5,
  maxTimeInSeconds: 60,
  width: 3,
  height: 1,
  exit: { row: 0, col: 2 },
  arrows: [{ id: 'f1', direction: 'RIGHT', head: { row: 0, col: 0 }, body: [{ row: 0, col: 1 }] }],
};

/** Dos flechas apuntándose de frente en un pasillo: ninguna puede salir jamás. */
const unsolvableLevelDto: StructuredLevelJsonDto = {
  id: 'level-2',
  levelNumber: 2,
  difficulty: 'EASY',
  maxMoves: 5,
  maxTimeInSeconds: 60,
  width: 4,
  height: 1,
  exit: { row: 0, col: 1 },
  arrows: [
    { id: 'f1', direction: 'RIGHT', head: { row: 0, col: 0 }, body: [{ row: 0, col: 3 }] },
    { id: 'f2', direction: 'LEFT', head: { row: 0, col: 1 }, body: [{ row: 0, col: 2 }] },
  ],
};

function buildLevelRepositoryStub(existing: unknown = null): jest.Mocked<ILevelRepository> {
  return {
    findById: jest.fn().mockResolvedValue(existing),
    findByLevelNumber: jest.fn().mockResolvedValue(null),
    listAll: jest.fn().mockResolvedValue([]),
    save: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
  };
}

describe('UpsertLevelUseCase', () => {
  it('should_save_a_new_level_when_it_is_solvable_and_does_not_exist_yet', async () => {
    // Arrange
    const levelRepository = buildLevelRepositoryStub(null);
    const levelJsonMapper = new LevelJsonMapper();
    const useCase = new UpsertLevelUseCase(levelRepository, levelJsonMapper);

    // Act
    await useCase.execute(solvableLevelDto);

    // Assert
    expect(levelRepository.save).toHaveBeenCalledTimes(1);
    expect(levelRepository.update).not.toHaveBeenCalled();
  });

  it('should_update_an_existing_level_when_it_is_solvable_and_already_exists', async () => {
    // Arrange
    const levelRepository = buildLevelRepositoryStub({ id: 'level-1' });
    const levelJsonMapper = new LevelJsonMapper();
    const useCase = new UpsertLevelUseCase(levelRepository, levelJsonMapper);

    // Act
    await useCase.execute(solvableLevelDto);

    // Assert
    expect(levelRepository.update).toHaveBeenCalledTimes(1);
    expect(levelRepository.save).not.toHaveBeenCalled();
  });

  it('should_throw_LevelNotSolvableError_when_no_firing_order_clears_the_board', async () => {
    // Arrange
    const levelRepository = buildLevelRepositoryStub(null);
    const levelJsonMapper = new LevelJsonMapper();
    const useCase = new UpsertLevelUseCase(levelRepository, levelJsonMapper);

    // Act & Assert
    await expect(useCase.execute(unsolvableLevelDto)).rejects.toThrow(LevelNotSolvableError);
    expect(levelRepository.save).not.toHaveBeenCalled();
    expect(levelRepository.update).not.toHaveBeenCalled();
  });
});

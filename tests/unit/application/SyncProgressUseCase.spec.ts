import { SyncProgressUseCase } from '../../../src/application/use-cases/SyncProgressUseCase';
import { LevelNotFoundError } from '../../../src/application/errors';
import { IProgressRepository } from '../../../src/domain/repositories/IProgressRepository';
import { ILevelRepository } from '../../../src/domain/repositories/ILevelRepository';
import { PlayerProgress } from '../../../src/domain/entities/PlayerProgress';
import { LevelDefinition } from '../../../src/domain/entities/LevelDefinition';

function buildProgressRepositoryStub(existing: PlayerProgress | null = null): jest.Mocked<IProgressRepository> {
  return {
    findByUserAndLevel: jest.fn().mockResolvedValue(existing),
    findAllByUser: jest.fn().mockResolvedValue([]),
    save: jest.fn().mockResolvedValue(undefined),
    getLeaderboardByLevel: jest.fn().mockResolvedValue([]),
  };
}

function buildLevelRepositoryStub(level: LevelDefinition | null): jest.Mocked<ILevelRepository> {
  return {
    findById: jest.fn().mockResolvedValue(level),
    findByLevelNumber: jest.fn().mockResolvedValue(null),
    listAll: jest.fn().mockResolvedValue([]),
    save: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
  };
}

describe('SyncProgressUseCase', () => {
  it('should_throw_LevelNotFoundError_when_level_does_not_exist', async () => {
    // Arrange
    const progressRepository = buildProgressRepositoryStub();
    const levelRepository = buildLevelRepositoryStub(null);
    const useCase = new SyncProgressUseCase(progressRepository, levelRepository);

    // Act & Assert
    await expect(
      useCase.execute({ userId: 'u1', levelId: 'missing-level', score: 100, moves: 3, timeInSeconds: 10, completed: true }),
    ).rejects.toThrow(LevelNotFoundError);
    expect(progressRepository.save).not.toHaveBeenCalled();
  });

  it('should_create_a_fresh_progress_when_none_exists_yet', async () => {
    // Arrange
    const progressRepository = buildProgressRepositoryStub(null);
    const level = { id: 'level-1' } as LevelDefinition;
    const levelRepository = buildLevelRepositoryStub(level);
    const useCase = new SyncProgressUseCase(progressRepository, levelRepository);

    // Act
    const result = await useCase.execute({
      userId: 'u1',
      levelId: 'level-1',
      score: 100,
      moves: 3,
      timeInSeconds: 10,
      completed: true,
    });

    // Assert
    expect(progressRepository.save).toHaveBeenCalledTimes(1);
    expect(result.highScore).toBe(100);
    expect(result.isCompleted).toBe(true);
  });

  it('should_keep_the_best_score_when_new_run_is_worse', async () => {
    // Arrange
    const existing = new PlayerProgress('progress-1', 'u1', 'level-1', 500, 2, 5, true);
    const progressRepository = buildProgressRepositoryStub(existing);
    const level = { id: 'level-1' } as LevelDefinition;
    const levelRepository = buildLevelRepositoryStub(level);
    const useCase = new SyncProgressUseCase(progressRepository, levelRepository);

    // Act
    const result = await useCase.execute({
      userId: 'u1',
      levelId: 'level-1',
      score: 100,
      moves: 9,
      timeInSeconds: 20,
      completed: false,
    });

    // Assert
    expect(result.highScore).toBe(500);
    expect(result.minMoves).toBe(2);
    expect(result.isCompleted).toBe(true);
  });
});

import { GetPlayerProgressUseCase } from '../../../src/application/use-cases/GetPlayerProgressUseCase';
import { IProgressRepository } from '../../../src/domain/repositories/IProgressRepository';
import { ICollectibleRepository } from '../../../src/domain/repositories/ICollectibleRepository';
import { PlayerProgress } from '../../../src/domain/entities/PlayerProgress';

function buildProgressRepositoryStub(entries: PlayerProgress[]): jest.Mocked<IProgressRepository> {
  return {
    findByUserAndLevel: jest.fn().mockResolvedValue(null),
    findAllByUser: jest.fn().mockResolvedValue(entries),
    save: jest.fn().mockResolvedValue(undefined),
    getLeaderboardByLevel: jest.fn().mockResolvedValue([]),
  };
}

function buildCollectibleRepositoryStub(collectibles: string[]): jest.Mocked<ICollectibleRepository> {
  return {
    findAllByUser: jest.fn().mockResolvedValue(collectibles),
    mergeForUser: jest.fn().mockResolvedValue(collectibles),
  };
}

describe('GetPlayerProgressUseCase', () => {
  it('should_return_all_levels_for_the_user_when_progress_exists', async () => {
    // Arrange
    const entries = [
      new PlayerProgress('p1', 'u1', 'level-1', 500, 2, 5, true),
      new PlayerProgress('p2', 'u1', 'level-2', 300, 4, 9, false),
    ];
    const progressRepository = buildProgressRepositoryStub(entries);
    const collectibleRepository = buildCollectibleRepositoryStub(['collectible-milestone-2']);
    const useCase = new GetPlayerProgressUseCase(progressRepository, collectibleRepository);

    // Act
    const result = await useCase.execute('u1');

    // Assert
    expect(progressRepository.findAllByUser).toHaveBeenCalledWith('u1');
    expect(collectibleRepository.findAllByUser).toHaveBeenCalledWith('u1');
    expect(result.userId).toBe('u1');
    expect(result.levels).toHaveLength(2);
    expect(result.collectibles).toEqual(['collectible-milestone-2']);
    expect(result.levels[0]).toEqual({
      userId: 'u1',
      levelId: 'level-1',
      highScore: 500,
      minMoves: 2,
      minTimeInSeconds: 5,
      isCompleted: true,
    });
  });

  it('should_return_an_empty_list_when_user_has_no_progress', async () => {
    // Arrange
    const progressRepository = buildProgressRepositoryStub([]);
    const collectibleRepository = buildCollectibleRepositoryStub([]);
    const useCase = new GetPlayerProgressUseCase(progressRepository, collectibleRepository);

    // Act
    const result = await useCase.execute('new-user');

    // Assert
    expect(result.userId).toBe('new-user');
    expect(result.levels).toEqual([]);
    expect(result.collectibles).toEqual([]);
  });
});

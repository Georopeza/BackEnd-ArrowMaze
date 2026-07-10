import { GetPlayerProgressUseCase } from '../../../src/application/use-cases/GetPlayerProgressUseCase';
import { IProgressRepository } from '../../../src/domain/repositories/IProgressRepository';
import { PlayerProgress } from '../../../src/domain/entities/PlayerProgress';

function buildProgressRepositoryStub(entries: PlayerProgress[]): jest.Mocked<IProgressRepository> {
  return {
    findByUserAndLevel: jest.fn().mockResolvedValue(null),
    findAllByUser: jest.fn().mockResolvedValue(entries),
    save: jest.fn().mockResolvedValue(undefined),
    getLeaderboardByLevel: jest.fn().mockResolvedValue([]),
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
    const useCase = new GetPlayerProgressUseCase(progressRepository);

    // Act
    const result = await useCase.execute('u1');

    // Assert
    expect(progressRepository.findAllByUser).toHaveBeenCalledWith('u1');
    expect(result.userId).toBe('u1');
    expect(result.levels).toHaveLength(2);
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
    const useCase = new GetPlayerProgressUseCase(progressRepository);

    // Act
    const result = await useCase.execute('new-user');

    // Assert
    expect(result.userId).toBe('new-user');
    expect(result.levels).toEqual([]);
  });
});

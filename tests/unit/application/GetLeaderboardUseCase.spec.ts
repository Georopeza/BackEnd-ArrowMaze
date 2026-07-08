import { GetLeaderboardUseCase } from '../../../src/application/use-cases/GetLeaderboardUseCase';
import { IProgressRepository } from '../../../src/domain/repositories/IProgressRepository';
import { LeaderBoardEntry } from '../../../src/domain/value-objects/LeaderBoardEntry';

function buildProgressRepositoryStub(entries: LeaderBoardEntry[]): jest.Mocked<IProgressRepository> {
  return {
    findByUserAndLevel: jest.fn().mockResolvedValue(null),
    save: jest.fn().mockResolvedValue(undefined),
    getLeaderboardByLevel: jest.fn().mockResolvedValue(entries),
  };
}

describe('GetLeaderboardUseCase', () => {
  it('should_return_entries_from_the_repository_when_level_has_progress', async () => {
    // Arrange
    const entries = [new LeaderBoardEntry('top_player', 900, 2, 5)];
    const progressRepository = buildProgressRepositoryStub(entries);
    const useCase = new GetLeaderboardUseCase(progressRepository);

    // Act
    const result = await useCase.execute({ levelId: 'level-1' });

    // Assert
    expect(result).toBe(entries);
  });

  it('should_use_default_limit_when_none_is_provided', async () => {
    // Arrange
    const progressRepository = buildProgressRepositoryStub([]);
    const useCase = new GetLeaderboardUseCase(progressRepository);

    // Act
    await useCase.execute({ levelId: 'level-1' });

    // Assert
    expect(progressRepository.getLeaderboardByLevel).toHaveBeenCalledWith('level-1', 10);
  });

  it('should_forward_a_custom_limit_when_one_is_provided', async () => {
    // Arrange
    const progressRepository = buildProgressRepositoryStub([]);
    const useCase = new GetLeaderboardUseCase(progressRepository);

    // Act
    await useCase.execute({ levelId: 'level-1', limit: 3 });

    // Assert
    expect(progressRepository.getLeaderboardByLevel).toHaveBeenCalledWith('level-1', 3);
  });
});

import { ListLevelsUseCase } from '../../../src/application/use-cases/ListLevelsUseCase';
import { ILevelRepository } from '../../../src/domain/repositories/ILevelRepository';
import { LevelJsonMapper } from '../../../src/infrastructure/mappers/LevelJsonMapper';
import { LevelDefinition } from '../../../src/domain/entities/LevelDefinition';
import { StructuredLevelJsonDto } from '../../../docs/contract/level.contract';

function buildLevelRepositoryStub(levels: LevelDefinition[]): jest.Mocked<ILevelRepository> {
  return {
    findById: jest.fn().mockResolvedValue(null),
    findByLevelNumber: jest.fn().mockResolvedValue(null),
    listAll: jest.fn().mockResolvedValue(levels),
    save: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
  };
}

describe('ListLevelsUseCase', () => {
  it('should_return_all_levels_mapped_to_the_wire_dto_when_repository_has_levels', async () => {
    // Arrange
    const level = { id: 'level-1' } as LevelDefinition;
    const dto = { id: 'level-1' } as StructuredLevelJsonDto;
    const levelRepository = buildLevelRepositoryStub([level]);
    const levelJsonMapper = { toDto: jest.fn().mockReturnValue(dto), toLevelDefinition: jest.fn() } as unknown as LevelJsonMapper;
    const useCase = new ListLevelsUseCase(levelRepository, levelJsonMapper);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(levelJsonMapper.toDto).toHaveBeenCalledWith(level);
    expect(result).toEqual([dto]);
  });

  it('should_return_an_empty_list_when_repository_has_no_levels', async () => {
    // Arrange
    const levelRepository = buildLevelRepositoryStub([]);
    const levelJsonMapper = { toDto: jest.fn(), toLevelDefinition: jest.fn() } as unknown as LevelJsonMapper;
    const useCase = new ListLevelsUseCase(levelRepository, levelJsonMapper);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toEqual([]);
  });
});

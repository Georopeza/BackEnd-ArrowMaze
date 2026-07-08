import { GetLevelUseCase } from '../../../src/application/use-cases/GetLevelUseCase';
import { LevelNotFoundError } from '../../../src/application/errors';
import { ILevelRepository } from '../../../src/domain/repositories/ILevelRepository';
import { LevelJsonMapper } from '../../../src/infrastructure/mappers/LevelJsonMapper';
import { LevelDefinition } from '../../../src/domain/entities/LevelDefinition';
import { StructuredLevelJsonDto } from '../../../docs/contract/level.contract';

function buildLevelRepositoryStub(level: LevelDefinition | null): jest.Mocked<ILevelRepository> {
  return {
    findById: jest.fn().mockResolvedValue(level),
    findByLevelNumber: jest.fn().mockResolvedValue(null),
    listAll: jest.fn().mockResolvedValue([]),
    save: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
  };
}

describe('GetLevelUseCase', () => {
  it('should_return_the_level_mapped_to_the_wire_dto_when_it_exists', async () => {
    // Arrange
    const level = { id: 'level-1' } as LevelDefinition;
    const dto = { id: 'level-1' } as StructuredLevelJsonDto;
    const levelRepository = buildLevelRepositoryStub(level);
    const levelJsonMapper = { toDto: jest.fn().mockReturnValue(dto), toLevelDefinition: jest.fn() } as unknown as LevelJsonMapper;
    const useCase = new GetLevelUseCase(levelRepository, levelJsonMapper);

    // Act
    const result = await useCase.execute('level-1');

    // Assert
    expect(result).toBe(dto);
  });

  it('should_throw_LevelNotFoundError_when_level_does_not_exist', async () => {
    // Arrange
    const levelRepository = buildLevelRepositoryStub(null);
    const levelJsonMapper = { toDto: jest.fn(), toLevelDefinition: jest.fn() } as unknown as LevelJsonMapper;
    const useCase = new GetLevelUseCase(levelRepository, levelJsonMapper);

    // Act & Assert
    await expect(useCase.execute('missing-level')).rejects.toThrow(LevelNotFoundError);
  });
});

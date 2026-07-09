import { RegisterUserUseCase } from '../../../src/application/use-cases/RegisterUserUseCase';
import { UserAlreadyExistsError } from '../../../src/application/errors';
import { IUserRepository } from '../../../src/domain/repositories/IUserRepository';
import { IPasswordHasher } from '../../../src/domain/services/IPasswordHasher';
import { User } from '../../../src/domain/entities/User';

function buildUserRepositoryStub(existingUser: User | null = null): jest.Mocked<IUserRepository> {
  return {
    findById: jest.fn().mockResolvedValue(null),
    findByUsername: jest.fn().mockResolvedValue(existingUser),
    save: jest.fn().mockResolvedValue(undefined),
  };
}

function buildPasswordHasherStub(): jest.Mocked<IPasswordHasher> {
  return {
    hash: jest.fn().mockResolvedValue('hashed-password'),
    compare: jest.fn().mockResolvedValue(true),
  };
}

describe('RegisterUserUseCase', () => {
  it('should_save_a_new_user_when_username_is_not_taken', async () => {
    // Arrange
    const userRepository = buildUserRepositoryStub(null);
    const passwordHasher = buildPasswordHasherStub();
    const useCase = new RegisterUserUseCase(userRepository, passwordHasher);

    // Act
    const result = await useCase.execute({ username: 'player_one', password: 'super-secret' });

    // Assert
    expect(passwordHasher.hash).toHaveBeenCalledWith('super-secret');
    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(result.username).toBe('player_one');
  });

  it('should_throw_UserAlreadyExistsError_when_username_is_taken', async () => {
    // Arrange
    const existingUser = new User('existing-id', 'player_one', 'hash', new Date());
    const userRepository = buildUserRepositoryStub(existingUser);
    const passwordHasher = buildPasswordHasherStub();
    const useCase = new RegisterUserUseCase(userRepository, passwordHasher);

    // Act & Assert
    await expect(useCase.execute({ username: 'player_one', password: 'super-secret' })).rejects.toThrow(
      UserAlreadyExistsError,
    );
    expect(userRepository.save).not.toHaveBeenCalled();
  });
});

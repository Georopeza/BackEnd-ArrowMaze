import { LoginUserUseCase } from '../../../src/application/use-cases/LoginUserUseCase';
import { InvalidCredentialsError } from '../../../src/application/errors';
import { IUserRepository } from '../../../src/domain/repositories/IUserRepository';
import { IPasswordHasher } from '../../../src/domain/services/IPasswordHasher';
import { ITokenService } from '../../../src/application/ports/ITokenService';
import { User } from '../../../src/domain/entities/User';

function buildUserRepositoryStub(user: User | null): jest.Mocked<IUserRepository> {
  return {
    findById: jest.fn().mockResolvedValue(null),
    findByUsername: jest.fn().mockResolvedValue(user),
    save: jest.fn().mockResolvedValue(undefined),
  };
}

function buildPasswordHasherStub(matches: boolean): jest.Mocked<IPasswordHasher> {
  return {
    hash: jest.fn().mockResolvedValue('hashed-password'),
    compare: jest.fn().mockResolvedValue(matches),
  };
}

function buildTokenServiceStub(): jest.Mocked<ITokenService> {
  return {
    generate: jest.fn().mockReturnValue('signed-token'),
    verify: jest.fn().mockReturnValue(null),
  };
}

describe('LoginUserUseCase', () => {
  it('should_return_a_token_when_credentials_are_valid', async () => {
    // Arrange
    const user = new User('user-1', 'player_one', 'hash', new Date());
    const userRepository = buildUserRepositoryStub(user);
    const passwordHasher = buildPasswordHasherStub(true);
    const tokenService = buildTokenServiceStub();
    const useCase = new LoginUserUseCase(userRepository, passwordHasher, tokenService);

    // Act
    const result = await useCase.execute({ username: 'player_one', password: 'correct-password' });

    // Assert
    expect(tokenService.generate).toHaveBeenCalledWith({ userId: 'user-1', username: 'player_one' });
    expect(result).toEqual({ token: 'signed-token', userId: 'user-1', username: 'player_one' });
  });

  it('should_throw_InvalidCredentialsError_when_username_does_not_exist', async () => {
    // Arrange
    const userRepository = buildUserRepositoryStub(null);
    const passwordHasher = buildPasswordHasherStub(true);
    const tokenService = buildTokenServiceStub();
    const useCase = new LoginUserUseCase(userRepository, passwordHasher, tokenService);

    // Act & Assert
    await expect(useCase.execute({ username: 'ghost', password: 'whatever' })).rejects.toThrow(
      InvalidCredentialsError,
    );
    expect(tokenService.generate).not.toHaveBeenCalled();
  });

  it('should_throw_InvalidCredentialsError_when_password_does_not_match', async () => {
    // Arrange
    const user = new User('user-1', 'player_one', 'hash', new Date());
    const userRepository = buildUserRepositoryStub(user);
    const passwordHasher = buildPasswordHasherStub(false);
    const tokenService = buildTokenServiceStub();
    const useCase = new LoginUserUseCase(userRepository, passwordHasher, tokenService);

    // Act & Assert
    await expect(useCase.execute({ username: 'player_one', password: 'wrong-password' })).rejects.toThrow(
      InvalidCredentialsError,
    );
    expect(tokenService.generate).not.toHaveBeenCalled();
  });
});

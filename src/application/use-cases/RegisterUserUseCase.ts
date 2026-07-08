import { randomUUID } from 'node:crypto';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../../domain/services/IPasswordHasher';
import { User } from '../../domain/entities/User';
import { RegisterUserDto } from '../dto/AuthDtos';
import { UserAlreadyExistsError } from '../errors';

/**
 * Caso de uso: registrar un nuevo usuario.
 *
 * Depende únicamente de los puertos `IUserRepository` (dominio) e
 * `IPasswordHasher` (dominio) — nunca de una implementación concreta
 * (Dependency Inversion Principle).
 */
export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  public async execute(dto: RegisterUserDto): Promise<User> {
    const existing = await this.userRepository.findByUsername(dto.username);
    if (existing) {
      throw new UserAlreadyExistsError(dto.username);
    }

    const passwordHash = await this.passwordHasher.hash(dto.password);
    const user = new User(randomUUID(), dto.username, passwordHash, new Date());

    await this.userRepository.save(user);
    return user;
  }
}

import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../../domain/services/IPasswordHasher';
import { ITokenService } from '../ports/ITokenService';
import { LoginUserDto, AuthResultDto } from '../dto/AuthDtos';
import { InvalidCredentialsError } from '../errors';

/**
 * Caso de uso: iniciar sesión y emitir un token.
 *
 * Depende de `IUserRepository`/`IPasswordHasher` (puertos de dominio) y de
 * `ITokenService` (puerto propio de esta capa) — nunca de `jsonwebtoken`
 * directamente.
 */
export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
  ) {}

  /**
   * Autentica al usuario y emite un token de sesión JWT.
   *
   * @param dto Credenciales de login validadas en la capa HTTP.
   * @returns Token y datos públicos del usuario autenticado.
   * @throws InvalidCredentialsError si el username o la contraseña no coinciden.
   */
  public async execute(dto: LoginUserDto): Promise<AuthResultDto> {
    const user = await this.userRepository.findByUsername(dto.username);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isValidPassword = await user.verifyPassword(dto.password, this.passwordHasher);
    if (!isValidPassword) {
      throw new InvalidCredentialsError();
    }

    const token = this.tokenService.generate({ userId: user.id, username: user.username });
    return { token, userId: user.id, username: user.username };
  }
}

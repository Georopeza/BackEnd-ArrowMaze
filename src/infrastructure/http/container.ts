import { InMemoryUserRepository } from '../persistence/in-memory/InMemoryUserRepository';
import { InMemoryLevelRepository } from '../persistence/in-memory/InMemoryLevelRepository';
import { InMemoryProgressRepository } from '../persistence/in-memory/InMemoryProgressRepository';
import { BcryptPasswordHasher } from '../security/BcryptPasswordHasher';
import { JwtTokenService } from '../security/JwtTokenService';
import { LevelJsonMapper } from '../mappers/LevelJsonMapper';
import { ITokenService } from '../../application/ports/ITokenService';

import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from '../../application/use-cases/LoginUserUseCase';
import { SyncProgressUseCase } from '../../application/use-cases/SyncProgressUseCase';
import { GetLeaderboardUseCase } from '../../application/use-cases/GetLeaderboardUseCase';
import { ListLevelsUseCase } from '../../application/use-cases/ListLevelsUseCase';
import { GetLevelUseCase } from '../../application/use-cases/GetLevelUseCase';
import { UpsertLevelUseCase } from '../../application/use-cases/UpsertLevelUseCase';

/**
 * Composition root de la Capa 3 (Interface Adapters): el único lugar del
 * backend que instancia implementaciones concretas (repos in-memory, bcrypt,
 * JWT) y las inyecta en los casos de uso de la Capa 2.
 */
export interface AppContainer {
  /** Emisión y verificación de JWT (login + middleware de autorización). */
  tokenService: ITokenService;
  registerUser: RegisterUserUseCase;
  loginUser: LoginUserUseCase;
  syncProgress: SyncProgressUseCase;
  getLeaderboard: GetLeaderboardUseCase;
  listLevels: ListLevelsUseCase;
  getLevel: GetLevelUseCase;
  upsertLevel: UpsertLevelUseCase;
}

/**
 * Construye el contenedor de dependencias del servidor HTTP.
 *
 * @param jwtSecret Secreto HMAC para firmar tokens (proviene de `JWT_SECRET`).
 */
export function createContainer(jwtSecret: string): AppContainer {
  const userRepository = new InMemoryUserRepository();
  const levelRepository = new InMemoryLevelRepository();
  const progressRepository = new InMemoryProgressRepository(userRepository);

  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService(jwtSecret);
  const levelJsonMapper = new LevelJsonMapper();

  return {
    tokenService,
    registerUser: new RegisterUserUseCase(userRepository, passwordHasher),
    loginUser: new LoginUserUseCase(userRepository, passwordHasher, tokenService),
    syncProgress: new SyncProgressUseCase(progressRepository, levelRepository),
    getLeaderboard: new GetLeaderboardUseCase(progressRepository),
    listLevels: new ListLevelsUseCase(levelRepository, levelJsonMapper),
    getLevel: new GetLevelUseCase(levelRepository, levelJsonMapper),
    upsertLevel: new UpsertLevelUseCase(levelRepository, levelJsonMapper),
  };
}

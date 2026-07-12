import { createDatabase } from '../persistence/sqlite/Database';
import { SqliteUserRepository } from '../persistence/sqlite/SqliteUserRepository';
import { SqliteLevelRepository } from '../persistence/sqlite/SqliteLevelRepository';
import { SqliteProgressRepository } from '../persistence/sqlite/SqliteProgressRepository';
import { SqliteCollectibleRepository } from '../persistence/sqlite/SqliteCollectibleRepository';
import { BcryptPasswordHasher } from '../security/BcryptPasswordHasher';
import { JwtTokenService } from '../security/JwtTokenService';
import { LevelJsonMapper } from '../mappers/LevelJsonMapper';
import { ITokenService } from '../../application/ports/ITokenService';

import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from '../../application/use-cases/LoginUserUseCase';
import { SyncProgressUseCase } from '../../application/use-cases/SyncProgressUseCase';
import { SyncCollectiblesUseCase } from '../../application/use-cases/SyncCollectiblesUseCase';
import { GetPlayerProgressUseCase } from '../../application/use-cases/GetPlayerProgressUseCase';
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
  syncCollectibles: SyncCollectiblesUseCase;
  getPlayerProgress: GetPlayerProgressUseCase;
  getLeaderboard: GetLeaderboardUseCase;
  listLevels: ListLevelsUseCase;
  getLevel: GetLevelUseCase;
  upsertLevel: UpsertLevelUseCase;
}

/**
 * Construye el contenedor de dependencias del servidor HTTP.
 *
 * @param jwtSecret Secreto HMAC para firmar tokens (proviene de `JWT_SECRET`).
 * @param dbPath Ruta del archivo SQLite. `:memory:` (por defecto) abre una
 * base efímera y aislada — el valor correcto para tests, donde cada llamada
 * a `createContainer`/`createServer` debe partir de datos limpios. Producción
 * (`main.ts`) pasa explícitamente una ruta de archivo real para que los
 * datos sobrevivan reinicios del proceso.
 */
export function createContainer(jwtSecret: string, dbPath = ':memory:'): AppContainer {
  const db = createDatabase(dbPath);
  const userRepository = new SqliteUserRepository(db);
  const levelRepository = new SqliteLevelRepository(db);
  const progressRepository = new SqliteProgressRepository(db);
  const collectibleRepository = new SqliteCollectibleRepository(db);

  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService(jwtSecret);
  const levelJsonMapper = new LevelJsonMapper();

  return {
    tokenService,
    registerUser: new RegisterUserUseCase(userRepository, passwordHasher),
    loginUser: new LoginUserUseCase(userRepository, passwordHasher, tokenService),
    syncProgress: new SyncProgressUseCase(progressRepository, levelRepository),
    syncCollectibles: new SyncCollectiblesUseCase(collectibleRepository),
    getPlayerProgress: new GetPlayerProgressUseCase(progressRepository, collectibleRepository),
    getLeaderboard: new GetLeaderboardUseCase(progressRepository),
    listLevels: new ListLevelsUseCase(levelRepository, levelJsonMapper),
    getLevel: new GetLevelUseCase(levelRepository, levelJsonMapper),
    upsertLevel: new UpsertLevelUseCase(levelRepository, levelJsonMapper),
  };
}

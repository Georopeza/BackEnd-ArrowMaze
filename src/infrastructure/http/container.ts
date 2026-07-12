import { Pool } from 'pg';

import { createDatabase } from '../persistence/sqlite/Database';
import { SqliteUserRepository } from '../persistence/sqlite/SqliteUserRepository';
import { SqliteLevelRepository } from '../persistence/sqlite/SqliteLevelRepository';
import { SqliteProgressRepository } from '../persistence/sqlite/SqliteProgressRepository';
import { SqliteCollectibleRepository } from '../persistence/sqlite/SqliteCollectibleRepository';
import { createPostgresPool } from '../persistence/postgres/createPool';
import { PostgresUserRepository } from '../persistence/postgres/PostgresUserRepository';
import { PostgresLevelRepository } from '../persistence/postgres/PostgresLevelRepository';
import { PostgresProgressRepository } from '../persistence/postgres/PostgresProgressRepository';
import { PostgresCollectibleRepository } from '../persistence/postgres/PostgresCollectibleRepository';
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

import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { ILevelRepository } from '../../domain/repositories/ILevelRepository';
import { IProgressRepository } from '../../domain/repositories/IProgressRepository';
import { ICollectibleRepository } from '../../domain/repositories/ICollectibleRepository';

/**
 * Composition root de la Capa 3 (Interface Adapters): el único lugar del
 * backend que instancia implementaciones concretas (repos, bcrypt, JWT) y las
 * inyecta en los casos de uso de la Capa 2.
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

/** Opciones para elegir PostgreSQL (Neon) o SQLite (tests locales). */
export interface CreateContainerOptions {
  /**
   * Connection string de PostgreSQL/Neon. Si está definida (o existe
   * `process.env.DATABASE_URL`), se usa Postgres; los datos sobreviven redeploys.
   */
  databaseUrl?: string;

  /**
   * Ruta del archivo SQLite cuando no hay `databaseUrl`. `:memory:` (por defecto)
   * abre una base efímera — el valor correcto para tests sin Neon.
   */
  dbPath?: string;
}

/**
 * Construye el contenedor de dependencias del servidor HTTP.
 *
 * @param jwtSecret Secreto HMAC para firmar tokens (proviene de `JWT_SECRET`).
 * @param options Persistencia Postgres (`databaseUrl`) o SQLite (`dbPath`).
 */
export async function createContainer(
  jwtSecret: string,
  options: CreateContainerOptions = {},
): Promise<AppContainer> {
  const databaseUrl = options.databaseUrl;
  const repositories = databaseUrl
    ? await createPostgresRepositories(databaseUrl)
    : createSqliteRepositories(options.dbPath ?? ':memory:');

  return buildContainer(jwtSecret, repositories);
}

/**
 * Variante síncrona solo SQLite para tests unitarios que no levantan HTTP.
 *
 * @param jwtSecret Secreto de prueba.
 * @param dbPath Ruta SQLite; por defecto `:memory:`.
 */
export function createSqliteContainerForTests(
  jwtSecret: string,
  dbPath = ':memory:',
): AppContainer {
  return buildContainer(jwtSecret, createSqliteRepositories(dbPath));
}

interface RepositoryBundle {
  userRepository: IUserRepository;
  levelRepository: ILevelRepository;
  progressRepository: IProgressRepository;
  collectibleRepository: ICollectibleRepository;
}

async function createPostgresRepositories(databaseUrl: string): Promise<RepositoryBundle> {
  const pool: Pool = await createPostgresPool(databaseUrl);
  return {
    userRepository: new PostgresUserRepository(pool),
    levelRepository: new PostgresLevelRepository(pool),
    progressRepository: new PostgresProgressRepository(pool),
    collectibleRepository: new PostgresCollectibleRepository(pool),
  };
}

function createSqliteRepositories(dbPath: string): RepositoryBundle {
  const db = createDatabase(dbPath);
  return {
    userRepository: new SqliteUserRepository(db),
    levelRepository: new SqliteLevelRepository(db),
    progressRepository: new SqliteProgressRepository(db),
    collectibleRepository: new SqliteCollectibleRepository(db),
  };
}

function buildContainer(jwtSecret: string, repositories: RepositoryBundle): AppContainer {
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService(jwtSecret);
  const levelJsonMapper = new LevelJsonMapper();

  const { userRepository, levelRepository, progressRepository, collectibleRepository } = repositories;

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

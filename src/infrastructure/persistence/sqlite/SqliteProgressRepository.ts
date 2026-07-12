import { randomUUID } from 'node:crypto';
import Database from 'better-sqlite3';
import { IProgressRepository } from '../../../domain/repositories/IProgressRepository';
import { PlayerProgress } from '../../../domain/entities/PlayerProgress';
import { LeaderBoardEntry } from '../../../domain/value-objects/LeaderBoardEntry';

interface ProgressRow {
  id: string;
  userId: string;
  levelId: string;
  highScore: number;
  minMoves: number;
  minTimeInSeconds: number;
  isCompleted: number;
}

/**
 * Implementación de `IProgressRepository` respaldada por SQLite.
 *
 * El leaderboard se resuelve con un único `JOIN` contra `users` (en vez de
 * inyectar `IUserRepository` y hacer una consulta por fila, como hacía la
 * versión in-memory) — SQL ya resuelve esa relación de forma más simple.
 */
export class SqliteProgressRepository implements IProgressRepository {
  /** @param db Conexión SQLite ya inicializada con el esquema de `progress`. */
  constructor(private readonly db: Database.Database) {}

  /**
   * Obtiene el progreso de un usuario en un nivel concreto.
   *
   * @param userId Identificador del jugador.
   * @param levelId Identificador del nivel.
   * @returns Entidad `PlayerProgress` o `null` si aún no hay registro.
   */
  public async findByUserAndLevel(userId: string, levelId: string): Promise<PlayerProgress | null> {
    const row = this.db
      .prepare('SELECT * FROM progress WHERE userId = ? AND levelId = ?')
      .get(userId, levelId) as ProgressRow | undefined;
    return row ? this.toDomain(row) : null;
  }

  /**
   * Lista todo el progreso almacenado de un usuario en todos los niveles.
   *
   * @param userId Identificador del jugador.
   * @returns Colección de registros de progreso (puede estar vacía).
   */
  public async findAllByUser(userId: string): Promise<PlayerProgress[]> {
    const rows = this.db.prepare('SELECT * FROM progress WHERE userId = ?').all(userId) as ProgressRow[];
    return rows.map(row => this.toDomain(row));
  }

  /**
   * Inserta o actualiza el progreso de un par usuario-nivel.
   *
   * @param progress Entidad con las mejores métricas ya fusionadas por dominio.
   */
  public async save(progress: PlayerProgress): Promise<void> {
    const id = progress.id || randomUUID();
    this.db
      .prepare(
        `INSERT INTO progress (id, userId, levelId, highScore, minMoves, minTimeInSeconds, isCompleted)
         VALUES (@id, @userId, @levelId, @highScore, @minMoves, @minTimeInSeconds, @isCompleted)
         ON CONFLICT(userId, levelId) DO UPDATE SET
           highScore = excluded.highScore,
           minMoves = excluded.minMoves,
           minTimeInSeconds = excluded.minTimeInSeconds,
           isCompleted = excluded.isCompleted`,
      )
      .run({
        id,
        userId: progress.userId,
        levelId: progress.levelId,
        highScore: progress.highScore,
        minMoves: progress.minMoves,
        minTimeInSeconds: progress.minTimeInSeconds,
        isCompleted: progress.isCompleted ? 1 : 0,
      });
  }

  /**
   * Consulta el top de jugadores de un nivel con join contra `users`.
   *
   * `highScore` es determinístico por diseño: cada flecha extraída otorga
   * los mismos puntos fijos, así que **todo** jugador que complete el nivel
   * termina con el mismo puntaje (ver `Game._pointsPerExtractedArrow` en el
   * cliente). Ordenar solo por `highScore` deja el desempate librado al
   * orden de inserción en SQLite, no al mérito real del jugador. Se
   * desempata por tiempo ascendente (menos segundos es mejor) y, si además
   * empatan en tiempo, por movimientos ascendentes.
   *
   * @param levelId Nivel cuyo ranking se solicita.
   * @param limit Cantidad máxima de entradas a devolver.
   * @returns Entradas ordenadas por `highScore` descendente, luego `minTimeInSeconds`
   *   ascendente, luego `minMoves` ascendente.
   */
  public async getLeaderboardByLevel(levelId: string, limit: number): Promise<LeaderBoardEntry[]> {
    const rows = this.db
      .prepare(
        `SELECT p.highScore as highScore, p.minMoves as minMoves, p.minTimeInSeconds as minTimeInSeconds,
                COALESCE(u.username, p.userId) as username
         FROM progress p
         LEFT JOIN users u ON u.id = p.userId
         WHERE p.levelId = ?
         ORDER BY p.highScore DESC, p.minTimeInSeconds ASC, p.minMoves ASC
         LIMIT ?`,
      )
      .all(levelId, limit) as Array<{
      username: string;
      highScore: number;
      minMoves: number;
      minTimeInSeconds: number;
    }>;

    return rows.map(row => new LeaderBoardEntry(row.username, row.highScore, row.minMoves, row.minTimeInSeconds));
  }

  private toDomain(row: ProgressRow): PlayerProgress {
    return new PlayerProgress(
      row.id,
      row.userId,
      row.levelId,
      row.highScore,
      row.minMoves,
      row.minTimeInSeconds,
      row.isCompleted === 1,
    );
  }
}

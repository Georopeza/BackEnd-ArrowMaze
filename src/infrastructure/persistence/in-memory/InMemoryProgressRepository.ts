import { IProgressRepository } from '../../../domain/repositories/IProgressRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { PlayerProgress } from '../../../domain/entities/PlayerProgress';
import { LeaderBoardEntry } from '../../../domain/value-objects/LeaderBoardEntry';

/**
 * Implementación en memoria de `IProgressRepository`.
 *
 * Sirve para desarrollar y probar los casos de uso sin depender todavía
 * de una base de datos real (esa decisión queda para un sprint
 * posterior); basta con que cumpla el contrato del puerto de dominio.
 *
 * Depende de `IUserRepository` (no de su implementación en memoria) porque
 * el ranking necesita resolver el `username` de cada progreso guardado, y
 * `PlayerProgress` solo conoce `userId`.
 */
export class InMemoryProgressRepository implements IProgressRepository {
  private readonly progressByKey = new Map<string, PlayerProgress>();

  constructor(private readonly userRepository: IUserRepository) {}

  private key(userId: string, levelId: string): string {
    return `${userId}::${levelId}`;
  }

  /** Busca el progreso de un usuario en un nivel específico. */
  public async findByUserAndLevel(userId: string, levelId: string): Promise<PlayerProgress | null> {
    return this.progressByKey.get(this.key(userId, levelId)) ?? null;
  }

  /** Guarda (o sobrescribe) el progreso de un usuario en un nivel. */
  public async save(progress: PlayerProgress): Promise<void> {
    this.progressByKey.set(this.key(progress.userId, progress.levelId), progress);
  }

  /**
   * Obtiene el top de clasificación para un nivel específico, ordenado por
   * `highScore` descendente, resolviendo el `username` de cada entrada.
   */
  public async getLeaderboardByLevel(levelId: string, limit: number): Promise<LeaderBoardEntry[]> {
    const topProgress = [...this.progressByKey.values()]
      .filter(progress => progress.levelId === levelId)
      .sort((a, b) => b.highScore - a.highScore)
      .slice(0, limit);

    const entries = await Promise.all(
      topProgress.map(async progress => {
        const user = await this.userRepository.findById(progress.userId);
        return new LeaderBoardEntry(
          user?.username ?? progress.userId,
          progress.highScore,
          progress.minMoves,
          progress.minTimeInSeconds,
        );
      }),
    );

    return entries;
  }
}

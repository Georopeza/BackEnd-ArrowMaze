import { IProgressRepository } from '../../../domain/repositories/IProgressRepository';
import { PlayerProgress } from '../../../domain/entities/PlayerProgress';

/**
 * Implementación en memoria de `IProgressRepository`.
 *
 * Sirve para desarrollar y probar los casos de uso sin depender todavía
 * de una base de datos real (esa decisión queda para un sprint
 * posterior); basta con que cumpla el contrato del puerto de dominio.
 */
export class InMemoryProgressRepository implements IProgressRepository {
  private readonly progressByKey = new Map<string, PlayerProgress>();

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

  /** Obtiene los mejores puntajes registrados para un nivel, de mayor a menor. */
  public async getGlobalLeaderboard(levelId: string, limit: number): Promise<PlayerProgress[]> {
    return [...this.progressByKey.values()]
      .filter((progress) => progress.levelId === levelId)
      .sort((a, b) => b.highScore - a.highScore)
      .slice(0, limit);
  }
}

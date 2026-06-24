import { PlayerProgress } from '../entities/PlayerProgress';
import { LeaderBoardEntry } from '../value-objects/LeaderBoardEntry';

export interface IProgressRepository {
  findByUserAndLevel(userId: string, levelId: string): Promise<PlayerProgress | null>;
  save(progress: PlayerProgress): Promise<void>;
  
  /**
   * Obtiene el top de clasificación para un nivel específico.
   * Regla de negocio implícita: Ordenado por highScore DESC.
   * @param levelId Identificador del nivel.
   * @param limit Cantidad de jugadores a mostrar (ej. el Top 10).
   */
  getLeaderboardByLevel(levelId: string, limit: number): Promise<LeaderBoardEntry[]>;
}
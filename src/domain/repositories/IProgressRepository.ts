import { PlayerProgress } from '../entities/PlayerProgress';
import { LeaderBoardEntry } from '../value-objects/LeaderBoardEntry';

/** Puerto de persistencia para el progreso del jugador. */
export interface IProgressRepository {
  /** Obtiene el progreso de un usuario en un nivel específico. */
  findByUserAndLevel(userId: string, levelId: string): Promise<PlayerProgress | null>;

  /** Obtiene todo el progreso guardado de un usuario. */
  findAllByUser(userId: string): Promise<PlayerProgress[]>;

  /** Persiste el progreso del jugador. */
  save(progress: PlayerProgress): Promise<void>;

  /** Obtiene el top de clasificación de un nivel ordenado por highScore DESC. */
  getLeaderboardByLevel(levelId: string, limit: number): Promise<LeaderBoardEntry[]>;
}

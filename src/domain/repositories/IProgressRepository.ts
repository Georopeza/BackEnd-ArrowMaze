import { PlayerProgress } from '../entities/PlayerProgress';
import { LeaderBoardEntry } from '../value-objects/LeaderBoardEntry';

export interface IProgressRepository {
  findByUserAndLevel(userId: string, levelId: string): Promise<PlayerProgress | null>;

  /**
   * Obtiene todo el progreso guardado de un usuario (todos los niveles en los
   * que tiene registro). Usado para que el cliente pueda descargar y fusionar
   * su progreso al iniciar sesión desde un dispositivo nuevo.
   * @param userId Identificador del usuario.
   */
  findAllByUser(userId: string): Promise<PlayerProgress[]>;

  save(progress: PlayerProgress): Promise<void>;

  /**
   * Obtiene el top de clasificación para un nivel específico.
   * Regla de negocio implícita: Ordenado por highScore DESC.
   * @param levelId Identificador del nivel.
   * @param limit Cantidad de jugadores a mostrar (ej. el Top 10).
   */
  getLeaderboardByLevel(levelId: string, limit: number): Promise<LeaderBoardEntry[]>;
}
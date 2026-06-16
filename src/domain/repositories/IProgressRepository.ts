import { PlayerProgress } from '../entities/PlayerProgress';

// Puerto de repositorio puro para la entidad PlayerProgress.
// Define los contratos que la infraestructura debe cumplir.
export interface IProgressRepository {
  findByUserAndLevel(userId: string, levelId: string): Promise<PlayerProgress | null>;
  save(progress: PlayerProgress): Promise<void>;
  getGlobalLeaderboard(levelId: string, limit: number): Promise<PlayerProgress[]>;
}

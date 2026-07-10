import { IProgressRepository } from '../../domain/repositories/IProgressRepository';
import { LeaderBoardEntry } from '../../domain/value-objects/LeaderBoardEntry';
import { LeaderboardQueryDto } from '../dto/ProgressDtos';

const DEFAULT_LEADERBOARD_LIMIT = 10;

/** Caso de uso: obtener el top de clasificación de un nivel. */
export class GetLeaderboardUseCase {
  constructor(private readonly progressRepository: IProgressRepository) {}

  /**
   * Consulta el top de jugadores de un nivel ordenado por puntaje descendente.
   *
   * @param query Identificador del nivel y límite opcional de entradas.
   * @returns Entradas del leaderboard con username y métricas de rendimiento.
   */
  public async execute(query: LeaderboardQueryDto): Promise<LeaderBoardEntry[]> {
    const limit = query.limit ?? DEFAULT_LEADERBOARD_LIMIT;
    return this.progressRepository.getLeaderboardByLevel(query.levelId, limit);
  }
}

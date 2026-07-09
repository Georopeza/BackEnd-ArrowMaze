import { IProgressRepository } from '../../domain/repositories/IProgressRepository';
import { LeaderBoardEntry } from '../../domain/value-objects/LeaderBoardEntry';
import { LeaderboardQueryDto } from '../dto/ProgressDtos';

const DEFAULT_LEADERBOARD_LIMIT = 10;

/** Caso de uso: obtener el top de clasificación de un nivel. */
export class GetLeaderboardUseCase {
  constructor(private readonly progressRepository: IProgressRepository) {}

  public async execute(query: LeaderboardQueryDto): Promise<LeaderBoardEntry[]> {
    const limit = query.limit ?? DEFAULT_LEADERBOARD_LIMIT;
    return this.progressRepository.getLeaderboardByLevel(query.levelId, limit);
  }
}

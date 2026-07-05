import { LeaderBoardEntry } from '../value-objects/LeaderBoardEntry';

// Servicio para ordenar y filtrar entradas del leaderboard.
export class LeaderboardService {
  // Ordena las entradas por puntuación, movimientos y tiempo de juego.
  public sortEntries(entries: LeaderBoardEntry[]): LeaderBoardEntry[] {
    return [...entries].sort((left, right) => {
      if (right.highScore !== left.highScore) {
        return right.highScore - left.highScore;
      }
      if (left.minMoves !== right.minMoves) {
        return left.minMoves - right.minMoves;
      }
      return left.minTimeInSeconds - right.minTimeInSeconds;
    });
  }

  // Devuelve las primeras entradas del ranking hasta el límite indicado.
  public getTopEntries(entries: LeaderBoardEntry[], limit: number): LeaderBoardEntry[] {
    if (limit <= 0) {
      return [];
    }

    return this.sortEntries(entries).slice(0, limit);
  }
}

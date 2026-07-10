/** Entrada de clasificación con récords de un jugador en un nivel. */
export class LeaderBoardEntry {
  public readonly username: string;
  public readonly highScore: number;
  public readonly minMoves: number;
  public readonly minTimeInSeconds: number;

  /** Crea una entrada con los mejores récords del jugador. */
  constructor(username: string, highScore: number, minMoves: number, minTimeInSeconds: number) {
    this.username = username;
    this.highScore = highScore;
    this.minMoves = minMoves;
    this.minTimeInSeconds = minTimeInSeconds;
  }
}

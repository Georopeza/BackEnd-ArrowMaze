export class LeaderBoardEntry {
  public readonly username: string;
  public readonly highScore: number;
  public readonly minMoves: number;
  public readonly minTimeInSeconds: number;

  constructor(username: string, highScore: number, minMoves: number, minTimeInSeconds: number) {
    this.username = username;
    this.highScore = highScore;
    this.minMoves = minMoves;
    this.minTimeInSeconds = minTimeInSeconds;
  }
}
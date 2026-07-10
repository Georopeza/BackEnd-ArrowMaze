/** Progreso del jugador en un nivel; actualiza récords solo si mejoran. */
export class PlayerProgress {
  public readonly id: string;
  public readonly userId: string;
  public readonly levelId: string;
  public readonly highScore: number;
  public readonly minMoves: number;
  public readonly minTimeInSeconds: number;
  public readonly isCompleted: boolean;

  /**
   * Construye el progreso inicial del jugador.
   * @param id identificador único del progreso.
   * @param userId identificador del usuario.
   * @param levelId identificador del nivel.
   * @param highScore mejor puntaje registrado.
   * @param minMoves menor número de movimientos.
   * @param minTimeInSeconds menor tiempo.
   * @param isCompleted indica si el nivel está completado.
   */
  constructor(
    id: string,
    userId: string,
    levelId: string,
    highScore: number,
    minMoves: number,
    minTimeInSeconds: number,
    isCompleted: boolean,
  ) {
    this.id = id;
    this.userId = userId;
    this.levelId = levelId;
    this.highScore = highScore;
    this.minMoves = minMoves;
    this.minTimeInSeconds = minTimeInSeconds;
    this.isCompleted = isCompleted;
  }

  /**
   * Actualiza el progreso solo si el nuevo resultado es mejor.
   * Reemplaza el highScore si es mayor, y actualiza movimientos/tiempo si son menores.
   * El estado "completado" no se infiere del puntaje: lo determina quien invoca este método
   * (típicamente comparando contra Board.isSolved(), es decir, si ya no quedan flechas en el tablero),
   * y una vez completado permanece completado aunque una corrida posterior sea peor.
   * @param score nuevo puntaje.
   * @param moves nuevos movimientos.
   * @param time nuevo tiempo en segundos.
   * @param completed si esta corrida terminó el nivel (todas las flechas fuera del tablero).
   * @returns nueva instancia de PlayerProgress actualizada.
   */
  public updateScore(score: number, moves: number, time: number, completed: boolean): PlayerProgress {
    const betterScore = score > this.highScore ? score : this.highScore;
    const betterMoves = moves < this.minMoves ? moves : this.minMoves;
    const betterTime = time < this.minTimeInSeconds ? time : this.minTimeInSeconds;
    const isNowCompleted = this.isCompleted || completed;

    return new PlayerProgress(
      this.id,
      this.userId,
      this.levelId,
      betterScore,
      betterMoves,
      betterTime,
      isNowCompleted,
    );
  }
}

import { Cell } from './Cell';

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

// Aggregate Root puro que representa la definición completa de un nivel.
export class LevelDefinition {
  public readonly id: string;
  public readonly levelNumber: number;
  public readonly difficulty: Difficulty;
  public readonly board: Cell[][];
  public readonly maxMoves: number;
  public readonly maxTimeInSeconds: number;

  /**
   * Construye una definición de nivel inmutable.
   * @param id identificador único del nivel.
   * @param levelNumber número del nivel.
   * @param difficulty dificultad del nivel.
   * @param board matriz del tablero con componentes del dominio.
   * @param maxMoves número máximo de movimientos permitidos.
   * @param maxTimeInSeconds tiempo máximo en segundos permitido.
   */
  constructor(id: string, levelNumber: number, difficulty: Difficulty, board: Cell[][], maxMoves: number, maxTimeInSeconds: number) {
    this.id = id;
    this.levelNumber = levelNumber;
    this.difficulty = difficulty;
    this.board = board;
    this.maxMoves = maxMoves;
    this.maxTimeInSeconds = maxTimeInSeconds;
  }

  /**
   * Calcula la puntuación final del nivel usando una estrategia concreta.
   * @param strategy estrategia de cálculo de puntuación.
   * @param movements número de movimientos realizados.
   * @param timeSpent tiempo consumido en segundos.
   * @returns puntuación calculada.
   */
  public calculateScore(strategy: IScoreStrategy, movements: number, timeSpent: number): number {
    return strategy.calculateScore(movements, timeSpent);
  }
}

// Strategy para cálculo de puntuación de nivel.
export interface IScoreStrategy {
  /**
   * Calcula la puntuación del nivel en función de movimientos y tiempo.
   * @param movements número de movimientos realizados.
   * @param timeSpent tiempo consumido en segundos.
   * @returns puntuación numérica.
   */
  calculateScore(movements: number, timeSpent: number): number;
}

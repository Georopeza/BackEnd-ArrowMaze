import { Cell } from './Cell';
import { validateBoardCellInvariants } from '../validators/boardCellInvariantsValidator';

/** Niveles de dificultad disponibles para un nivel. */
export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  // Agregado en Sprint 1 para alinear con el LevelDifficulty del frontend
  // (rama Develop del repo Arrow-Maze-Escape-Puzzle), que ya define un
  // cuarto nivel de dificultad.
  EXPERT = 'EXPERT',
}

/** Estrategia de cálculo de puntaje según movimientos y tiempo. */
export interface IScoreStrategy {
  /** Calcula el puntaje a partir de movimientos y tiempo empleado. */
  calculateScore(movements: number, timeSpent: number): number;
}

/** Definición inmutable de un nivel con tablero, límites y dificultad. */
export class LevelDefinition {
  public readonly id: string;
  public readonly name: string;
  public readonly levelNumber: number;
  public readonly difficulty: Difficulty;
  public readonly board: Cell[][];
  public readonly maxMoves: number;
  public readonly maxTimeInSeconds: number;

  /** Valida invariantes del tablero y límites de juego al construir el nivel. */
  constructor(
    id: string,
    name: string,
    levelNumber: number,
    difficulty: Difficulty,
    board: Cell[][],
    maxMoves: number,
    maxTimeInSeconds: number
  ) {
    // 1, 2, 4, 5, 6: forma y contenido del tablero (compartido con CubeLevelDefinition)
    validateBoardCellInvariants(board);

    // 3. Validar límites de juego coherentes
    if (maxMoves <= 0 || maxTimeInSeconds <= 0) {
      throw new Error('Game limits (maxMoves and maxTimeInSeconds) must be greater than zero');
    }

    this.id = id;
    this.name = name;
    this.levelNumber = levelNumber;
    this.difficulty = difficulty;
    this.board = board;
    this.maxMoves = maxMoves;
    this.maxTimeInSeconds = maxTimeInSeconds;
  }

  /** Delega el cálculo de puntaje a la estrategia indicada. */
  public calculateScore(strategy: IScoreStrategy, movements: number, timeSpent: number): number {
    return strategy.calculateScore(movements, timeSpent);
  }
}
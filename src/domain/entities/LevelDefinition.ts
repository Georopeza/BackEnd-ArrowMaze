import { Cell } from './Cell';
import { ExitCell } from './ExitCell';
import { ArrowCell } from './ArrowCell';
import { ArrowBodyCell } from './ArrowBodyCell';

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
  public readonly levelNumber: number;
  public readonly difficulty: Difficulty;
  public readonly board: Cell[][];
  public readonly maxMoves: number;
  public readonly maxTimeInSeconds: number;

  /** Valida invariantes del tablero y límites de juego al construir el nivel. */
  constructor(
    id: string,
    levelNumber: number,
    difficulty: Difficulty,
    board: Cell[][],
    maxMoves: number,
    maxTimeInSeconds: number
  ) {
    // 1. Validar que el tablero no venga vacío y sea una matriz válida
    if (!board || board.length === 0 || board[0].length === 0) {
      throw new Error('The board matrix cannot be empty');
    }

    // 2. Validar consistencia de la matriz (que todas las filas tengan el mismo ancho)
    const expectedWidth = board[0].length;
    const isUniform = board.every(row => row.length === expectedWidth);
    if (!isUniform) {
      throw new Error('The board matrix must be uniform (all rows must have the same width)');
    }

    // 3. Validar límites de juego coherentes
    if (maxMoves <= 0 || maxTimeInSeconds <= 0) {
      throw new Error('Game limits (maxMoves and maxTimeInSeconds) must be greater than zero');
    }

    // Aplanamos la matriz una sola vez para las verificaciones de celdas
    const flatCells = board.flat();

    // 4. Debe haber al menos una celda de salida
    const hasExit = flatCells.some(cell => cell instanceof ExitCell);
    if (!hasExit) {
      throw new Error('Level board must contain at least one ExitCell');
    }

    // 5. Debe haber al menos una flecha para que el nivel sea jugable
    const hasArrows = flatCells.some(cell => cell instanceof ArrowCell);
    if (!hasArrows) {
      throw new Error('Level board must contain at least one ArrowCell to be playable');
    }

    // 6. Toda celda de cuerpo (ArrowBodyCell) debe referenciar una cabeza (ArrowCell) existente,
    // de lo contrario la flecha quedaría incompleta al reconstruirla como Board jugable.
    const headArrowIds = new Set(
      flatCells.filter((cell): cell is ArrowCell => cell instanceof ArrowCell).map(cell => cell.arrowId)
    );
    const hasOrphanBody = flatCells.some(
      cell => cell instanceof ArrowBodyCell && !headArrowIds.has(cell.arrowId)
    );
    if (hasOrphanBody) {
      throw new Error('Every ArrowBodyCell must reference an existing ArrowCell arrowId');
    }

    this.id = id;
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
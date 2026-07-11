import { Cell } from '../entities/Cell';
import { ArrowCell } from '../entities/ArrowCell';
import { ArrowBodyCell } from '../entities/ArrowBodyCell';
import { Direction } from '../value-objects/Direction';
import { Difficulty, LevelDefinition } from '../entities/LevelDefinition';

/** Builder para construir LevelDefinition de forma incremental. */
export class LevelBuilder {
  private id = '';
  private name = '';
  private levelNumber = 1;
  private difficulty: Difficulty = Difficulty.EASY;
  private board: Cell[][] = [];
  private maxMoves = 0;
  private maxTimeInSeconds = 0;

  /** Asigna el identificador del nivel. */
  public withId(id: string): this {
    this.id = id;
    return this;
  }

  /** Asigna el nombre visible del nivel en catálogos y UI. */
  public withName(name: string): this {
    this.name = name;
    return this;
  }

  /** Asigna el número ordinal del nivel. */
  public withLevelNumber(levelNumber: number): this {
    this.levelNumber = levelNumber;
    return this;
  }

  /** Asigna la dificultad del nivel. */
  public withDifficulty(difficulty: Difficulty): this {
    this.difficulty = difficulty;
    return this;
  }

  /** Inicializa el tablero con las dimensiones indicadas. */
  public withDimensions(rows: number, cols: number): this {
    this.board = Array.from({ length: rows }, () => Array<Cell>(cols).fill(null as unknown as Cell));
    return this;
  }

  /** Coloca una celda en la coordenada especificada. */
  public addCell(row: number, col: number, cell: Cell): this {
    if (!this.board[row]) {
      throw new Error('Board row does not exist');
    }
    if (col < 0 || col >= this.board[row].length) {
      throw new Error('Board column does not exist');
    }

    this.board[row][col] = cell;
    return this;
  }

  /** Agrega una flecha completa (cabeza y cuerpo opcional) en un solo paso. */
  public addArrow(
    row: number,
    col: number,
    direction: Direction,
    arrowId: string,
    body: { row: number; col: number }[] = [],
  ): this {
    this.addCell(row, col, new ArrowCell(direction, arrowId));
    body.forEach(pos => this.addCell(pos.row, pos.col, new ArrowBodyCell(arrowId)));
    return this;
  }

  /** Define los límites de movimientos y tiempo del nivel. */
  public withConstraints(maxMoves: number, maxTimeInSeconds: number): this {
    this.maxMoves = maxMoves;
    this.maxTimeInSeconds = maxTimeInSeconds;
    return this;
  }

  /** Construye la LevelDefinition validando que el id esté definido. */
  public build(): LevelDefinition {
    if (!this.id) {
      throw new Error('Level id is required');
    }
    return new LevelDefinition(
      this.id,
      this.name.trim() || this.id,
      this.levelNumber,
      this.difficulty,
      this.board,
      this.maxMoves,
      this.maxTimeInSeconds,
    );
  }
}

import { Cell } from '../entities/Cell';
import { Difficulty, LevelDefinition } from '../entities/LevelDefinition';

// Patrón Builder para construir LevelDefinition de forma incremental.
// Permite ensamblar niveles complejos paso a paso.
export class LevelBuilder {
  private id = '';
  private levelNumber = 1;
  private difficulty: Difficulty = Difficulty.EASY;
  private board: Cell[][] = [];
  private maxMoves = 0;
  private maxTimeInSeconds = 0;

  public withId(id: string): this {
    this.id = id;
    return this;
  }

  public withLevelNumber(levelNumber: number): this {
    this.levelNumber = levelNumber;
    return this;
  }

  public withDifficulty(difficulty: Difficulty): this {
    this.difficulty = difficulty;
    return this;
  }

  public withDimensions(rows: number, cols: number): this {
    this.board = Array.from({ length: rows }, () => Array<Cell>(cols).fill(null as unknown as Cell));
    return this;
  }

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

  public withConstraints(maxMoves: number, maxTimeInSeconds: number): this {
    this.maxMoves = maxMoves;
    this.maxTimeInSeconds = maxTimeInSeconds;
    return this;
  }

  public build(): LevelDefinition {
    if (!this.id) {
      throw new Error('Level id is required');
    }
    return new LevelDefinition(
      this.id,
      this.levelNumber,
      this.difficulty,
      this.board,
      this.maxMoves,
      this.maxTimeInSeconds,
    );
  }
}

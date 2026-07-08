import { Board } from '../../aggregates/Board';
import { BoardDimensions } from '../../value-objects/BoardDimensions';
import { Arrow } from '../../entities/Arrow';
import { ArrowId } from '../../value-objects/ArrowId';
import { Position } from '../../value-objects/Position';
import { Direction } from '../../value-objects/Direction';

export class BoardTestBuilder {
  private board: Board;
  private arrowCounter = 1;

  constructor() {
    this.board = new Board(new BoardDimensions(5, 5));
  }

  public withDimensions(rows: number, cols: number): this {
    this.board = new Board(new BoardDimensions(rows, cols));
    return this;
  }

  // Ahora acepta el cuarto parámetro: body (el cuerpo de la flecha)
  public withArrowAt(row: number, col: number, dir: Direction, body: Position[] = []): this {
    const autoId = `arrow-${this.arrowCounter++}`;
    
    // Pasamos el ID, la posición de la cabeza, la dirección y el cuerpo ordenadamente
    const arrow = new Arrow(
      new ArrowId(autoId),
      new Position(row, col),
      dir,
      body
    );
    
    this.board.addArrow(arrow);
    return this;
  }

  // Coloca una pared en la posición indicada, para escenarios de test que necesiten bloqueo estático.
  public withWallAt(row: number, col: number): this {
    this.board.addWall(new Position(row, col));
    return this;
  }

  public build(): Board {
    return this.board;
  }
}
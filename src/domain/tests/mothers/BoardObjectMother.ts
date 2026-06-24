import { BoardTestBuilder } from '../builders/BoardTestBuilder';
import { Direction } from '../../value-objects/Direction';
import { Board } from '../../aggregates/Board';

export class BoardObjectMother {
  // Escenario 1: Tablero estándar con una sola flecha libre
  static createWithSingleClearArrow(row: number, col: number, dir: Direction = Direction.UP): Board {
    return new BoardTestBuilder()
      .withArrowAt(row, col, dir)
      .build();
  }

  // Escenario 2: Tablero con dos flechas enfrentadas (bloqueadas)
  static createWithTwoBlockedArrows(): Board {
    return new BoardTestBuilder()
      .withArrowAt(2, 2, Direction.UP)
      .withArrowAt(2, 4, Direction.DOWN)
      .build();
  }
}
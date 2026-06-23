import { Board } from '../aggregates/Board';
import { Position } from '../value-objects/Position';
import { Direction } from '../value-objects/Direction';
import { Arrow } from '../entities/Arrow';

export class LevelActionService {
  public interactWithCell(board: Board, row: number, col: number): boolean {
    const pos = new Position(row, col);
    const arrow = board.findArrowAt(pos);
    if (!arrow) return false;

    if (!this.isPathClear(board, arrow)) return false;

    // limpiar posiciones y eliminar flecha del board
    board.clearPositions(arrow.getAllPositions());
    board.removeArrowById(arrow.getId().value);
    return true;
  }

  private isPathClear(board: Board, arrow: Arrow): boolean {
    const dir = arrow.getDirection();
    let currentPos = arrow.getHead();

    while (true) {
      const nextPos = this.calculateNextPosition(currentPos, dir);

      if (!board.getDimensions().isValidPosition(nextPos.row, nextPos.col)) {
        return true;
      }

      const blockingArrow = board.getArrows().find(a => a.occupies(nextPos) && a.getId().value !== arrow.getId().value);
      if (blockingArrow) return false;

      currentPos = nextPos;
    }
  }

  private calculateNextPosition(pos: Position, dir: Direction): Position {
    switch (dir) {
      case Direction.UP: return new Position(pos.row - 1, pos.col);
      case Direction.DOWN: return new Position(pos.row + 1, pos.col);
      case Direction.LEFT: return new Position(pos.row, pos.col - 1);
      case Direction.RIGHT: return new Position(pos.row, pos.col + 1);
      default: throw new Error(`Unknown direction`);
    }
  }
}
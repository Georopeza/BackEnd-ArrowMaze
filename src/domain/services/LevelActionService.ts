import { Board } from '../aggregates/Board';
import { Position } from '../value-objects/Position';
import { Direction } from '../value-objects/Direction';
import { Arrow } from '../entities/Arrow';

export class LevelActionService {
  // Intenta interactuar con una celda del tablero para eliminar una flecha si el camino está despejado.
  public interactWithCell(board: Board, row: number, col: number): boolean {
    const pos = new Position(row, col);
    const arrow = board.findArrowAt(pos);
    if (!arrow) return false;

    if (!this.isPathClear(board, arrow)) return false;

    board.removeArrowById(arrow.getId().value);
    return true;
  }

  // Verifica que la trayectoria de una flecha no esté bloqueada por otra flecha activa.
  private isPathClear(board: Board, arrow: Arrow): boolean {
    const dir = arrow.getDirection();
    let currentPos = arrow.getHead();

    while (true) {
      const nextPos = this.calculateNextPosition(currentPos, dir);

      if (!board.getDimensions().isValidPosition(nextPos.row, nextPos.col)) {
        return true;
      }

      const blockingArrow = board.getArrows().find(
        candidate => candidate.getId().value !== arrow.getId().value && candidate.occupies(nextPos),
      );
      if (blockingArrow) return false;

      currentPos = nextPos;
    }
  }

  // Calcula la siguiente posición a partir de una dirección dada.
  private calculateNextPosition(pos: Position, dir: Direction): Position {
    switch (dir) {
      case Direction.UP:
        return new Position(pos.row - 1, pos.col);
      case Direction.DOWN:
        return new Position(pos.row + 1, pos.col);
      case Direction.LEFT:
        return new Position(pos.row, pos.col - 1);
      case Direction.RIGHT:
        return new Position(pos.row, pos.col + 1);
      default:
        throw new Error('Unknown direction');
    }
  }
}

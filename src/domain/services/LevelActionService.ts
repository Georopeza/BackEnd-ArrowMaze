import { Board } from '../aggregates/Board';
import { Position } from '../value-objects/Position';
import { Direction } from '../value-objects/Direction';
import { getStep } from '../value-objects/DirectionVector';
import { Arrow } from '../entities/Arrow';
import { WallCell } from '../entities/WallCell';

/** Ejecuta acciones de disparo sobre el tablero en vivo. */
export class LevelActionService {
  /** Dispara la flecha en la celda indicada si su camino está despejado. */
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

  // Regla de Bloqueo: recorre la línea de visión de la flecha hacia el borde,
  // bloqueando si encuentra otra flecha o una pared en el camino.
  private isPathClear(board: Board, arrow: Arrow): boolean {
    const dir = arrow.getDirection();
    let currentPos = arrow.getHead();

    // eslint-disable-next-line no-constant-condition -- termina por los `return` internos al llegar al borde o a un bloqueo.
    while (true) {
      const nextPos = this.calculateNextPosition(currentPos, dir);

      if (!board.getDimensions().isValidPosition(nextPos.row, nextPos.col)) {
        return true;
      }

      const blockingArrow = board.getArrows().find(a => a.occupies(nextPos) && a.getId().value !== arrow.getId().value);
      if (blockingArrow) return false;

      if (board.getCellAt(nextPos.row, nextPos.col) instanceof WallCell) return false;

      currentPos = nextPos;
    }
  }

  // Calcula la siguiente posición al avanzar un paso en la dirección dada.
  private calculateNextPosition(pos: Position, dir: Direction): Position {
    const { rowStep, colStep } = getStep(dir);
    return new Position(pos.row + rowStep, pos.col + colStep);
  }
}

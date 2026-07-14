import { CubePathArrow } from '../entities/CubePathArrow';
import { CubeSurfaceBoard } from '../aggregates/CubeSurfaceBoard';
import { CubeSurfacePosition } from '../value-objects/CubeSurfacePosition';

export type CubeSurfaceFireResult =
  | { type: 'extracted'; arrowId: string; board: CubeSurfaceBoard }
  | { type: 'blocked'; arrowId: string; blocking: CubeSurfacePosition; board: CubeSurfaceBoard }
  | { type: 'noArrow'; board: CubeSurfaceBoard };

/**
 * Al tocar una flecha, sale por el punto de escape del tablero si la
 * `escapeRoute` no está ocupada por otra flecha (punta/cuerpo pueden ser multi-cara).
 */
export class CubePathMovementEngine {
  public attemptFireAt(board: CubeSurfaceBoard, position: CubeSurfacePosition): CubeSurfaceFireResult {
    const arrow = board.arrowAt(position);
    if (!arrow) {
      return { type: 'noArrow', board };
    }
    return this.attemptFire(board, arrow.id);
  }

  public attemptFire(board: CubeSurfaceBoard, arrowId: string): CubeSurfaceFireResult {
    const arrow = board.arrowById(arrowId);
    const blocking = this.findBlockingCell(board, arrow);
    if (blocking) {
      return { type: 'blocked', arrowId, blocking, board };
    }
    return {
      type: 'extracted',
      arrowId,
      board: board.withoutArrow(arrowId),
    };
  }

  private findBlockingCell(
    board: CubeSurfaceBoard,
    arrow: CubePathArrow
  ): CubeSurfacePosition | undefined {
    for (const cell of arrow.escapeRoute) {
      const occupant = board.arrowAt(cell);
      if (occupant && occupant.id !== arrow.id) {
        return cell;
      }
    }
    return undefined;
  }
}

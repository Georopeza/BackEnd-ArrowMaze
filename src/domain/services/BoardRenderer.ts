import { Board } from '../aggregates/Board';
import { Position } from '../value-objects/Position';

/** Genera una representación textual del estado del tablero. */
export class BoardRenderer {
  /** Devuelve una cadena ASCII con flechas, cabezas y celdas vacías. */
  public render(board: Board): string {
    const dimensions = board.getDimensions();
    const arrows = board.getArrows();

    const visual = Array.from({ length: dimensions.rows }, (_, rowIndex) =>
      Array.from({ length: dimensions.cols }, (_, colIndex) => {
        const pos = new Position(rowIndex, colIndex);
        const arrow = arrows.find(a => a.occupies(pos));
        if (!arrow) return ' . ';
        if (arrow.getHead().equals(pos)) return ' H ';
        return ` ${arrow.getId().value.substring(0, 1)} `;
      }).join('|')
    ).join('\n' + '-'.repeat(dimensions.cols * 4) + '\n');

    return `\n--- Current Board State ---\n${visual}\n---------------------------\n`;
  }
}

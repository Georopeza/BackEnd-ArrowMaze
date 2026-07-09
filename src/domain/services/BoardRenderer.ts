import { Board } from '../aggregates/Board';
import { Position } from '../value-objects/Position';

export class BoardRenderer {
  // Genera una representación textual del tablero (sin hacer I/O: el dominio no debe imprimir nada;
  // quien consuma este string decide dónde mostrarlo, ej. consola, log, o una vista).
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
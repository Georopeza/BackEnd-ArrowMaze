import { Board } from '../aggregates/Board';
import { Position } from '../value-objects/Position';

export class BoardRenderer {
  // Convierte el estado actual del tablero en una representación textual para depuración o consola.
  public render(board: Board): string {
    const dimensions = board.getDimensions();
    const arrows = board.getArrows();

    return Array.from({ length: dimensions.rows }, (_, rowIndex) =>
      Array.from({ length: dimensions.cols }, (_, colIndex) => {
        const pos = new Position(rowIndex, colIndex);
        const arrow = arrows.find(candidate => candidate.occupies(pos));
        if (!arrow) return ' . ';
        if (arrow.getHead().equals(pos)) return ' H ';
        return ` ${arrow.getId().value.substring(0, 1)} `;
      }).join('|'),
    ).join('\n');
  }

  // Imprime la representación visual del tablero en la consola.
  public printBoard(board: Board): void {
    console.log('\n--- Current Board State ---');
    console.log(this.render(board));
    console.log('---------------------------\n');
  }
}

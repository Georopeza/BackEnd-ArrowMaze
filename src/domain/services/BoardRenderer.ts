import { Board } from '../aggregates/Board';
import { Position } from '../value-objects/Position';

export class BoardRenderer {
  public printBoard(board: Board): void {
    const dimensions = board.getDimensions();
    const arrows = board.getArrows();

    const visual = Array.from({ length: dimensions.rows }, (_, rowIndex) =>
      Array.from({ length: dimensions.cols }, (_, colIndex) => {
        const pos = new Position(rowIndex, colIndex);
        const arrow = arrows.find(a => a.occupies(pos));
        if (!arrow) return ' . ';
        if (arrow.headPosition.equals(pos)) return ' H ';
        return ` ${arrow.id.value.substring(0, 1)} `;
      }).join('|')
    ).join('\n' + '-'.repeat(dimensions.cols * 4) + '\n');

    console.log('\n--- Current Board State ---');
    console.log(visual);
    console.log('---------------------------\n');
  }
}
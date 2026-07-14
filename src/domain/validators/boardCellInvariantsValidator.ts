import { Cell } from '../entities/Cell';
import { ExitCell } from '../entities/ExitCell';
import { ArrowCell } from '../entities/ArrowCell';
import { ArrowBodyCell } from '../entities/ArrowBodyCell';

/**
 * Valida las reglas de forma/contenido de una matriz de celdas, compartidas
 * por `LevelDefinition` (un tablero) y `CubeLevelDefinition` (una cara del
 * cubo, con la misma forma de tablero). Extraído para no duplicar estas
 * reglas entre ambos.
 *
 * @throws Error si el tablero está vacío, no es uniforme, no tiene salida,
 * no tiene flechas, o tiene un ArrowBodyCell huérfano.
 */
export function validateBoardCellInvariants(board: Cell[][]): void {
  if (!board || board.length === 0 || board[0].length === 0) {
    throw new Error('The board matrix cannot be empty');
  }

  const expectedWidth = board[0].length;
  const isUniform = board.every(row => row.length === expectedWidth);
  if (!isUniform) {
    throw new Error('The board matrix must be uniform (all rows must have the same width)');
  }

  const flatCells = board.flat();

  const hasExit = flatCells.some(cell => cell instanceof ExitCell);
  if (!hasExit) {
    throw new Error('Level board must contain at least one ExitCell');
  }

  const hasArrows = flatCells.some(cell => cell instanceof ArrowCell);
  if (!hasArrows) {
    throw new Error('Level board must contain at least one ArrowCell to be playable');
  }

  const headArrowIds = new Set(
    flatCells.filter((cell): cell is ArrowCell => cell instanceof ArrowCell).map(cell => cell.arrowId)
  );
  const hasOrphanBody = flatCells.some(
    cell => cell instanceof ArrowBodyCell && !headArrowIds.has(cell.arrowId)
  );
  if (hasOrphanBody) {
    throw new Error('Every ArrowBodyCell must reference an existing ArrowCell arrowId');
  }
}

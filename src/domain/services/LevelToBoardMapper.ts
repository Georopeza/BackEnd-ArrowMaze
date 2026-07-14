import { LevelDefinition } from '../entities/LevelDefinition';
import { Cell } from '../entities/Cell';
import { ArrowCell } from '../entities/ArrowCell';
import { ArrowBodyCell } from '../entities/ArrowBodyCell';
import { WallCell } from '../entities/WallCell';
import { Arrow } from '../entities/Arrow';
import { ArrowId } from '../value-objects/ArrowId';
import { Position } from '../value-objects/Position';
import { BoardDimensions } from '../value-objects/BoardDimensions';
import { Board } from '../aggregates/Board';

/** Convierte LevelDefinition (autoría) en Board jugable con flechas y paredes. */
export class LevelToBoardMapper {
  /** Reconstruye flechas y paredes del nivel en un tablero listo para jugar. */
  public toBoard(level: LevelDefinition): Board {
    return this.boardFromCells(level.board);
  }

  /**
   * Igual que [toBoard], pero directo sobre una matriz de celdas en vez de un
   * `LevelDefinition` completo — reutilizado por `CubeLevelToBoardMapper`
   * para construir el tablero de cada cara del cubo sin duplicar esta lógica.
   */
  public boardFromCells(cells: Cell[][]): Board {
    const rows = cells.length;
    const cols = cells[0].length;
    const board = new Board(new BoardDimensions(rows, cols));

    const bodyPositionsByArrowId = this.groupBodyPositionsByArrowId(cells);

    cells.forEach((cellRow, row) => {
      cellRow.forEach((cell, col) => {
        if (cell instanceof ArrowCell) {
          const bodyPositions = bodyPositionsByArrowId.get(cell.arrowId) ?? [];
          board.addArrow(new Arrow(new ArrowId(cell.arrowId), new Position(row, col), cell.getDirection(), bodyPositions));
        }
        if (cell instanceof WallCell) {
          board.addWall(new Position(row, col));
        }
      });
    });

    return board;
  }

  // Recorre el grid y agrupa las posiciones de cada ArrowBodyCell según el arrowId de su cabeza.
  private groupBodyPositionsByArrowId(board: Cell[][]): Map<string, Position[]> {
    const positionsByArrowId = new Map<string, Position[]>();

    board.forEach((cellRow, row) => {
      cellRow.forEach((cell, col) => {
        if (cell instanceof ArrowBodyCell) {
          const positions = positionsByArrowId.get(cell.arrowId) ?? [];
          positions.push(new Position(row, col));
          positionsByArrowId.set(cell.arrowId, positions);
        }
      });
    });

    return positionsByArrowId;
  }
}

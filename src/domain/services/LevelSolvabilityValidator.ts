import { ArrowDefinition } from '../entities/ArrowDefinition';
import { Direction } from '../value-objects/Direction';

export class LevelSolvabilityValidator {
  // Determina si un conjunto de flechas puede resolverse dejando que cada una salga del tablero.
  public isPlayable(width: number, height: number, arrows: ArrowDefinition[]): boolean {
    if (!arrows.length) {
      return true;
    }

    return this.solve(this.toArrowPieces(arrows), width, height);
  }

  private toArrowPieces(arrows: ArrowDefinition[]): ArrowPiece[] {
    return arrows.map(arrow => ({
      id: arrow.id,
      direction: arrow.direction,
      head: { row: arrow.head.row, col: arrow.head.col },
      body: arrow.body.map(position => ({ row: position.row, col: position.col })),
    }));
  }

  // Recorre de forma recursiva las posibles salidas de las flechas para comprobar si existe una solución.
  private solve(activeArrows: ArrowPiece[], width: number, height: number): boolean {
    if (activeArrows.length === 0) {
      return true;
    }

    const playableArrows = this.getAvailableMoves(activeArrows, width, height);
    if (playableArrows.length === 0) {
      return false;
    }

    for (const arrowToLaunch of playableArrows) {
      const nextActiveArrows = activeArrows.filter(arrow => arrow.id !== arrowToLaunch.id);
      if (this.solve(nextActiveArrows, width, height)) {
        return true;
      }
    }

    return false;
  }

  private getAvailableMoves(activeArrows: ArrowPiece[], width: number, height: number): ArrowPiece[] {
    return activeArrows.filter(arrow => this.canArrowExit(arrow, activeArrows, width, height));
  }

  // Comprueba si la trayectoria de una flecha está libre hasta alcanzar el borde del tablero.
  public canArrowExit(arrow: ArrowPiece, activeArrows: ArrowPiece[], width: number, height: number): boolean {
    const { rowStep, colStep } = this.getSteps(arrow.direction);

    let row = arrow.head.row + rowStep;
    let col = arrow.head.col + colStep;

    while (row >= 0 && row < height && col >= 0 && col < width) {
      const isBlocked = activeArrows.some(otherArrow => {
        if (otherArrow.id === arrow.id) return false;

        const hitsHead = otherArrow.head.row === row && otherArrow.head.col === col;
        if (hitsHead) return true;

        return otherArrow.body.some(bodyPart => bodyPart.row === row && bodyPart.col === col);
      });

      if (isBlocked) {
        return false;
      }

      row += rowStep;
      col += colStep;
    }

    return true;
  }

  private getSteps(direction: Direction): { rowStep: number; colStep: number } {
    switch (direction) {
      case Direction.UP:
        return { rowStep: -1, colStep: 0 };
      case Direction.DOWN:
        return { rowStep: 1, colStep: 0 };
      case Direction.LEFT:
        return { rowStep: 0, colStep: -1 };
      case Direction.RIGHT:
        return { rowStep: 0, colStep: 1 };
      default:
        return { rowStep: 0, colStep: 0 };
    }
  }
}

interface ArrowPiece {
  id: string;
  direction: Direction;
  head: Coordinate;
  body: Coordinate[];
}

interface Coordinate {
  row: number;
  col: number;
}

import { CubeEscapePoint } from '../value-objects/CubeEscapePoint';
import { CubeSurfacePosition } from '../value-objects/CubeSurfacePosition';
import { CubePathArrow } from '../entities/CubePathArrow';

/** Tablero de superficie del cubo: flechas multi-cara + punto de escape. */
export class CubeSurfaceBoard {
  public readonly faceSize: number;
  public readonly escapePoint: CubeEscapePoint;
  public readonly arrows: readonly CubePathArrow[];

  constructor(faceSize: number, escapePoint: CubeEscapePoint, arrows: CubePathArrow[]) {
    if (faceSize < 1) {
      throw new Error('CubeSurfaceBoard faceSize must be >= 1.');
    }
    escapePoint.position.ensureWithin(faceSize);
    for (const arrow of arrows) {
      for (const cell of arrow.occupiedCells) {
        cell.ensureWithin(faceSize);
      }
      for (const cell of arrow.escapeRoute) {
        cell.ensureWithin(faceSize);
      }
      arrow.ensureEndsAt(escapePoint.position);
    }
    CubeSurfaceBoard.ensureNoOverlap(arrows);

    this.faceSize = faceSize;
    this.escapePoint = escapePoint;
    this.arrows = Object.freeze([...arrows]);
  }

  public isSolved(): boolean {
    return this.arrows.length === 0;
  }

  public arrowAt(position: CubeSurfacePosition): CubePathArrow | undefined {
    return this.arrows.find(a => a.occupies(position));
  }

  public arrowById(id: string): CubePathArrow {
    const found = this.arrows.find(a => a.id === id);
    if (!found) {
      throw new Error(`CubePathArrow ${id} not found.`);
    }
    return found;
  }

  public withoutArrow(id: string): CubeSurfaceBoard {
    return new CubeSurfaceBoard(
      this.faceSize,
      this.escapePoint,
      this.arrows.filter(a => a.id !== id)
    );
  }

  private static ensureNoOverlap(arrows: CubePathArrow[]): void {
    const seen = new Set<string>();
    for (const arrow of arrows) {
      for (const cell of arrow.occupiedCells) {
        const key = `${cell.face}:${cell.row},${cell.column}`;
        if (seen.has(key)) {
          throw new Error(`Overlapping cube arrow cell at ${cell}.`);
        }
        seen.add(key);
      }
    }
  }
}

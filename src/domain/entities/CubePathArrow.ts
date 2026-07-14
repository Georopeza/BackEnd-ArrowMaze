import { Direction } from '../value-objects/Direction';
import { CubeSurfacePosition } from '../value-objects/CubeSurfacePosition';

/** Flecha sobre la superficie: punta y cuerpo pueden estar en caras distintas. */
export class CubePathArrow {
  public readonly id: string;
  public readonly tip: CubeSurfacePosition;
  public readonly direction: Direction;
  public readonly body: readonly CubeSurfacePosition[];
  /** Camino desde la tip (excluida) hasta el punto de escape (incluido). */
  public readonly escapeRoute: readonly CubeSurfacePosition[];

  constructor(
    id: string,
    tip: CubeSurfacePosition,
    direction: Direction,
    body: CubeSurfacePosition[],
    escapeRoute: CubeSurfacePosition[]
  ) {
    if (body.some(p => p.equals(tip))) {
      throw new Error('CubePathArrow body cannot include the tip cell.');
    }
    if (escapeRoute.length === 0) {
      throw new Error('CubePathArrow escapeRoute cannot be empty.');
    }
    this.id = id;
    this.tip = tip;
    this.direction = direction;
    this.body = Object.freeze([...body]);
    this.escapeRoute = Object.freeze([...escapeRoute]);
  }

  public get occupiedCells(): CubeSurfacePosition[] {
    return [this.tip, ...this.body];
  }

  public occupies(position: CubeSurfacePosition): boolean {
    return this.occupiedCells.some(p => p.equals(position));
  }

  public ensureEndsAt(escape: CubeSurfacePosition): void {
    const last = this.escapeRoute[this.escapeRoute.length - 1];
    if (!last.equals(escape)) {
      throw new Error(`CubePathArrow ${this.id} escapeRoute must end at escape point ${escape}.`);
    }
  }
}

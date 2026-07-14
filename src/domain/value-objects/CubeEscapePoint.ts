import { CubeSurfacePosition } from '../value-objects/CubeSurfacePosition';

/** Punto fijo por el que las flechas salen del cubo al dispararlas. */
export class CubeEscapePoint {
  public readonly position: CubeSurfacePosition;

  constructor(position: CubeSurfacePosition) {
    this.position = position;
  }
}

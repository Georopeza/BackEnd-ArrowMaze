import { Face } from '../value-objects/Face';

/** Posición en la superficie del cubo: cara + celda local. */
export class CubeSurfacePosition {
  public readonly face: Face;
  public readonly row: number;
  public readonly column: number;

  constructor(face: Face, row: number, column: number) {
    this.face = face;
    this.row = row;
    this.column = column;
  }

  /** Valida que la posición esté dentro de una cara de tamaño `faceSize`. */
  public ensureWithin(faceSize: number): void {
    if (this.row < 0 || this.column < 0 || this.row >= faceSize || this.column >= faceSize) {
      throw new Error(
        `CubeSurfacePosition(${this.face}, ${this.row}, ${this.column}) is outside ${faceSize}x${faceSize}.`
      );
    }
  }

  public equals(other: CubeSurfacePosition): boolean {
    return this.face === other.face && this.row === other.row && this.column === other.column;
  }

  public toString(): string {
    return `CubeSurfacePosition(${this.face}, ${this.row}, ${this.column})`;
  }
}

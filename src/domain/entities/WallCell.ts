import { Cell } from './Cell';

// Celda que representa una pared inexpugnable.
export class WallCell extends Cell {
  public readonly type = 'WallCell';

  /**
   * Construye una celda de tipo pared.
   */
  constructor() {
    super();
  }

  /**
   * Devuelve una descripción legible de la WallCell.
   */
  public getDescription(): string {
    return 'WallCell';
  }
}

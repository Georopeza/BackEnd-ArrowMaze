import { Cell } from './Cell';

/** Celda de pared estática que bloquea el paso de las flechas. */
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

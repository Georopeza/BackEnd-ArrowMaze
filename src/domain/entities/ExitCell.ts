import { Cell } from './Cell';

// Celda que representa la salida del nivel.
export class ExitCell extends Cell {
  public readonly type = 'ExitCell';

  /**
   * Construye una celda de salida.
   */
  constructor() {
    super();
  }

  /**
   * Devuelve una descripción legible de la ExitCell.
   */
  public getDescription(): string {
    return 'ExitCell';
  }
}

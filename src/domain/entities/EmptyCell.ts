import { Cell } from './Cell';

/** Celda que representa un espacio vacío en el tablero. */
export class EmptyCell extends Cell {
  public readonly type = 'EmptyCell';

  /**
   * Construye una celda vacía.
   */
  constructor() {
    super();
  }

  /**
   * Devuelve una descripción legible de la EmptyCell.
   */
  public getDescription(): string {
    return 'EmptyCell';
  }
}

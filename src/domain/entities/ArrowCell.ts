import { Cell } from './Cell';
import { Direction } from '../value-objects/Direction';

// Celda que contiene una flecha con dirección.
export class ArrowCell extends Cell {
  public readonly type = 'ArrowCell';
  public readonly direction: Direction;

  /**
   * Construye una ArrowCell con la dirección especificada.
   * @param direction dirección de la flecha.
   */
  constructor(direction: Direction) {
    super();
    this.direction = direction;
  }

  /**
   * Devuelve una descripción legible de la ArrowCell.
   */
  public getDescription(): string {
    return `ArrowCell pointing ${this.direction}`;
  }
}

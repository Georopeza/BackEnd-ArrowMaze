import { Cell } from './Cell';
import { Direction } from '../value-objects/Direction';

/** Celda con la cabeza de una flecha; se vincula al cuerpo mediante arrowId. */
export class ArrowCell extends Cell {
  public readonly type = 'ArrowCell';
  public readonly direction: Direction;
  public readonly arrowId: string;

  /**
   * Construye una ArrowCell con la dirección y el id de flecha especificados.
   * @param direction dirección de la flecha.
   * @param arrowId identificador de la flecha, compartido con sus ArrowBodyCell.
   */
  constructor(direction: Direction, arrowId: string) {
    super();
    this.direction = direction;
    this.arrowId = arrowId;
  }

  /**
   * Devuelve una descripción legible de la ArrowCell.
   */
  public getDescription(): string {
    return `ArrowCell pointing ${this.direction}`;
  }

  /** Devuelve la dirección de disparo de la flecha. */
  public getDirection(): Direction {
    return this.direction;
  }
}

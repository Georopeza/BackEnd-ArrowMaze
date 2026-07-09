import { Cell } from './Cell';
import { Direction } from '../value-objects/Direction';

// Celda que contiene la cabeza de una flecha con dirección fija.
// El arrowId identifica a la flecha y permite vincularla con sus ArrowBodyCell (si tiene cuerpo),
// de modo que LevelToBoardMapper pueda reconstruir la flecha completa al armar un Board jugable.
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

  public getDirection(): Direction {
    return this.direction;
  }
}

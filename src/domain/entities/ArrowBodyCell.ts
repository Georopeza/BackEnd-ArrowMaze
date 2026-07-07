import { Cell } from './Cell';

// Celda que representa una parte del cuerpo de una flecha (no tiene dirección propia).
// Se vincula a su cabeza (ArrowCell) mediante un arrowId compartido, permitiendo que
// LevelToBoardMapper reconstruya flechas de más de una celda a partir del tablero estático.
export class ArrowBodyCell extends Cell {
  public readonly type = 'ArrowBodyCell';
  public readonly arrowId: string;

  /**
   * Construye una celda de cuerpo perteneciente a la flecha identificada por arrowId.
   * @param arrowId identificador de la flecha (debe coincidir con el de su ArrowCell/cabeza).
   */
  constructor(arrowId: string) {
    super();
    this.arrowId = arrowId;
  }

  /**
   * Devuelve una descripción legible de la ArrowBodyCell.
   */
  public getDescription(): string {
    return `ArrowBodyCell of arrow ${this.arrowId}`;
  }
}

import { Cell } from './Cell';

/** Celda de cuerpo de flecha vinculada a su cabeza por arrowId. */
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

// Value Object: Posición inmutable en el tablero.
// row y col representan las coordenadas de la celda.
export class Position {
  public readonly row: number;
  public readonly col: number;

  /**
   * Construye una nueva posición inmutable.
   * @param row fila de la posición en el tablero.
   * @param col columna de la posición en el tablero.
   */
  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  /**
   * Compara si otra posición tiene las mismas coordenadas.
   * @param other posición a comparar.
   * @returns true si las posiciones son equivalentes.
   */
  public equals(other: Position): boolean {
    return this.row === other.row && this.col === other.col;
  }
}

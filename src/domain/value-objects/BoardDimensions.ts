/** Dimensiones inmutables (filas y columnas) del tablero. */
export class BoardDimensions {
  public readonly rows: number;
  public readonly cols: number;

  /**
   * Construye un objeto de dimensiones del tablero.
   * @param rows cantidad de filas (debe ser > 0)
   * @param cols cantidad de columnas (debe ser > 0)
   * @throws Error si rows o cols son <= 0
   */
  constructor(rows: number, cols: number) {
    if (rows <= 0 || cols <= 0) {
      throw new Error('Board dimensions must be positive integers');
    }
    this.rows = rows;
    this.cols = cols;
  }

  /**
   * Compara si otra dimensión es equivalente.
   * @param other objeto BoardDimensions a comparar
   * @returns true si rows y cols son idénticas
   */
  public equals(other: BoardDimensions): boolean {
    return this.rows === other.rows && this.cols === other.cols;
  }

  /**
   * Calcula el total de celdas en el tablero.
   * @returns rows * cols
   */
  public getTotalCells(): number {
    return this.rows * this.cols;
  }

  /**
   * Valida si una posición (row, col) está dentro de los límites del tablero.
   * @param row fila a validar
   * @param col columna a validar
   * @returns true si la posición está dentro de límites
   */
  public isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }
}

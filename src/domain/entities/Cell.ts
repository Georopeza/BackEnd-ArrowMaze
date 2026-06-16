// Base pura para todas las celdas del tablero.
// Define el contrato mínimo común para cualquier componente del tablero.
export abstract class Cell {
  /**
   * Tipo de celda o componente para identificación.
   */
  public abstract readonly type: string;

  /**
   * Obtiene una descripción legible del componente.
   */
  public abstract getDescription(): string;
}

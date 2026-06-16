import { Cell } from './Cell';

// Componente común para celdas y grupos de tablero.
// Esta abstracción permite tratar celdas individuales y grupos de forma uniforme.
export abstract class BoardComponent extends Cell {
  /**
   * Obtiene los componentes hijos de este grupo o celda.
   */
  public abstract getComponents(): Cell[];
}

import { Cell } from '../entities/Cell';
import { LevelDefinition } from '../entities/LevelDefinition';

/** Template Method que define el flujo de procesamiento de una acción en el juego. */
export abstract class BaseLevelProcessor {
  protected level: LevelDefinition;

  /** Asocia el procesador con la definición del nivel. */
  constructor(level: LevelDefinition) {
    this.level = level;
  }

  /**
   * Método plantilla público que ejecuta la secuencia de pasos para procesar una acción.
   */
  public processAction(cell: Cell, actionPayload?: unknown): number {
    this.validateAction(cell, actionPayload);
    this.executeMovement(cell, actionPayload);
    const score = this.calculateCurrentScore(cell, actionPayload);
    this.checkWinningConditions(cell, actionPayload);

    return score;
  }

  /**
   * Valida si la acción es permitida según las reglas de juego.
   * @param cell celda objetivo.
   * @param actionPayload datos adicionales de la acción.
   */
  protected abstract validateAction(cell: Cell, actionPayload?: unknown): void;

  /**
   * Ejecuta el movimiento o la lógica principal de la acción.
   * @param cell celda objetivo.
   * @param actionPayload datos adicionales de la acción.
   */
  protected abstract executeMovement(cell: Cell, actionPayload?: unknown): void;

  /**
   * Calcula la puntuación actual después de ejecutar la acción.
   * @param cell celda objetivo.
   * @param actionPayload datos adicionales de la acción.
   * @returns puntuación actual.
   */
  protected calculateCurrentScore(cell: Cell, actionPayload?: unknown): number {
    return 0;
  }

  /**
   * Verifica si se cumplen las condiciones de victoria.
   * @param cell celda objetivo.
   * @param actionPayload datos adicionales de la acción.
   */
  protected checkWinningConditions(cell: Cell, actionPayload?: unknown): void {
    // Implementación por defecto: no hace nada.
  }
}

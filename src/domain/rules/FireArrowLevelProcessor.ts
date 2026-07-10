import { BaseLevelProcessor } from './BaseLevelProcessor';
import { Cell } from '../entities/Cell';
import { LevelDefinition } from '../entities/LevelDefinition';
import { Board } from '../aggregates/Board';
import { LevelActionService } from '../services/LevelActionService';

/** Payload con la posición del click sobre el tablero. */
export interface FireArrowActionPayload {
  row: number;
  col: number;
}

/** Procesador concreto que dispara flechas sobre un Board en vivo. */
export class FireArrowLevelProcessor extends BaseLevelProcessor {
  private readonly actionService = new LevelActionService();
  private lastActionSucceeded = false;

  /** Vincula el nivel con el tablero jugable sobre el que actuar. */
  constructor(level: LevelDefinition, private readonly board: Board) {
    super(level);
  }

  // Valida que la acción apunte a una posición dentro de los límites del tablero.
  protected validateAction(_cell: Cell, actionPayload?: unknown): void {
    const { row, col } = actionPayload as FireArrowActionPayload;
    if (!this.board.getDimensions().isValidPosition(row, col)) {
      throw new Error('Action targets a position outside the board');
    }
  }

  // Ejecuta el disparo delegando en LevelActionService, y recuerda si tuvo éxito.
  protected executeMovement(_cell: Cell, actionPayload?: unknown): void {
    const { row, col } = actionPayload as FireArrowActionPayload;
    this.lastActionSucceeded = this.actionService.interactWithCell(this.board, row, col);
  }

  // Un disparo exitoso vale 1 punto; un intento fallido (bloqueado o sin flecha) no puntúa.
  protected calculateCurrentScore(): number {
    return this.lastActionSucceeded ? 1 : 0;
  }

  /** Indica si el tablero ya no tiene flechas (nivel ganado). */
  public isLevelWon(): boolean {
    return this.board.isSolved();
  }
}

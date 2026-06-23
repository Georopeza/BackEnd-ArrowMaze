import { Board } from '../../aggregates/Board';
import { LevelActionService } from '../../services/LevelActionService'; // Ajusta la ruta si es necesario

export class BoardTestingAPI {
  private lastResult: boolean = false;
  private actionService: LevelActionService;

  constructor(private board: Board) {
    // Instanciamos el servicio aquí si es stateless (sin dependencias complejas)
    this.actionService = new LevelActionService();
  }

  // Encapsula las acciones (Act)
  public interactAt(row: number, col: number): void {
    // Delegamos la responsabilidad al servicio de dominio pasando el tablero
    this.lastResult = this.actionService.interactWithCell(this.board, row, col);
  }

  // Encapsula las verificaciones (Asserts semánticos)
  public expectActionToSucceed(): void {
    expect(this.lastResult).toBe(true);
  }

  public expectActionToFail(): void {
    expect(this.lastResult).toBe(false);
  }

  public expectEmptyBoard(): void {
    expect(this.board.getArrows().length).toBe(0);
  }

  public expectArrowCountToBe(expected: number): void {
    expect(this.board.getArrows().length).toBe(expected);
  }
}
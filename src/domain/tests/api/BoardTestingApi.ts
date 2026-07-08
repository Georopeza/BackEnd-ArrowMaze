import { Board } from '../../aggregates/Board';
import { LevelActionService } from '../../services/LevelActionService';
import { Direction } from '../../value-objects/Direction';
import { Position } from '../../value-objects/Position';
import { Arrow } from '../../entities/Arrow';
import { ArrowId } from '../../value-objects/ArrowId';

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

  // En src/tests/api/BoardTestingAPI.ts

  public addArrowAt(row: number, col: number, direction: Direction, body: Position[]): void {
    // Aquí delegamos al Board real
    const id = new ArrowId(Math.random().toString()); // Un ID temporal para el test
    const head = new Position(row, col);
    const arrow = new Arrow(id, head, direction, body);
    this.board.addArrow(arrow);
}
}
import { Board } from './Board';
import { Arrow } from '../entities/Arrow';
import { BoardDimensions } from '../value-objects/BoardDimensions';
import { ArrowId } from '../value-objects/ArrowId';
import { Position } from '../value-objects/Position';
import { Direction } from '../value-objects/Direction';

describe('Board - Shooting Logic', () => {
  let board: Board;
  const dims = new BoardDimensions(5, 5);

  beforeEach(() => {
    board = new Board(dims);
  });

  test('should_fire_arrow_correctly_if_path_is_clear', () => {
    const arrow = new Arrow(new ArrowId('a1'),new Position(2, 2),Direction.UP,
    [new Position(2, 3),new Position(3, 3),new Position(3, 4),new Position(3, 5)]);
    board.addArrow(arrow);
    const result = board.interactWithCell(3, 4);
    expect(result).toBe(true);
    expect(board.getArrows().length).toBe(0);
  });

  test('should_not_allow_to_exit_if_blocked_by_another_arrow', () => {
    const arrow1 = new Arrow(new ArrowId('a1'), new Position(2, 2), Direction.UP, [new Position(2, 3),new Position(3, 3),new Position(3, 4),new Position(3, 5)]);
    const arrow2 = new Arrow(new ArrowId('b2'), new Position(2, 4), Direction.DOWN, [new Position(1,4)]);
    
    board.addArrow(arrow1);
    board.addArrow(arrow2);
    board.printBoard(); // Visualizar el tablero antes de la interacción
    const result = board.interactWithCell(1, 4);
    board.printBoard(); // Visualizar el tablero después de la interacción
    
    expect(result).toBe(false);
    expect(board.getArrows().length).toBe(2);
  });

  test('should_allow_complex_shapes_and_fire_if_clear', () => {
    const arrowL = new Arrow(new ArrowId('L1'),new Position(2, 2),Direction.UP,[new Position(3, 2), new Position(3, 3)]);
    board.addArrow(arrowL);
    board.printBoard(); // Visualizar el tablero antes de la interacción

    const result = board.interactWithCell(2, 2);
    board.printBoard(); // Visualizar el tablero después de la interacción

    expect(result).toBe(true);
    expect(board.getArrows().length).toBe(0);
  });
});
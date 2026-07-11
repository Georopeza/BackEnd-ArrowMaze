import { LevelDefinition, Difficulty } from './LevelDefinition';
import { ArrowCell } from './ArrowCell';
import { ArrowBodyCell } from './ArrowBodyCell';
import { ExitCell } from './ExitCell';
import { EmptyCell } from './EmptyCell';
import { Cell } from './Cell';
import { Direction } from '../value-objects/Direction';

describe('LevelDefinition - Constructor Invariants', () => {
  // Tablero mínimo válido: una flecha y una salida, reutilizado como base para cada test.
  const validBoard = (): Cell[][] => [
    [new ArrowCell(Direction.UP, 'arrow-1'), new ExitCell()],
    [new EmptyCell(), new EmptyCell()],
  ];

  test('should_create_a_level_when_all_invariants_are_satisfied', () => {
    const level = new LevelDefinition('level-1', 'Level 1', 1, Difficulty.EASY, validBoard(), 10, 60);

    expect(level.id).toBe('level-1');
    expect(level.board).toHaveLength(2);
  });

  test('should_throw_an_error_when_the_board_is_empty', () => {
    expect(() => {
      new LevelDefinition('level-1', 'Level 1', 1, Difficulty.EASY, [], 10, 60);
    }).toThrow('The board matrix cannot be empty');
  });

  test('should_throw_an_error_when_board_rows_have_different_widths', () => {
    const nonUniformBoard: Cell[][] = [
      [new ArrowCell(Direction.UP, 'arrow-1'), new ExitCell()],
      [new EmptyCell()],
    ];

    expect(() => {
      new LevelDefinition('level-1', 'Level 1', 1, Difficulty.EASY, nonUniformBoard, 10, 60);
    }).toThrow('The board matrix must be uniform (all rows must have the same width)');
  });

  test('should_throw_an_error_when_maxMoves_or_maxTimeInSeconds_are_not_positive', () => {
    expect(() => {
      new LevelDefinition('level-1', 'Level 1', 1, Difficulty.EASY, validBoard(), 0, 60);
    }).toThrow('Game limits (maxMoves and maxTimeInSeconds) must be greater than zero');

    expect(() => {
      new LevelDefinition('level-1', 'Level 1', 1, Difficulty.EASY, validBoard(), 10, 0);
    }).toThrow('Game limits (maxMoves and maxTimeInSeconds) must be greater than zero');
  });

  test('should_throw_an_error_when_the_board_has_no_ExitCell', () => {
    const boardWithoutExit: Cell[][] = [
      [new ArrowCell(Direction.UP, 'arrow-1'), new EmptyCell()],
    ];

    expect(() => {
      new LevelDefinition('level-1', 'Level 1', 1, Difficulty.EASY, boardWithoutExit, 10, 60);
    }).toThrow('Level board must contain at least one ExitCell');
  });

  test('should_throw_an_error_when_the_board_has_no_ArrowCell', () => {
    const boardWithoutArrows: Cell[][] = [
      [new EmptyCell(), new ExitCell()],
    ];

    expect(() => {
      new LevelDefinition('level-1', 'Level 1', 1, Difficulty.EASY, boardWithoutArrows, 10, 60);
    }).toThrow('Level board must contain at least one ArrowCell to be playable');
  });

  test('should_throw_an_error_when_an_ArrowBodyCell_references_a_non_existent_arrowId', () => {
    // REGLA: un cuerpo huérfano (sin cabeza correspondiente) deja a la flecha incompleta.
    const boardWithOrphanBody: Cell[][] = [
      [new ArrowCell(Direction.UP, 'arrow-1'), new ExitCell()],
      [new ArrowBodyCell('arrow-does-not-exist'), new EmptyCell()],
    ];

    expect(() => {
      new LevelDefinition('level-1', 'Level 1', 1, Difficulty.EASY, boardWithOrphanBody, 10, 60);
    }).toThrow('Every ArrowBodyCell must reference an existing ArrowCell arrowId');
  });

  test('should_create_a_level_when_an_ArrowBodyCell_references_a_matching_arrowId', () => {
    const boardWithMatchingBody: Cell[][] = [
      [new ArrowCell(Direction.UP, 'arrow-1'), new ExitCell()],
      [new ArrowBodyCell('arrow-1'), new EmptyCell()],
    ];

    expect(() => {
      new LevelDefinition('level-1', 'Level 1', 1, Difficulty.EASY, boardWithMatchingBody, 10, 60);
    }).not.toThrow();
  });
});

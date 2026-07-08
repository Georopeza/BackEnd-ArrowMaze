import { LevelToBoardMapper } from './LevelToBoardMapper';
import { LevelBuilder } from '../builders/LevelBuilder';
import { Difficulty } from '../entities/LevelDefinition';
import { WallCell } from '../entities/WallCell';
import { ExitCell } from '../entities/ExitCell';
import { Direction } from '../value-objects/Direction';
import { Position } from '../value-objects/Position';

describe('LevelToBoardMapper - Cell[][] to Board bridge', () => {
  let mapper: LevelToBoardMapper;

  beforeEach(() => {
    mapper = new LevelToBoardMapper();
  });

  test('should_map_a_single_cell_arrow_into_a_playable_board', () => {
    // REGLA: Una ArrowCell sin cuerpo se convierte en una Arrow de una sola celda.
    const level = new LevelBuilder()
      .withId('level-1')
      .withDifficulty(Difficulty.EASY)
      .withDimensions(3, 3)
      .addArrow(1, 1, Direction.UP, 'arrow-1')
      .addCell(0, 0, new ExitCell())
      .withConstraints(5, 60)
      .build();

    const board = mapper.toBoard(level);

    expect(board.getArrows()).toHaveLength(1);
    const arrow = board.findArrowAt(new Position(1, 1));
    expect(arrow).toBeDefined();
    expect(arrow!.getDirection()).toBe(Direction.UP);
    expect(arrow!.getAllPositions()).toEqual([]);
  });

  test('should_map_a_multi_cell_arrow_grouping_body_cells_by_arrowId', () => {
    // REGLA: Las ArrowBodyCell que comparten arrowId con una cabeza forman una sola Arrow con cuerpo.
    const level = new LevelBuilder()
      .withId('level-2')
      .withDifficulty(Difficulty.MEDIUM)
      .withDimensions(4, 4)
      .addArrow(2, 2, Direction.RIGHT, 'arrow-L', [{ row: 2, col: 1 }, { row: 3, col: 1 }])
      .addCell(0, 0, new ExitCell())
      .withConstraints(5, 60)
      .build();

    const board = mapper.toBoard(level);

    expect(board.getArrows()).toHaveLength(1);
    const arrow = board.findArrowAt(new Position(2, 2));
    expect(arrow).toBeDefined();
    expect(arrow!.occupies(new Position(2, 1))).toBe(true);
    expect(arrow!.occupies(new Position(3, 1))).toBe(true);
  });

  test('should_carry_walls_over_to_the_resulting_board', () => {
    // REGLA: Las WallCell del nivel autorado deben quedar como paredes reales en el Board.
    const level = new LevelBuilder()
      .withId('level-3')
      .withDifficulty(Difficulty.HARD)
      .withDimensions(3, 3)
      .addArrow(1, 1, Direction.UP, 'arrow-1')
      .addCell(0, 1, new WallCell())
      .addCell(0, 0, new ExitCell())
      .withConstraints(5, 60)
      .build();

    const board = mapper.toBoard(level);

    expect(board.getCellAt(0, 1) instanceof WallCell).toBe(true);
  });
});

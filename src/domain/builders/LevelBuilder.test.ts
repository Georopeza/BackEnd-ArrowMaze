import { LevelBuilder } from './LevelBuilder';
import { Difficulty } from '../entities/LevelDefinition';
import { ExitCell } from '../entities/ExitCell';
import { Direction } from '../value-objects/Direction';

describe('LevelBuilder - Incremental Level Construction', () => {
  test('should_build_a_valid_level_when_all_required_pieces_are_provided', () => {
    const level = new LevelBuilder()
      .withId('level-1')
      .withLevelNumber(2)
      .withDifficulty(Difficulty.MEDIUM)
      .withDimensions(2, 2)
      .addArrow(0, 0, Direction.RIGHT, 'arrow-1')
      .addCell(1, 1, new ExitCell())
      .withConstraints(10, 60)
      .build();

    expect(level.id).toBe('level-1');
    expect(level.levelNumber).toBe(2);
    expect(level.difficulty).toBe(Difficulty.MEDIUM);
  });

  test('should_throw_an_error_when_id_is_missing', () => {
    expect(() => {
      new LevelBuilder()
        .withDimensions(2, 2)
        .addArrow(0, 0, Direction.RIGHT, 'arrow-1')
        .addCell(1, 1, new ExitCell())
        .withConstraints(10, 60)
        .build();
    }).toThrow('Level id is required');
  });

  test('should_throw_an_error_when_addCell_targets_a_row_that_does_not_exist', () => {
    expect(() => {
      new LevelBuilder().withDimensions(2, 2).addCell(5, 0, new ExitCell());
    }).toThrow('Board row does not exist');
  });

  test('should_throw_an_error_when_addCell_targets_a_column_that_does_not_exist', () => {
    expect(() => {
      new LevelBuilder().withDimensions(2, 2).addCell(0, 5, new ExitCell());
    }).toThrow('Board column does not exist');
  });

  test('should_build_a_multi_cell_arrow_when_addArrow_receives_a_body', () => {
    const level = new LevelBuilder()
      .withId('level-2')
      .withDimensions(3, 3)
      .addArrow(1, 1, Direction.UP, 'arrow-L', [{ row: 2, col: 1 }])
      .addCell(0, 0, new ExitCell())
      .withConstraints(10, 60)
      .build();

    expect(level.board[1][1].type).toBe('ArrowCell');
    expect(level.board[2][1].type).toBe('ArrowBodyCell');
  });
});

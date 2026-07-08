import { FireArrowLevelProcessor } from './FireArrowLevelProcessor';
import { BoardTestBuilder } from '../tests/builders/BoardTestBuilder';
import { LevelBuilder } from '../builders/LevelBuilder';
import { Difficulty } from '../entities/LevelDefinition';
import { ExitCell } from '../entities/ExitCell';
import { EmptyCell } from '../entities/EmptyCell';
import { Direction } from '../value-objects/Direction';

describe('FireArrowLevelProcessor - Template Method in action', () => {
  const buildLevel = () => new LevelBuilder()
    .withId('level-1')
    .withDifficulty(Difficulty.EASY)
    .withDimensions(3, 3)
    .addArrow(1, 1, Direction.UP, 'arrow-1')
    .addCell(0, 0, new ExitCell())
    .withConstraints(5, 60)
    .build();

  test('should_award_score_and_win_the_level_when_the_only_arrow_exits', () => {
    const board = new BoardTestBuilder().withDimensions(3, 3).withArrowAt(1, 1, Direction.UP).build();
    const processor = new FireArrowLevelProcessor(buildLevel(), board);

    const score = processor.processAction(new EmptyCell(), { row: 1, col: 1 });

    expect(score).toBe(1);
    expect(processor.isLevelWon()).toBe(true);
  });

  test('should_award_no_score_when_the_arrow_is_blocked_by_a_wall', () => {
    const board = new BoardTestBuilder()
      .withDimensions(3, 3)
      .withArrowAt(1, 1, Direction.UP)
      .withWallAt(0, 1)
      .build();
    const processor = new FireArrowLevelProcessor(buildLevel(), board);

    const score = processor.processAction(new EmptyCell(), { row: 1, col: 1 });

    expect(score).toBe(0);
    expect(processor.isLevelWon()).toBe(false);
  });

  test('should_throw_when_the_action_targets_a_position_outside_the_board', () => {
    const board = new BoardTestBuilder().withDimensions(3, 3).withArrowAt(1, 1, Direction.UP).build();
    const processor = new FireArrowLevelProcessor(buildLevel(), board);

    expect(() => processor.processAction(new EmptyCell(), { row: 9, col: 9 }))
      .toThrow('Action targets a position outside the board');
  });
});

import { Face } from '../value-objects/Face';
import { Direction } from '../value-objects/Direction';
import { CubeEscapePoint } from '../value-objects/CubeEscapePoint';
import { CubeSurfacePosition } from '../value-objects/CubeSurfacePosition';
import { CubePathArrow } from '../entities/CubePathArrow';
import { CubeSurfaceBoard } from '../aggregates/CubeSurfaceBoard';
import { CubePathMovementEngine } from '../services/CubePathMovementEngine';
import { buildDemoCubeSurfaceLevel3x3 } from '../entities/CubeSurfaceLevelDefinition';

describe('CubeSurfaceBoard - multi-face arrows + escape point', () => {
  const engine = new CubePathMovementEngine();

  test('should_allow_tip_and_body_on_different_faces', () => {
    const level = buildDemoCubeSurfaceLevel3x3();
    const board = level.toBoard();
    const bridge = board.arrowById('bridge');

    expect(bridge.tip.face).toBe(Face.FRONT);
    expect(bridge.body[0].face).toBe(Face.TOP);
    expect(bridge.escapeRoute[bridge.escapeRoute.length - 1].equals(board.escapePoint.position)).toBe(true);
  });

  test('should_block_when_escape_route_is_occupied', () => {
    const board = buildDemoCubeSurfaceLevel3x3().toBoard();
    const result = engine.attemptFire(board, 'bridge');

    expect(result.type).toBe('blocked');
    expect(board.arrows).toHaveLength(3);
  });

  test('should_extract_arrows_through_escape_point_in_valid_order', () => {
    let board = buildDemoCubeSurfaceLevel3x3().toBoard();

    const first = engine.attemptFire(board, 'blocker');
    expect(first.type).toBe('extracted');
    if (first.type !== 'extracted') return;
    board = first.board;

    const second = engine.attemptFire(board, 'bridge');
    expect(second.type).toBe('extracted');
    if (second.type !== 'extracted') return;
    board = second.board;

    const third = engine.attemptFire(board, 'corner');
    expect(third.type).toBe('extracted');
    if (third.type !== 'extracted') return;
    expect(third.board.isSolved()).toBe(true);
  });

  test('should_fire_when_tapping_body_on_another_face', () => {
    let board = buildDemoCubeSurfaceLevel3x3().toBoard();
    const cleared = engine.attemptFire(board, 'blocker');
    if (cleared.type !== 'extracted') throw new Error('expected extract');
    board = cleared.board;

    const result = engine.attemptFireAt(
      board,
      new CubeSurfacePosition(Face.TOP, 2, 1)
    );
    expect(result.type).toBe('extracted');
    if (result.type === 'extracted') {
      expect(result.arrowId).toBe('bridge');
    }
  });

  test('should_reject_escape_route_that_does_not_end_at_escape_point', () => {
    const escape = new CubeEscapePoint(new CubeSurfacePosition(Face.TOP, 0, 1));
    expect(() => {
      new CubeSurfaceBoard(3, escape, [
        new CubePathArrow(
          'bad',
          new CubeSurfacePosition(Face.FRONT, 1, 1),
          Direction.UP,
          [],
          [new CubeSurfacePosition(Face.FRONT, 0, 1)]
        ),
      ]);
    }).toThrow(/must end at escape point/);
  });
});

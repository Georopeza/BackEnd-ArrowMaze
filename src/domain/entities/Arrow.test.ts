import { Arrow } from './Arrow';
import { ArrowId } from '../value-objects/ArrowId';
import { Position } from '../value-objects/Position';
import { Direction } from '../value-objects/Direction';

describe('Arrow Entity', () => {
  const buildArrow = () => new Arrow(
    new ArrowId('arrow-1'),
    new Position(2, 2),
    Direction.RIGHT,
    [new Position(2, 1), new Position(3, 1)],
  );

  test('should_expose_its_id_direction_and_head_through_getters', () => {
    const arrow = buildArrow();

    expect(arrow.getId().value).toBe('arrow-1');
    expect(arrow.getDirection()).toBe(Direction.RIGHT);
    expect(arrow.getHead().equals(new Position(2, 2))).toBe(true);
  });

  test('should_return_all_body_positions_via_getAllPositions', () => {
    const arrow = buildArrow();

    expect(arrow.getAllPositions()).toEqual([new Position(2, 1), new Position(3, 1)]);
  });

  test('should_report_occupies_true_for_its_head_position', () => {
    const arrow = buildArrow();

    expect(arrow.occupies(new Position(2, 2))).toBe(true);
  });

  test('should_report_occupies_true_for_any_body_position', () => {
    const arrow = buildArrow();

    expect(arrow.occupies(new Position(2, 1))).toBe(true);
    expect(arrow.occupies(new Position(3, 1))).toBe(true);
  });

  test('should_report_occupies_false_for_a_position_it_does_not_cover', () => {
    const arrow = buildArrow();

    expect(arrow.occupies(new Position(0, 0))).toBe(false);
  });
});

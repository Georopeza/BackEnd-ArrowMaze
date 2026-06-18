import { Position } from './Position';

describe('Position Value Object', () => {

  it('should_return_true_when_comparing_two_positions_with_identical_coordinates', () => {
    // ARRANGE
    const position1 = new Position(2, 3);
    const position2 = new Position(2, 3);

    // ACT
    const isEqual = position1.equals(position2);

    // ASSERT
    expect(isEqual).toBe(true);
  });

  it('should_return_false_when_comparing_positions_with_different_coordinates', () => {
    // ARRANGE
    const position1 = new Position(2, 3);
    const position2 = new Position(5, 3);

    // ACT
    const isEqual = position1.equals(position2);

    // ASSERT
    expect(isEqual).toBe(false);
  });
});
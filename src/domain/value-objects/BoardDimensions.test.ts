import { BoardDimensions } from './BoardDimensions';

describe('BoardDimensions Value Object', () => {

  it('should_create_dimensions_object_when_rows_and_cols_are_positive', () => {
    // ARRANGE & ACT
    const dimensions = new BoardDimensions(3, 3);

    // ASSERT
    expect(dimensions.rows).toBe(3);
    expect(dimensions.cols).toBe(3);
    expect(dimensions.getTotalCells()).toBe(9);
  });

  it('should_throw_error_when_rows_or_cols_are_zero_or_negative', () => {
    // ARRANGE & ACT & ASSERT
    expect(() => {
      new BoardDimensions(0, 5);
    }).toThrow('Board dimensions must be positive');
  });
});
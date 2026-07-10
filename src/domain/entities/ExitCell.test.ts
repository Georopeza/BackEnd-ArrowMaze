import { ExitCell } from './ExitCell';

describe('ExitCell', () => {
  test('should_expose_the_correct_cell_type', () => {
    const exitCell = new ExitCell();
    expect(exitCell.type).toBe('ExitCell');
  });

  test('should_return_the_correct_description', () => {
    const exitCell = new ExitCell();
    expect(exitCell.getDescription()).toBe('ExitCell');
  });
});
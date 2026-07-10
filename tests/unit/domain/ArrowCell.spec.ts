import { ArrowCell } from '../../../src/domain/entities/ArrowCell';
import { Direction } from '../../../src/domain/value-objects/Direction';

describe('ArrowCell', () => {
  it('should_expose_type_direction_and_arrowId_from_construction', () => {
    // Arrange
    const direction = Direction.RIGHT;

    // Act
    const cell = new ArrowCell(direction, 'arrow-1');

    // Assert
    expect(cell.type).toBe('ArrowCell');
    expect(cell.direction).toBe(Direction.RIGHT);
    expect(cell.arrowId).toBe('arrow-1');
  });

  it('should_describe_cell_including_its_direction', () => {
    // Arrange
    const cell = new ArrowCell(Direction.UP, 'arrow-1');

    // Act
    const description = cell.getDescription();

    // Assert
    expect(description).toBe('ArrowCell pointing UP');
  });
});

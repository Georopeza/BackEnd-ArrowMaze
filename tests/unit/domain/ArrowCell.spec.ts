import { ArrowCell } from '../../../src/domain/entities/ArrowCell';
import { Direction } from '../../../src/domain/value-objects/Direction';

describe('ArrowCell', () => {
  it('expone el tipo y la dirección con la que fue creada', () => {
    // Arrange
    const direction = Direction.RIGHT;

    // Act
    const cell = new ArrowCell(direction, 'arrow-1');
    const cell = new ArrowCell(direction);

    // Assert
    expect(cell.type).toBe('ArrowCell');
    expect(cell.direction).toBe(Direction.RIGHT);
    expect(cell.arrowId).toBe('arrow-1');
  });

  it('describe la celda incluyendo su dirección', () => {
    // Arrange
    const cell = new ArrowCell(Direction.UP, 'arrow-1');
    const cell = new ArrowCell(Direction.UP);

    // Act
    const description = cell.getDescription();

    // Assert
    expect(description).toBe('ArrowCell pointing UP');
  });
});

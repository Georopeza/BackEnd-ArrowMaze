import { ExitCell } from './ExitCell';

describe('ExitCell', () => {
  test('deberia tener el tipo correcto', () => {
    const exitCell = new ExitCell();
    expect(exitCell.type).toBe('ExitCell');
  });

  test('deberia devolver la descripcion correcta', () => {
    const exitCell = new ExitCell();
    expect(exitCell.getDescription()).toBe('ExitCell');
  });
});
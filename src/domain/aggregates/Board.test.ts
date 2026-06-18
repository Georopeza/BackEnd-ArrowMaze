import { Board } from './Board';
import { BoardDimensions } from '../value-objects/BoardDimensions';
import { ArrowCell } from '../entities/ArrowCell';
import { EmptyCell } from '../entities/EmptyCell';
import { Direction } from '../value-objects/Direction';

describe('Board Aggregate Root', () => {

  it('should_replace_arrow_with_empty_cell_when_no_other_arrows_block_its_path_to_the_edge', () => {
    // ARRANGE: Tablero 3x3 con una flecha en el centro apuntando hacia ARRIBA (camino libre)
    const dimensions = new BoardDimensions(3, 3);
    const arrow = new ArrowCell(Direction.UP);
    
    const customGrid = [
      [new EmptyCell(), new EmptyCell(), new EmptyCell()],
      [new EmptyCell(), arrow,            new EmptyCell()],
      [new EmptyCell(), new EmptyCell(), new EmptyCell()]
    ];
    const board = new Board(dimensions, customGrid);

    // ACT: El jugador interactúa con la flecha en la posición (1, 1)
    const result = board.interactWithCell(1, 1);

    // ASSERT: La flecha debió salir volando con éxito
    expect(result).toBe(true);
    expect(board.getCellAt(1, 1)).toBeInstanceOf(EmptyCell);
  });

  it('should_keep_arrow_in_its_position_and_return_false_when_another_arrow_is_blocking_its_path', () => {
    // ARRANGE: Una flecha en (1,1) bloqueada por otra flecha en (0,1)
    const dimensions = new BoardDimensions(3, 3);
    const playerArrow = new ArrowCell(Direction.UP);
    const blockingArrow = new ArrowCell(Direction.RIGHT);
    
    const customGrid = [
      [new EmptyCell(), blockingArrow, new EmptyCell()],
      [new EmptyCell(), playerArrow,   new EmptyCell()],
      [new EmptyCell(), new EmptyCell(), new EmptyCell()]
    ];
    const board = new Board(dimensions, customGrid);

    // ACT: Se intenta disparar la flecha bloqueada
    const result = board.interactWithCell(1, 1);

    // ASSERT: El movimiento falla y la flecha se queda ahí
    expect(result).toBe(false);
    expect(board.getCellAt(1, 1)).toBe(playerArrow);
  });

  it('should_replace_arrow_with_empty_cell_when_path_is_clear', () => {
    // ARRANGE: Tablero con flecha hacia abajo en (0,1) y hacia la izquierda en (1,1)
    const dimensions = new BoardDimensions(3, 3);
    const arrowDown = new ArrowCell(Direction.DOWN);
    const arrowLeft = new ArrowCell(Direction.LEFT);
    const arrowUp = new ArrowCell(Direction.UP);
    const arrowRight = new ArrowCell(Direction.RIGHT);
    
    const customGrid = [
      [new EmptyCell(), arrowLeft,       arrowUp],
      [new EmptyCell(), arrowDown,       arrowRight],
      [new EmptyCell(), new EmptyCell(), new EmptyCell()]
    ];
    const board = new Board(dimensions, customGrid);

    // ACT & ASSERT: Probamos la lógica de la dirección DOWN 
    const resultDown = board.interactWithCell(1, 1);
    expect(resultDown).toBe(true);
    expect(board.getCellAt(1, 1)).toBeInstanceOf(EmptyCell);

    // ACT & ASSERT: Probamos la lógica de la dirección LEFT 
    const resultLeft = board.interactWithCell(0, 1);
    expect(resultLeft).toBe(true);
    expect(board.getCellAt(0, 1)).toBeInstanceOf(EmptyCell);

    // ACT & ASSERT: Probamos la lógica de la dirección UP 
    const resultUp = board.interactWithCell(0, 2);
    expect(resultUp).toBe(true);
    expect(board.getCellAt(0, 2)).toBeInstanceOf(EmptyCell);
    
    // ACT & ASSERT: Probamos la lógica de la dirección RIGHT
    const resultRight = board.interactWithCell(1, 2);
    expect(resultRight).toBe(true);
    expect(board.getCellAt(1, 2)).toBeInstanceOf(EmptyCell);
  });

  it('should_throw_error_when_interacting_with_an_already_empty_cell', () => {
  // ARRANGE: Un tablero vacío (o puedes usar tu customGrid de celdas vacías)
  const dimensions = new BoardDimensions(3, 3);
  const board = new Board(dimensions);

  // ACT & ASSERT: Envolvemos la llamada en una función para que Jest pueda atrapar el error
  expect(() => {
    board.interactWithCell(1, 1);
  }).toThrow('Cannot interact with'); // Verifica que el error contenga este texto
});

  it('should_throw_error_when_trying_to_interact_with_out_of_bounds_coordinates', () => {
    // ARRANGE: Tablero base
    const dimensions = new BoardDimensions(3, 3);
    const customGrid = [
      [new EmptyCell(), new EmptyCell(), new EmptyCell()],
      [new EmptyCell(), new EmptyCell(), new EmptyCell()],
      [new EmptyCell(), new EmptyCell(), new EmptyCell()]
    ];
    const board = new Board(dimensions, customGrid);

    // ACT & ASSERT: Forzamos el control de errores con coordenadas inválidas (Línea 39 / 76)
    expect(() => {
      board.interactWithCell(5, 1); // Fila fuera de rango
    }).toThrow();

    expect(() => {
      board.interactWithCell(-1, 0); // Fila negativa
    }).toThrow();
  });
});
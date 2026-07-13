import { CubeBoard } from './CubeBoard';
import { Board } from './Board';
import { BoardTestBuilder } from '../tests/builders/BoardTestBuilder';
import { BoardTestingAPI } from '../tests/api/BoardTestingApi';
import { Face, ALL_FACES } from '../value-objects/Face';
import { Direction } from '../value-objects/Direction';

describe('CubeBoard - 6 independent faces', () => {
  // Construye un cubo con un tablero 5x5 vacío por cada cara, salvo overrides.
  const cubeWithBoards = (overrides: Partial<Record<Face, Board>> = {}): CubeBoard => {
    const boardsByFace = new Map<Face, Board>();
    for (const face of ALL_FACES) {
      boardsByFace.set(face, overrides[face] ?? new BoardTestBuilder().withDimensions(5, 5).build());
    }
    return new CubeBoard(boardsByFace);
  };

  test('should_throw_an_error_when_a_face_is_missing', () => {
    const boardsByFace = new Map<Face, Board>();
    for (const face of ALL_FACES.slice(0, 5)) {
      boardsByFace.set(face, new BoardTestBuilder().withDimensions(3, 3).build());
    }

    expect(() => new CubeBoard(boardsByFace)).toThrow('CubeBoard is missing face "RIGHT"');
  });

  test('should_expose_the_board_of_each_face_independently', () => {
    const frontBoard = new BoardTestBuilder().withDimensions(3, 3).withArrowAt(0, 0, Direction.RIGHT).build();
    const cube = cubeWithBoards({ [Face.FRONT]: frontBoard });

    expect(cube.getBoard(Face.FRONT)).toBe(frontBoard);
    expect(cube.getBoard(Face.FRONT).getArrows()).toHaveLength(1);
    expect(cube.getBoard(Face.BACK).getArrows()).toHaveLength(0);
  });

  test('should_be_solved_when_all_6_faces_have_no_arrows_left', () => {
    const cube = cubeWithBoards();

    expect(cube.isSolved()).toBe(true);
  });

  test('should_not_be_solved_while_at_least_one_face_still_has_arrows', () => {
    const frontBoard = new BoardTestBuilder().withDimensions(3, 3).withArrowAt(0, 0, Direction.RIGHT).build();
    const cube = cubeWithBoards({ [Face.FRONT]: frontBoard });

    expect(cube.isSolved()).toBe(false);
  });

  test('should_become_solved_once_the_last_remaining_faces_arrow_exits', () => {
    // REGLA: cada cara se resuelve con su propio motor de reglas — sin cambios sobre lo existente.
    const frontBoard = new BoardTestBuilder().withDimensions(3, 3).withArrowAt(0, 0, Direction.RIGHT).build();
    const cube = cubeWithBoards({ [Face.FRONT]: frontBoard });

    expect(cube.isSolved()).toBe(false);

    const api = new BoardTestingAPI(cube.getBoard(Face.FRONT));
    api.interactAt(0, 0);
    api.expectActionToSucceed();

    expect(cube.isSolved()).toBe(true);
  });

  test('should_not_let_firing_on_one_face_affect_arrows_on_another_face', () => {
    // REGLA: las caras son tableros cerrados e independientes — sin cuerpos ni bloqueos compartidos.
    const frontBoard = new BoardTestBuilder().withDimensions(3, 3).withArrowAt(0, 0, Direction.RIGHT).build();
    const backBoard = new BoardTestBuilder().withDimensions(3, 3).withArrowAt(0, 0, Direction.RIGHT).build();
    const cube = cubeWithBoards({ [Face.FRONT]: frontBoard, [Face.BACK]: backBoard });

    const frontApi = new BoardTestingAPI(cube.getBoard(Face.FRONT));
    frontApi.interactAt(0, 0);
    frontApi.expectActionToSucceed();

    expect(cube.getBoard(Face.FRONT).getArrows()).toHaveLength(0);
    expect(cube.getBoard(Face.BACK).getArrows()).toHaveLength(1);
    expect(cube.isSolved()).toBe(false);
  });
});

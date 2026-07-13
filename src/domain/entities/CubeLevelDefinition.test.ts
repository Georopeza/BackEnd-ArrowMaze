import { CubeLevelDefinition, CubeFaces } from './CubeLevelDefinition';
import { Difficulty } from './LevelDefinition';
import { Face, ALL_FACES } from '../value-objects/Face';
import { ArrowCell } from './ArrowCell';
import { ExitCell } from './ExitCell';
import { EmptyCell } from './EmptyCell';
import { Cell } from './Cell';
import { Direction } from '../value-objects/Direction';

describe('CubeLevelDefinition - Constructor Invariants', () => {
  // Cara mínima válida: cuadrada (2x2), con una flecha y una salida.
  const validFaceBoard = (arrowId: string): Cell[][] => [
    [new ArrowCell(Direction.UP, arrowId), new ExitCell()],
    [new EmptyCell(), new EmptyCell()],
  ];

  const validFaces = (): CubeFaces => {
    const faces = {} as CubeFaces;
    for (const face of ALL_FACES) {
      faces[face] = validFaceBoard(`arrow-${face.toLowerCase()}`);
    }
    return faces;
  };

  test('should_create_a_cube_level_when_all_6_faces_are_valid_and_square', () => {
    const cube = new CubeLevelDefinition('cube-1', 'Cube 1', 1, Difficulty.EASY, validFaces(), 20, 120);

    expect(cube.id).toBe('cube-1');
    expect(cube.faceSize).toBe(2);
    expect(Object.keys(cube.faces)).toHaveLength(6);
  });

  test('should_throw_an_error_when_a_face_is_missing', () => {
    const faces = validFaces();
    delete (faces as Partial<CubeFaces>).BACK;

    expect(() => {
      new CubeLevelDefinition('cube-1', 'Cube 1', 1, Difficulty.EASY, faces, 20, 120);
    }).toThrow('Cube level is missing face "BACK"');
  });

  test('should_throw_an_error_when_a_face_violates_board_invariants', () => {
    const faces = validFaces();
    faces[Face.TOP] = [[new EmptyCell(), new EmptyCell()]]; // sin ArrowCell ni ExitCell

    expect(() => {
      new CubeLevelDefinition('cube-1', 'Cube 1', 1, Difficulty.EASY, faces, 20, 120);
    }).toThrow('Level board must contain at least one ExitCell');
  });

  test('should_throw_an_error_when_a_face_is_not_square', () => {
    const faces = validFaces();
    faces[Face.RIGHT] = [
      [new ArrowCell(Direction.UP, 'arrow-right'), new ExitCell(), new EmptyCell()],
      [new EmptyCell(), new EmptyCell(), new EmptyCell()],
    ]; // 2x3, no cuadrada

    expect(() => {
      new CubeLevelDefinition('cube-1', 'Cube 1', 1, Difficulty.EASY, faces, 20, 120);
    }).toThrow(/must all be square/);
  });

  test('should_throw_an_error_when_faces_have_different_dimensions', () => {
    const faces = validFaces();
    faces[Face.LEFT] = [
      [new ArrowCell(Direction.UP, 'arrow-left'), new ExitCell(), new EmptyCell()],
      [new EmptyCell(), new EmptyCell(), new EmptyCell()],
      [new EmptyCell(), new EmptyCell(), new EmptyCell()],
    ]; // 3x3, cuadrada pero distinta a las demás (2x2)

    expect(() => {
      new CubeLevelDefinition('cube-1', 'Cube 1', 1, Difficulty.EASY, faces, 20, 120);
    }).toThrow(/must all be square/);
  });

  test('should_throw_an_error_when_maxMoves_or_maxTimeInSeconds_are_not_positive', () => {
    expect(() => {
      new CubeLevelDefinition('cube-1', 'Cube 1', 1, Difficulty.EASY, validFaces(), 0, 120);
    }).toThrow('Game limits (maxMoves and maxTimeInSeconds) must be greater than zero');

    expect(() => {
      new CubeLevelDefinition('cube-1', 'Cube 1', 1, Difficulty.EASY, validFaces(), 20, 0);
    }).toThrow('Game limits (maxMoves and maxTimeInSeconds) must be greater than zero');
  });
});

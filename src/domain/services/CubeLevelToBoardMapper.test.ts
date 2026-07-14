import { CubeLevelToBoardMapper } from './CubeLevelToBoardMapper';
import { CubeLevelDefinition, CubeFaces } from '../entities/CubeLevelDefinition';
import { Difficulty } from '../entities/LevelDefinition';
import { Face, ALL_FACES } from '../value-objects/Face';
import { ArrowCell } from '../entities/ArrowCell';
import { ArrowBodyCell } from '../entities/ArrowBodyCell';
import { ExitCell } from '../entities/ExitCell';
import { EmptyCell } from '../entities/EmptyCell';
import { WallCell } from '../entities/WallCell';
import { Cell } from '../entities/Cell';
import { Direction } from '../value-objects/Direction';
import { LevelActionService } from './LevelActionService';

describe('CubeLevelToBoardMapper - CubeLevelDefinition to CubeBoard bridge', () => {
  const mapper = new CubeLevelToBoardMapper();

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

  test('should_build_one_board_per_face_with_the_right_dimensions_and_arrows', () => {
    const cubeLevel = new CubeLevelDefinition('cube-1', 'Cube 1', 1, Difficulty.EASY, validFaces(), 20, 120);

    const cubeBoard = mapper.toCubeBoard(cubeLevel);

    for (const face of ALL_FACES) {
      const board = cubeBoard.getBoard(face);
      expect(board.getDimensions().rows).toBe(2);
      expect(board.getDimensions().cols).toBe(2);
      expect(board.getArrows()).toHaveLength(1);
    }
  });

  test('should_map_walls_and_multi_cell_arrow_bodies_within_a_single_face', () => {
    const faces = validFaces();
    faces[Face.FRONT] = [
      [new ArrowCell(Direction.RIGHT, 'arrow-front'), new ArrowBodyCell('arrow-front'), new ExitCell()],
      [new WallCell(), new EmptyCell(), new EmptyCell()],
      [new EmptyCell(), new EmptyCell(), new EmptyCell()],
    ];
    // El resto de caras deben quedar cuadradas de 3x3 también, para que el cubo sea válido.
    for (const face of ALL_FACES) {
      if (face === Face.FRONT) continue;
      faces[face] = [
        [new ArrowCell(Direction.UP, `arrow-${face.toLowerCase()}`), new ExitCell(), new EmptyCell()],
        [new EmptyCell(), new EmptyCell(), new EmptyCell()],
        [new EmptyCell(), new EmptyCell(), new EmptyCell()],
      ];
    }

    const cubeLevel = new CubeLevelDefinition('cube-1', 'Cube 1', 1, Difficulty.EASY, faces, 20, 120);
    const cubeBoard = mapper.toCubeBoard(cubeLevel);
    const frontBoard = cubeBoard.getBoard(Face.FRONT);

    const frontArrow = frontBoard.getArrows()[0];
    expect(frontArrow.getHead()).toEqual({ row: 0, col: 0 });
    expect(frontArrow.getAllPositions()).toHaveLength(1); // solo el cuerpo; getAllPositions() no incluye la cabeza
    expect(frontBoard.getCellAt(1, 0)).toBeInstanceOf(WallCell);
  });

  test('should_produce_faces_that_play_by_the_existing_line_of_sight_rules_unmodified', () => {
    // REGLA: el motor de disparo no cambia — se prueba contra LevelActionService tal cual.
    const faces = validFaces();
    const cubeLevel = new CubeLevelDefinition('cube-1', 'Cube 1', 1, Difficulty.EASY, faces, 20, 120);
    const cubeBoard = mapper.toCubeBoard(cubeLevel);
    const topBoard = cubeBoard.getBoard(Face.TOP);

    const actionService = new LevelActionService();
    const fired = actionService.interactWithCell(topBoard, 0, 0);

    expect(fired).toBe(true);
    expect(topBoard.getArrows()).toHaveLength(0);
  });
});

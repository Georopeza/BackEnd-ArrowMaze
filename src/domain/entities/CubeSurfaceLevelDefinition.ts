import { Face } from '../value-objects/Face';
import { Direction } from '../value-objects/Direction';
import { Difficulty } from './LevelDefinition';
import { CubeEscapePoint } from '../value-objects/CubeEscapePoint';
import { CubeSurfacePosition } from '../value-objects/CubeSurfacePosition';
import { CubePathArrow } from './CubePathArrow';
import { CubeSurfaceBoard } from '../aggregates/CubeSurfaceBoard';

/**
 * Definición de un nivel-cubo de superficie: un tamaño NxN, un escape
 * y flechas cuya punta/cuerpo pueden vivir en caras distintas.
 */
export class CubeSurfaceLevelDefinition {
  public readonly id: string;
  public readonly name: string;
  public readonly levelNumber: number;
  public readonly difficulty: Difficulty;
  public readonly faceSize: number;
  public readonly escapePoint: CubeEscapePoint;
  public readonly arrows: readonly CubePathArrow[];
  public readonly maxMoves: number;
  public readonly maxTimeInSeconds: number;

  constructor(
    id: string,
    name: string,
    levelNumber: number,
    difficulty: Difficulty,
    faceSize: number,
    escapePoint: CubeEscapePoint,
    arrows: CubePathArrow[],
    maxMoves: number,
    maxTimeInSeconds: number
  ) {
    if (faceSize < 1) {
      throw new Error('Cube surface faceSize must be >= 1.');
    }
    if (maxMoves <= 0 || maxTimeInSeconds <= 0) {
      throw new Error('Game limits must be greater than zero');
    }
    escapePoint.position.ensureWithin(faceSize);
    for (const arrow of arrows) {
      for (const cell of arrow.occupiedCells) cell.ensureWithin(faceSize);
      for (const cell of arrow.escapeRoute) cell.ensureWithin(faceSize);
      arrow.ensureEndsAt(escapePoint.position);
    }

    this.id = id;
    this.name = name;
    this.levelNumber = levelNumber;
    this.difficulty = difficulty;
    this.faceSize = faceSize;
    this.escapePoint = escapePoint;
    this.arrows = Object.freeze([...arrows]);
    this.maxMoves = maxMoves;
    this.maxTimeInSeconds = maxTimeInSeconds;
  }

  /** Materializa el tablero jugable de dominio. */
  public toBoard(): CubeSurfaceBoard {
    return new CubeSurfaceBoard(this.faceSize, this.escapePoint, [...this.arrows]);
  }
}

/** Nivel demo 3×3 para pruebas (escape en TOP, flechas multi-cara). */
export function buildDemoCubeSurfaceLevel3x3(): CubeSurfaceLevelDefinition {
  const escape = new CubeEscapePoint(new CubeSurfacePosition(Face.TOP, 0, 1));

  const blocker = new CubePathArrow(
    'blocker',
    new CubeSurfacePosition(Face.FRONT, 0, 1),
    Direction.UP,
    [new CubeSurfacePosition(Face.FRONT, 0, 2)],
    [
      new CubeSurfacePosition(Face.TOP, 2, 2),
      new CubeSurfacePosition(Face.TOP, 1, 2),
      new CubeSurfacePosition(Face.TOP, 0, 2),
      new CubeSurfacePosition(Face.TOP, 0, 1),
    ]
  );

  const bridge = new CubePathArrow(
    'bridge',
    new CubeSurfacePosition(Face.FRONT, 1, 1),
    Direction.UP,
    [new CubeSurfacePosition(Face.TOP, 2, 1)],
    [
      new CubeSurfacePosition(Face.FRONT, 0, 1),
      new CubeSurfacePosition(Face.TOP, 2, 1),
      new CubeSurfacePosition(Face.TOP, 1, 1),
      new CubeSurfacePosition(Face.TOP, 0, 1),
    ]
  );

  const corner = new CubePathArrow(
    'corner',
    new CubeSurfacePosition(Face.RIGHT, 1, 0),
    Direction.LEFT,
    [new CubeSurfacePosition(Face.FRONT, 1, 2)],
    [
      new CubeSurfacePosition(Face.FRONT, 1, 1),
      new CubeSurfacePosition(Face.FRONT, 0, 1),
      new CubeSurfacePosition(Face.TOP, 2, 1),
      new CubeSurfacePosition(Face.TOP, 1, 1),
      new CubeSurfacePosition(Face.TOP, 0, 1),
    ]
  );

  return new CubeSurfaceLevelDefinition(
    'cube-surface-demo-3x3',
    'Demo superficie 3x3',
    1,
    Difficulty.EASY,
    3,
    escape,
    [blocker, bridge, corner],
    10,
    120
  );
}

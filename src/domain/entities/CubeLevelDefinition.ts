import { Cell } from './Cell';
import { Difficulty } from './LevelDefinition';
import { Face, ALL_FACES } from '../value-objects/Face';
import { validateBoardCellInvariants } from '../validators/boardCellInvariantsValidator';

/** Tablero por cara: cada cara del cubo es una matriz de celdas independiente. */
export type CubeFaces = Record<Face, Cell[][]>;

/**
 * Definición inmutable de un nivel-cubo: 6 caras, cada una un tablero 2D
 * cerrado e independiente (misma regla de disparo/salida que un nivel
 * normal, por cara). No hay flechas compartidas entre caras.
 */
export class CubeLevelDefinition {
  public readonly id: string;
  public readonly name: string;
  public readonly levelNumber: number;
  public readonly difficulty: Difficulty;
  public readonly faces: CubeFaces;
  public readonly maxMoves: number;
  public readonly maxTimeInSeconds: number;

  /** Valida que las 6 caras existan, cumplan las reglas de tablero y compartan dimensiones NxN. */
  constructor(
    id: string,
    name: string,
    levelNumber: number,
    difficulty: Difficulty,
    faces: CubeFaces,
    maxMoves: number,
    maxTimeInSeconds: number
  ) {
    // 1. Deben estar presentes las 6 caras
    for (const face of ALL_FACES) {
      if (!faces[face]) {
        throw new Error(`Cube level is missing face "${face}"`);
      }
    }

    // 2. Cada cara debe cumplir, por sí sola, las mismas reglas que un tablero normal
    for (const face of ALL_FACES) {
      validateBoardCellInvariants(faces[face]);
    }

    // 3. El cubo debe ser cúbico: las 6 caras comparten las mismas dimensiones NxN
    const referenceSize = faces[ALL_FACES[0]].length;
    for (const face of ALL_FACES) {
      const board = faces[face];
      const isSquare = board.length === board[0].length;
      const matchesReference = board.length === referenceSize && board[0].length === referenceSize;
      if (!isSquare || !matchesReference) {
        throw new Error(
          `Cube faces must all be square and share the same NxN dimensions (${referenceSize}x${referenceSize}); ` +
            `face "${face}" is ${board.length}x${board[0].length}`
        );
      }
    }

    // 4. Límites de juego coherentes, globales para el cubo completo
    if (maxMoves <= 0 || maxTimeInSeconds <= 0) {
      throw new Error('Game limits (maxMoves and maxTimeInSeconds) must be greater than zero');
    }

    this.id = id;
    this.name = name;
    this.levelNumber = levelNumber;
    this.difficulty = difficulty;
    this.faces = faces;
    this.maxMoves = maxMoves;
    this.maxTimeInSeconds = maxTimeInSeconds;
  }

  /** Tamaño de lado compartido por las 6 caras (p. ej. 3 para un cubo 3x3x3). */
  public get faceSize(): number {
    return this.faces[ALL_FACES[0]].length;
  }
}

import { CubeLevelDefinition } from '../entities/CubeLevelDefinition';
import { CubeBoard } from '../aggregates/CubeBoard';
import { Board } from '../aggregates/Board';
import { Face, ALL_FACES } from '../value-objects/Face';
import { LevelToBoardMapper } from './LevelToBoardMapper';

/** Convierte CubeLevelDefinition (autoría) en CubeBoard jugable, cara por cara. */
export class CubeLevelToBoardMapper {
  private readonly levelToBoardMapper = new LevelToBoardMapper();

  /** Construye un tablero independiente por cada cara y las une en un CubeBoard. */
  public toCubeBoard(level: CubeLevelDefinition): CubeBoard {
    const boardsByFace = new Map<Face, Board>();

    for (const face of ALL_FACES) {
      boardsByFace.set(face, this.levelToBoardMapper.boardFromCells(level.faces[face]));
    }

    return new CubeBoard(boardsByFace);
  }
}

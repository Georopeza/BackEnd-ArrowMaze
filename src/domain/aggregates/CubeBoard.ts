import { Board } from './Board';
import { Face, ALL_FACES } from '../value-objects/Face';

/**
 * Agregado raíz de un cubo jugable: 6 `Board` independientes, uno por cara.
 * No hay interacción entre caras — cada una resuelve su propia línea de
 * visión con las reglas ya existentes de `Board`/`LevelActionService`.
 */
export class CubeBoard {
  private readonly boardsByFace: Map<Face, Board>;

  /** Crea el cubo a partir de un tablero por cada una de las 6 caras. */
  constructor(boardsByFace: Map<Face, Board>) {
    for (const face of ALL_FACES) {
      if (!boardsByFace.has(face)) {
        throw new Error(`CubeBoard is missing face "${face}"`);
      }
    }
    this.boardsByFace = boardsByFace;
  }

  /** Devuelve el tablero jugable de la cara indicada. */
  public getBoard(face: Face): Board {
    const board = this.boardsByFace.get(face);
    if (!board) {
      throw new Error(`Unknown face "${face}"`);
    }
    return board;
  }

  /** El cubo está resuelto cuando las 6 caras lo están (sin flechas restantes). */
  public isSolved(): boolean {
    return ALL_FACES.every(face => this.getBoard(face).isSolved());
  }
}

import { Direction } from './Direction';

/** Incremento de fila y columna asociado a una dirección. */
export interface StepVector {
  rowStep: number;
  colStep: number;
}

/** Traduce una Direction al desplazamiento en la matriz del tablero. */
export function getStep(direction: Direction): StepVector {
  switch (direction) {
    case Direction.UP: return { rowStep: -1, colStep: 0 };
    case Direction.DOWN: return { rowStep: 1, colStep: 0 };
    case Direction.LEFT: return { rowStep: 0, colStep: -1 };
    case Direction.RIGHT: return { rowStep: 0, colStep: 1 };
    default: throw new Error(`Unknown direction: ${direction}`);
  }
}

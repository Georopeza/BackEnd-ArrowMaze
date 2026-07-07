import { Direction } from './Direction';

// Vector de desplazamiento (fila, columna) asociado a una dirección.
export interface StepVector {
  rowStep: number;
  colStep: number;
}

// Traduce una Direction al incremento de coordenadas que representa en la matriz.
// Único punto de verdad para esta conversión: antes estaba duplicada en
// LevelActionService y LevelSolvabilityValidator.
export function getStep(direction: Direction): StepVector {
  switch (direction) {
    case Direction.UP: return { rowStep: -1, colStep: 0 };
    case Direction.DOWN: return { rowStep: 1, colStep: 0 };
    case Direction.LEFT: return { rowStep: 0, colStep: -1 };
    case Direction.RIGHT: return { rowStep: 0, colStep: 1 };
    default: throw new Error(`Unknown direction: ${direction}`);
  }
}

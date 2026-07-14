/** Cara del cubo. Cada cara es un tablero 2D independiente y cerrado. */
export enum Face {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  FRONT = 'FRONT',
  BACK = 'BACK',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

/** Las 6 caras del cubo, en un orden estable para iterar/validar. */
export const ALL_FACES: readonly Face[] = [
  Face.TOP,
  Face.BOTTOM,
  Face.FRONT,
  Face.BACK,
  Face.LEFT,
  Face.RIGHT,
];

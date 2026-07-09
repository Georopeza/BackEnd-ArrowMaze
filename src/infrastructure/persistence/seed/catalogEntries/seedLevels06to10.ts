import { StructuredLevelJsonDto } from '../../../../../docs/contract/level.contract';

/**
 * Niveles intermedios del catálogo seed (6–10).
 *
 * Introducen tableros verticales, disparos en paralelo y desbloqueo en cadena
 * (una flecha debe salir antes de que otra tenga vía libre).
 */
export const SEED_LEVELS_06_TO_10: StructuredLevelJsonDto[] = [
  {
    id: 'level-06',
    levelNumber: 6,
    difficulty: 'EASY',
    maxMoves: 5,
    maxTimeInSeconds: 90,
    width: 1,
    height: 3,
    exit: { row: 2, col: 0 },
    arrows: [{ id: 'e1', direction: 'DOWN', head: { row: 0, col: 0 }, body: [] }],
  },
  {
    id: 'level-07',
    levelNumber: 7,
    difficulty: 'EASY',
    maxMoves: 5,
    maxTimeInSeconds: 90,
    width: 4,
    height: 1,
    exit: { row: 0, col: 3 },
    arrows: [{ id: 'e2', direction: 'RIGHT', head: { row: 0, col: 0 }, body: [] }],
  },
  {
    id: 'level-08',
    levelNumber: 8,
    difficulty: 'EASY',
    maxMoves: 6,
    maxTimeInSeconds: 90,
    width: 5,
    height: 1,
    exit: { row: 0, col: 4 },
    arrows: [
      { id: 'e3', direction: 'LEFT', head: { row: 0, col: 1 }, body: [] },
      { id: 'e4', direction: 'RIGHT', head: { row: 0, col: 3 }, body: [] },
    ],
  },
  {
    id: 'level-09',
    levelNumber: 9,
    difficulty: 'MEDIUM',
    maxMoves: 12,
    maxTimeInSeconds: 120,
    width: 4,
    height: 3,
    exit: { row: 2, col: 2 },
    arrows: [
      {
        id: 'f-chain-a',
        direction: 'DOWN',
        head: { row: 0, col: 2 },
        body: [{ row: 0, col: 1 }],
      },
      {
        id: 'f-chain-b',
        direction: 'RIGHT',
        head: { row: 1, col: 3 },
        body: [
          { row: 1, col: 2 },
          { row: 1, col: 1 },
        ],
      },
    ],
  },
  {
    id: 'level-10',
    levelNumber: 10,
    difficulty: 'MEDIUM',
    maxMoves: 10,
    maxTimeInSeconds: 120,
    width: 4,
    height: 4,
    exit: { row: 0, col: 3 },
    arrows: [
      { id: 'g1', direction: 'UP', head: { row: 3, col: 1 }, body: [] },
      { id: 'g2', direction: 'RIGHT', head: { row: 1, col: 0 }, body: [] },
      { id: 'g3', direction: 'DOWN', head: { row: 0, col: 2 }, body: [] },
    ],
  },
];

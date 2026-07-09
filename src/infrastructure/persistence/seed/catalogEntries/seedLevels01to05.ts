import { StructuredLevelJsonDto } from '../../../../../docs/contract/level.contract';

/**
 * Niveles introductorios del catálogo seed (1–5).
 *
 * Incluye el nivel canónico `simple-1` (layout multi-celda compartido con el
 * frontend en `docs/levels/simple-1.json`) y puzzles cortos para tutorial.
 */
export const SEED_LEVELS_01_TO_05: StructuredLevelJsonDto[] = [
  {
    id: 'simple-1',
    levelNumber: 1,
    difficulty: 'EASY',
    maxMoves: 20,
    maxTimeInSeconds: 120,
    width: 5,
    height: 5,
    exit: { row: 0, col: 4 },
    arrows: [
      { id: 'f1', direction: 'LEFT', head: { row: 0, col: 0 }, body: [{ row: 0, col: 1 }] },
      { id: 'f2', direction: 'RIGHT', head: { row: 1, col: 1 }, body: [{ row: 1, col: 0 }] },
      { id: 'f3', direction: 'DOWN', head: { row: 1, col: 2 }, body: [{ row: 0, col: 2 }] },
      { id: 'f4', direction: 'RIGHT', head: { row: 0, col: 3 }, body: [] },
      {
        id: 'f5',
        direction: 'UP',
        head: { row: 1, col: 3 },
        body: [
          { row: 2, col: 3 },
          { row: 2, col: 2 },
        ],
      },
      {
        id: 'f6',
        direction: 'UP',
        head: { row: 2, col: 1 },
        body: [
          { row: 3, col: 1 },
          { row: 4, col: 1 },
          { row: 4, col: 0 },
          { row: 3, col: 0 },
          { row: 2, col: 0 },
        ],
      },
      {
        id: 'f7',
        direction: 'DOWN',
        head: { row: 4, col: 2 },
        body: [
          { row: 3, col: 2 },
          { row: 3, col: 3 },
          { row: 3, col: 4 },
          { row: 2, col: 4 },
          { row: 1, col: 4 },
        ],
      },
      { id: 'f8', direction: 'LEFT', head: { row: 4, col: 4 }, body: [{ row: 4, col: 3 }] },
    ],
  },
  {
    id: 'level-02',
    levelNumber: 2,
    difficulty: 'EASY',
    maxMoves: 5,
    maxTimeInSeconds: 90,
    width: 2,
    height: 1,
    exit: { row: 0, col: 1 },
    arrows: [{ id: 'a1', direction: 'RIGHT', head: { row: 0, col: 0 }, body: [] }],
  },
  {
    id: 'level-03',
    levelNumber: 3,
    difficulty: 'MEDIUM',
    maxMoves: 8,
    maxTimeInSeconds: 90,
    width: 3,
    height: 3,
    exit: { row: 0, col: 2 },
    arrows: [
      { id: 'b1', direction: 'RIGHT', head: { row: 0, col: 0 }, body: [] },
      { id: 'b2', direction: 'DOWN', head: { row: 1, col: 1 }, body: [] },
    ],
  },
  {
    id: 'level-04',
    levelNumber: 4,
    difficulty: 'MEDIUM',
    maxMoves: 10,
    maxTimeInSeconds: 120,
    width: 3,
    height: 3,
    exit: { row: 2, col: 2 },
    walls: [{ row: 1, col: 0 }],
    arrows: [
      { id: 'c1', direction: 'RIGHT', head: { row: 0, col: 0 }, body: [] },
      { id: 'c2', direction: 'UP', head: { row: 2, col: 1 }, body: [] },
    ],
  },
  {
    id: 'level-05',
    levelNumber: 5,
    difficulty: 'HARD',
    maxMoves: 6,
    maxTimeInSeconds: 120,
    width: 2,
    height: 1,
    exit: { row: 0, col: 1 },
    arrows: [{ id: 'd1', direction: 'RIGHT', head: { row: 0, col: 0 }, body: [] }],
  },
];

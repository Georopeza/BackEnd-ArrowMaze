import { StructuredLevelJsonDto } from '../../../../../docs/contract/level.contract';

/**
 * Niveles avanzados del catálogo seed (11–15).
 *
 * Combinan muros estáticos, cuerpos multi-celda y más flechas simultáneas
 * para cubrir dificultad HARD/EXPERT del plan de entrega (15 niveles).
 */
export const SEED_LEVELS_11_TO_15: StructuredLevelJsonDto[] = [
  {
    id: 'level-11',
    levelNumber: 11,
    difficulty: 'MEDIUM',
    maxMoves: 12,
    maxTimeInSeconds: 120,
    width: 4,
    height: 4,
    exit: { row: 3, col: 3 },
    walls: [{ row: 2, col: 1 }],
    arrows: [
      { id: 'h1', direction: 'RIGHT', head: { row: 0, col: 0 }, body: [] },
      { id: 'h2', direction: 'UP', head: { row: 3, col: 2 }, body: [] },
    ],
  },
  {
    id: 'level-12',
    levelNumber: 12,
    difficulty: 'HARD',
    maxMoves: 8,
    maxTimeInSeconds: 120,
    width: 4,
    height: 1,
    exit: { row: 0, col: 0 },
    arrows: [
      {
        id: 'h3',
        direction: 'LEFT',
        head: { row: 0, col: 3 },
        body: [
          { row: 0, col: 2 },
          { row: 0, col: 1 },
        ],
      },
    ],
  },
  {
    id: 'level-13',
    levelNumber: 13,
    difficulty: 'HARD',
    maxMoves: 15,
    maxTimeInSeconds: 150,
    width: 3,
    height: 3,
    exit: { row: 2, col: 2 },
    arrows: [
      { id: 'i1', direction: 'DOWN', head: { row: 0, col: 0 }, body: [] },
      { id: 'i2', direction: 'DOWN', head: { row: 0, col: 2 }, body: [] },
      { id: 'i3', direction: 'RIGHT', head: { row: 2, col: 0 }, body: [] },
    ],
  },
  {
    id: 'level-14',
    levelNumber: 14,
    difficulty: 'HARD',
    maxMoves: 14,
    maxTimeInSeconds: 150,
    width: 5,
    height: 5,
    exit: { row: 4, col: 4 },
    walls: [
      { row: 2, col: 2 },
      { row: 1, col: 2 },
    ],
    arrows: [
      { id: 'j1', direction: 'RIGHT', head: { row: 0, col: 0 }, body: [] },
      { id: 'j2', direction: 'DOWN', head: { row: 4, col: 0 }, body: [] },
      { id: 'j3', direction: 'UP', head: { row: 4, col: 4 }, body: [] },
    ],
  },
  {
    id: 'level-15',
    levelNumber: 15,
    difficulty: 'EXPERT',
    maxMoves: 20,
    maxTimeInSeconds: 180,
    width: 6,
    height: 6,
    exit: { row: 0, col: 5 },
    arrows: [
      {
        id: 'k-trapped',
        direction: 'DOWN',
        head: { row: 1, col: 2 },
        body: [{ row: 0, col: 2 }],
      },
      {
        id: 'k-free',
        direction: 'RIGHT',
        head: { row: 3, col: 4 },
        body: [
          { row: 3, col: 3 },
          { row: 3, col: 2 },
          { row: 3, col: 1 },
        ],
      },
      { id: 'k-top', direction: 'RIGHT', head: { row: 0, col: 3 }, body: [] },
    ],
  },
];

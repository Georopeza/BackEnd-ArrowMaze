import { LevelJsonMapper } from '../../../src/infrastructure/mappers/LevelJsonMapper';
import { Difficulty } from '../../../src/domain/entities/LevelDefinition';
import { ArrowCell } from '../../../src/domain/entities/ArrowCell';
import { ExitCell } from '../../../src/domain/entities/ExitCell';
import { BoardGroup } from '../../../src/domain/entities/BoardGroup';
import { Direction } from '../../../src/domain/value-objects/Direction';
import { StructuredLevelJsonDto } from '../../../docs/contract/level.contract';

/**
 * Nivel de ejemplo "simple-1" compartido por el equipo. Nota: el width/
 * height originales (4) eran incorrectos para las posiciones de las
 * flechas (llegan hasta row/col 4); se corrigió a 5x5, y se agregó
 * `exit` en la única celda que queda libre del tablero (0,4).
 */
const simpleLevel: StructuredLevelJsonDto = {
  id: 'simple-1',
  levelNumber: 1,
  difficulty: 'EASY',
  maxMoves: 5,
  maxTimeInSeconds: 60,
  width: 5,
  height: 5,
  exit: { row: 0, col: 4 },
  arrows: [
    { id: 'f1', direction: 'LEFT', head: { row: 0, col: 0 }, body: [{ row: 0, col: 1 }] },
    { id: 'f2', direction: 'RIGHT', head: { row: 1, col: 1 }, body: [{ row: 1, col: 0 }] },
    { id: 'f3', direction: 'DOWN', head: { row: 1, col: 2 }, body: [{ row: 0, col: 2 }] },
    { id: 'f4', direction: 'RIGHT', head: { row: 0, col: 3 }, body: [{ row: 0, col: 3 }] },
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
};

describe('LevelJsonMapper', () => {
  const mapper = new LevelJsonMapper();

  it('mapea los metadatos básicos del nivel', () => {
    // Act
    const level = mapper.toLevelDefinition(simpleLevel);

    // Assert
    expect(level.id).toBe('simple-1');
    expect(level.levelNumber).toBe(1);
    expect(level.difficulty).toBe(Difficulty.EASY);
    expect(level.maxMoves).toBe(5);
    expect(level.maxTimeInSeconds).toBe(60);
    expect(level.board).toHaveLength(5);
    expect(level.board[0]).toHaveLength(5);
  });

  it('coloca la salida (exit) en la celda indicada por el DTO', () => {
    // Act
    const level = mapper.toLevelDefinition(simpleLevel);

    // Assert
    expect(level.board[0][4]).toBeInstanceOf(ExitCell);
  });

  it('agrupa cabeza y cuerpo de cada flecha en un mismo BoardGroup (Composite)', () => {
    // Act
    const level = mapper.toLevelDefinition(simpleLevel);

    // Assert: la celda cabeza (0,0) y su celda de cuerpo (0,1) de f1
    // deben ser el mismo BoardGroup.
    const headCell = level.board[0][0];
    const bodyCell = level.board[0][1];
    expect(headCell).toBeInstanceOf(BoardGroup);
    expect(headCell).toBe(bodyCell);

    const components = (headCell as BoardGroup).getComponents();
    expect(components[0]).toBeInstanceOf(ArrowCell);
    expect((components[0] as ArrowCell).direction).toBe(Direction.LEFT);
    // Cabeza + 1 celda de cuerpo = 2 componentes.
    expect(components).toHaveLength(2);
  });
});

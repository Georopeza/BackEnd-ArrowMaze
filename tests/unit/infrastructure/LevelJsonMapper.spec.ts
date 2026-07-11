import { LevelJsonMapper } from '../../../src/infrastructure/mappers/LevelJsonMapper';
import { Difficulty } from '../../../src/domain/entities/LevelDefinition';
import { ArrowCell } from '../../../src/domain/entities/ArrowCell';
import { ArrowBodyCell } from '../../../src/domain/entities/ArrowBodyCell';
import { ExitCell } from '../../../src/domain/entities/ExitCell';
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
};

describe('LevelJsonMapper', () => {
  const mapper = new LevelJsonMapper();

  it('should_map_basic_level_metadata', () => {
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

  it('should_place_exit_cell_at_dto_coordinates', () => {
    // Act
    const level = mapper.toLevelDefinition(simpleLevel);

    // Assert
    expect(level.board[0][4]).toBeInstanceOf(ExitCell);
  });

  it('should_link_arrow_head_and_body_cells_via_shared_arrowId', () => {
    // Act
    const level = mapper.toLevelDefinition(simpleLevel);

    // Assert: la celda cabeza (0,0) de f1 es una ArrowCell con dirección LEFT,
    // y su celda de cuerpo (0,1) es una ArrowBodyCell que referencia el mismo arrowId.
    const headCell = level.board[0][0];
    const bodyCell = level.board[0][1];

    expect(headCell).toBeInstanceOf(ArrowCell);
    expect((headCell as ArrowCell).direction).toBe(Direction.LEFT);
    expect((headCell as ArrowCell).arrowId).toBe('f1');

    expect(bodyCell).toBeInstanceOf(ArrowBodyCell);
    expect((bodyCell as ArrowBodyCell).arrowId).toBe('f1');
  });

  it('should_preserve_display_name_in_round_trip', () => {
    const dtoWithName: StructuredLevelJsonDto = {
      ...simpleLevel,
      name: 'Simple One',
    };

    const level = mapper.toLevelDefinition(dtoWithName);
    const roundTripped = mapper.toDto(level);

    expect(level.name).toBe('Simple One');
    expect(roundTripped.name).toBe('Simple One');
  });

  it('should_round_trip_dto_via_toLevelDefinition_and_toDto', () => {
    // Act
    const level = mapper.toLevelDefinition(simpleLevel);
    const dto = mapper.toDto(level);

    // Assert
    expect(dto.id).toBe(simpleLevel.id);
    expect(dto.width).toBe(simpleLevel.width);
    expect(dto.height).toBe(simpleLevel.height);
    expect(dto.exit).toEqual(simpleLevel.exit);
    expect(dto.arrows).toHaveLength(simpleLevel.arrows.length);

    const f1 = dto.arrows.find(arrow => arrow.id === 'f1');
    expect(f1).toEqual(simpleLevel.arrows.find(arrow => arrow.id === 'f1'));
  });
});

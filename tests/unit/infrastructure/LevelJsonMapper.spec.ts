import fs from 'fs';
import path from 'path';
import { LevelJsonMapper } from '../../../src/infrastructure/mappers/LevelJsonMapper';
import { Difficulty } from '../../../src/domain/entities/LevelDefinition';
import { ArrowCell } from '../../../src/domain/entities/ArrowCell';
import { ArrowBodyCell } from '../../../src/domain/entities/ArrowBodyCell';
import { ExitCell } from '../../../src/domain/entities/ExitCell';
import { Direction } from '../../../src/domain/value-objects/Direction';
import { StructuredLevelJsonDto } from '../../../docs/contract/level.contract';

/**
 * Prueba de contrato: `simple-1.json` es el fixture compartido con el
 * repo frontend (`Arrow-Maze-Escape-Puzzle/docs/levels/simple-1.json`),
 * copia bit-a-bit (ver `docs/levels/README.md`). Leerlo desde disco en vez
 * de embeber un literal asegura que este mapper se pruebe contra la MISMA
 * forma de JSON que el frontend espera del contrato compartido
 * (`docs/contract/level.contract.ts` ↔ `lib/contract/level_contract.dart`):
 * un cambio incompatible en cualquiera de los dos lados (renombrar un
 * campo, invalidar una flecha por el mínimo de 1 celda de cuerpo, etc.)
 * hace fallar este test.
 */
const simpleLevelPath = path.join(__dirname, '../../../docs/levels/simple-1.json');
const simpleLevel: StructuredLevelJsonDto = JSON.parse(fs.readFileSync(simpleLevelPath, 'utf-8'));

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
    expect(level.board).toHaveLength(6);
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

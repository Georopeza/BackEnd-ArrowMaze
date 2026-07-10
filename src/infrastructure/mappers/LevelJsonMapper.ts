import { LevelBuilder } from '../../domain/builders/LevelBuilder';
import { CellFactory } from '../../domain/factories/CellFactory';
import { ArrowCell } from '../../domain/entities/ArrowCell';
import { ArrowBodyCell } from '../../domain/entities/ArrowBodyCell';
import { ExitCell } from '../../domain/entities/ExitCell';
import { WallCell } from '../../domain/entities/WallCell';
import { Difficulty, LevelDefinition } from '../../domain/entities/LevelDefinition';
import { Direction } from '../../domain/value-objects/Direction';
import {
  ArrowDirectionDto,
  CellPositionDto,
  LevelDifficultyDto,
  StructuredArrowJsonDto,
  StructuredLevelJsonDto,
} from '../../../docs/contract/level.contract';

/**
 * Traduce el contrato compartido `StructuredLevelJsonDto` (wire format
 * acordado con el frontend) al agregado de dominio `LevelDefinition` y
 * viceversa, reutilizando el `LevelBuilder`/`CellFactory` ya existentes.
 *
 * Vive en infraestructura (no en dominio) porque conoce la forma exacta
 * del JSON de transporte; el dominio no debe saber que ese formato existe.
 */
export class LevelJsonMapper {
  private readonly cellFactory: CellFactory;

  /**
   * Construye el mapper con una `CellFactory` inyectable (por defecto
   * crea una nueva instancia).
   */
  constructor(cellFactory: CellFactory = new CellFactory()) {
    this.cellFactory = cellFactory;
  }

  /**
   * Construye un `LevelDefinition` completo a partir del DTO recibido.
   *
   * Orden de aplicación sobre el tablero: primero se rellenan todas las
   * celdas como vacías, luego se sobrescriben los muros, luego la salida,
   * y por último las flechas (cada una como una `ArrowCell` cabeza más sus
   * `ArrowBodyCell` de cuerpo, vinculadas por `arrowId` vía `LevelBuilder.addArrow`).
   */
  public toLevelDefinition(dto: StructuredLevelJsonDto): LevelDefinition {
    const builder = new LevelBuilder()
      .withId(dto.id)
      .withLevelNumber(dto.levelNumber)
      .withDifficulty(dto.difficulty as Difficulty)
      .withDimensions(dto.height, dto.width)
      .withConstraints(dto.maxMoves, dto.maxTimeInSeconds);

    for (let row = 0; row < dto.height; row++) {
      for (let col = 0; col < dto.width; col++) {
        builder.addCell(row, col, this.cellFactory.createCell('EmptyCell'));
      }
    }

    for (const wall of dto.walls ?? []) {
      builder.addCell(wall.row, wall.col, this.cellFactory.createCell('WallCell'));
    }

    for (const arrow of dto.arrows) {
      builder.addArrow(arrow.head.row, arrow.head.col, arrow.direction as Direction, arrow.id, arrow.body ?? []);
    }

    // La salida se aplica al final para que cabezas/cuerpos de flecha no la sobrescriban.
    builder.addCell(dto.exit.row, dto.exit.col, this.cellFactory.createCell('ExitCell'));

    return builder.build();
  }

  /**
   * Reconstruye el DTO de transporte a partir de un `LevelDefinition` ya
   * persistido, recorriendo su matriz `board: Cell[][]` una sola vez.
   */
  public toDto(level: LevelDefinition): StructuredLevelJsonDto {
    const height = level.board.length;
    const width = level.board[0]?.length ?? 0;

    let exit: CellPositionDto | undefined;
    const walls: CellPositionDto[] = [];
    const arrowHeads = new Map<string, StructuredArrowJsonDto>();
    const arrowBodies = new Map<string, CellPositionDto[]>();

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const cell = level.board[row][col];

        if (cell instanceof ExitCell) {
          exit = { row, col };
        } else if (cell instanceof WallCell) {
          walls.push({ row, col });
        } else if (cell instanceof ArrowCell) {
          arrowHeads.set(cell.arrowId, {
            id: cell.arrowId,
            direction: cell.direction as ArrowDirectionDto,
            head: { row, col },
            body: [],
          });
        } else if (cell instanceof ArrowBodyCell) {
          const bodyPositions = arrowBodies.get(cell.arrowId) ?? [];
          bodyPositions.push({ row, col });
          arrowBodies.set(cell.arrowId, bodyPositions);
        }
      }
    }

    if (!exit) {
      throw new Error('LevelDefinition has no ExitCell, cannot be mapped to a wire DTO');
    }

    const arrows = [...arrowHeads.values()].map(arrow => ({
      ...arrow,
      body: arrowBodies.get(arrow.id) ?? [],
    }));

    return {
      id: level.id,
      levelNumber: level.levelNumber,
      difficulty: level.difficulty as LevelDifficultyDto,
      maxMoves: level.maxMoves,
      maxTimeInSeconds: level.maxTimeInSeconds,
      width,
      height,
      exit,
      walls: walls.length > 0 ? walls : undefined,
      arrows,
      // Cada disparo exitoso retira exactamente una flecha; ganar exige
      // retirarlas todas, así que el óptimo es siempre `arrows.length`.
      optimalMoves: arrows.length,
    };
  }
}

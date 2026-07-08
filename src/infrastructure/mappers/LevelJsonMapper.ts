import { LevelBuilder } from '../../domain/builders/LevelBuilder';
import { CellFactory } from '../../domain/factories/CellFactory';
import { EmptyCell } from '../../domain/entities/EmptyCell';
import { BoardGroup } from '../../domain/entities/BoardGroup';
import { Difficulty, LevelDefinition } from '../../domain/entities/LevelDefinition';
import { StructuredLevelJsonDto } from '../../../docs/contract/level.contract';

/**
 * Traduce el contrato compartido `StructuredLevelJsonDto` (wire format
 * acordado con el frontend) al agregado de dominio `LevelDefinition`,
 * reutilizando el `LevelBuilder` y la `CellFactory` ya existentes.
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
   * y por último las flechas (cada una como un `BoardGroup` que agrupa su
   * celda "cabeza" y sus celdas de "cuerpo", aplicando el patrón
   * Composite ya usado en el dominio).
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

    builder.addCell(dto.exit.row, dto.exit.col, this.cellFactory.createCell('ExitCell'));

    for (const arrow of dto.arrows) {
      const headCell = this.cellFactory.createCell('ArrowCell', {
        direction: arrow.direction,
      });
      const group = new BoardGroup([headCell]);

      const bodyPositions = arrow.body ?? [];
      for (let i = 0; i < bodyPositions.length; i++) {
        group.add(new EmptyCell());
      }

      builder.addCell(arrow.head.row, arrow.head.col, group);
      for (const bodyPosition of bodyPositions) {
        builder.addCell(bodyPosition.row, bodyPosition.col, group);
      }
    }

    return builder.build();
  }
}

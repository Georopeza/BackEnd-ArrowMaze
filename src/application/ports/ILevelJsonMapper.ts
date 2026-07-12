import { LevelDefinition } from '../../domain/entities/LevelDefinition';
import { StructuredLevelJsonDto } from '../../../docs/contract/level.contract';

/**
 * Puerto de la Capa 2 (Casos de Uso) para traducir entre el contrato
 * compartido con el frontend (`StructuredLevelJsonDto`) y el agregado de
 * dominio `LevelDefinition`.
 *
 * La implementación concreta (`LevelJsonMapper`, que conoce la forma exacta
 * del JSON de transporte y usa `LevelBuilder`/`CellFactory`) vive en
 * infraestructura; los casos de uso solo dependen de esta interfaz.
 */
export interface ILevelJsonMapper {
  /** Construye un `LevelDefinition` completo a partir del DTO recibido. */
  toLevelDefinition(dto: StructuredLevelJsonDto): LevelDefinition;

  /** Traduce un `LevelDefinition` de vuelta al formato de transporte. */
  toDto(level: LevelDefinition): StructuredLevelJsonDto;
}

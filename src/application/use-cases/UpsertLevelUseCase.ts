import { ILevelRepository } from '../../domain/repositories/ILevelRepository';
import { LevelJsonMapper } from '../../infrastructure/mappers/LevelJsonMapper';
import {
  ArrowPiece,
  LevelSolvabilityValidator,
  StructuredLevelJsonDto as SolvabilityLevelDto,
} from '../../domain/services/LevelSolvabilityValidator';
import { Direction } from '../../domain/value-objects/Direction';
import { StructuredLevelJsonDto } from '../../../docs/contract/level.contract';
import { LevelNotSolvableError } from '../errors';
import { validateArrowBodyLengths } from '../../domain/validators/arrowPlacementValidator';

/**
 * Caso de uso: crear o actualizar la definición de un nivel.
 *
 * Antes de persistir, valida que el nivel sea resoluble usando el servicio
 * de dominio `LevelSolvabilityValidator` ya existente. Ese validador define
 * su propio DTO local (`SolvabilityLevelDto`/`ArrowPiece`), estructuralmente
 * distinto del contrato de transporte `StructuredLevelJsonDto` (sin `exit`,
 * `body` no opcional, `direction` tipado como el enum de dominio en vez de
 * un string literal) — `toSolvabilityDto` adapta uno al otro.
 */
export class UpsertLevelUseCase {
  private readonly solvabilityValidator = new LevelSolvabilityValidator();

  constructor(
    private readonly levelRepository: ILevelRepository,
    private readonly levelJsonMapper: LevelJsonMapper,
  ) {}

  /**
   * Crea o actualiza un nivel tras validar que sea resoluble.
   *
   * @param dto Definición completa del nivel en formato wire.
   * @returns DTO persistido (refleja el estado guardado en el repositorio).
   * @throws LevelNotSolvableError si el tablero no admite una solución válida.
   */
  public async execute(dto: StructuredLevelJsonDto): Promise<StructuredLevelJsonDto> {
    validateArrowBodyLengths(dto);

    if (!this.solvabilityValidator.isPlayable(this.toSolvabilityDto(dto))) {
      throw new LevelNotSolvableError(dto.id);
    }

    const level = this.levelJsonMapper.toLevelDefinition(dto);
    const existing = await this.levelRepository.findById(dto.id);

    if (existing) {
      await this.levelRepository.update(level);
    } else {
      await this.levelRepository.save(level);
    }

    return this.levelJsonMapper.toDto(level);
  }

  private toSolvabilityDto(dto: StructuredLevelJsonDto): SolvabilityLevelDto {
    const arrows: ArrowPiece[] = dto.arrows.map(arrow => ({
      id: arrow.id,
      direction: arrow.direction as Direction,
      head: arrow.head,
      body: arrow.body ?? [],
    }));

    return {
      id: dto.id,
      levelNumber: dto.levelNumber,
      difficulty: dto.difficulty,
      maxMoves: dto.maxMoves,
      maxTimeInSeconds: dto.maxTimeInSeconds,
      width: dto.width,
      height: dto.height,
      arrows,
      walls: dto.walls,
    };
  }
}

import { ILevelRepository } from '../../domain/repositories/ILevelRepository';
import { ILevelJsonMapper } from '../ports/ILevelJsonMapper';
import { StructuredLevelJsonDto } from '../../../docs/contract/level.contract';
import { LevelNotFoundError } from '../errors';

/** Caso de uso: obtener un nivel por id, en el formato de transporte acordado con el frontend. */
export class GetLevelUseCase {
  constructor(
    private readonly levelRepository: ILevelRepository,
    private readonly levelJsonMapper: ILevelJsonMapper,
  ) {}

  /**
   * Obtiene un nivel por identificador en formato de transporte.
   *
   * @param levelId Identificador único del nivel solicitado.
   * @returns DTO del nivel encontrado.
   * @throws LevelNotFoundError si no existe un nivel con ese id.
   */
  public async execute(levelId: string): Promise<StructuredLevelJsonDto> {
    const level = await this.levelRepository.findById(levelId);
    if (!level) {
      throw new LevelNotFoundError(levelId);
    }
    return this.levelJsonMapper.toDto(level);
  }
}

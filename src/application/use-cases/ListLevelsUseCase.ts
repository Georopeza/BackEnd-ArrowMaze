import { ILevelRepository } from '../../domain/repositories/ILevelRepository';
import { LevelJsonMapper } from '../../infrastructure/mappers/LevelJsonMapper';
import { StructuredLevelJsonDto } from '../../../docs/contract/level.contract';

/** Caso de uso: listar todos los niveles disponibles, en el formato de transporte acordado con el frontend. */
export class ListLevelsUseCase {
  constructor(
    private readonly levelRepository: ILevelRepository,
    private readonly levelJsonMapper: LevelJsonMapper,
  ) {}

  /**
   * Devuelve el catálogo completo de niveles en formato de transporte.
   *
   * @returns Lista de `StructuredLevelJsonDto` listos para serializar en JSON.
   */
  public async execute(): Promise<StructuredLevelJsonDto[]> {
    const levels = await this.levelRepository.listAll();
    return levels.map(level => this.levelJsonMapper.toDto(level));
  }
}

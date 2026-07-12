import { ICollectibleRepository } from '../../domain/repositories/ICollectibleRepository';
import { CollectiblesSyncResultDto } from '../dto/ProgressDtos';

/**
 * Caso de uso: fusionar coleccionables desbloqueados en el servidor.
 */
export class SyncCollectiblesUseCase {
  constructor(private readonly collectibleRepository: ICollectibleRepository) {}

  /**
   * Persiste la unión de [collectibleIds] con los ya almacenados para [userId].
   */
  public async execute(userId: string, collectibleIds: string[]): Promise<CollectiblesSyncResultDto> {
    const collectibles = await this.collectibleRepository.mergeForUser(userId, collectibleIds);
    return { userId, collectibles };
  }
}

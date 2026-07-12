/** Puerto de persistencia para coleccionables desbloqueados por usuario. */
export interface ICollectibleRepository {
  /** Lista los identificadores de coleccionables desbloqueados por [userId]. */
  findAllByUser(userId: string): Promise<string[]>;

  /** Fusiona [collectibleIds] con los ya guardados para [userId]. */
  mergeForUser(userId: string, collectibleIds: string[]): Promise<string[]>;
}

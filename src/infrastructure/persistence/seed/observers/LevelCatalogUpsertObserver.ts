import { AppContainer } from '../../../http/container';
import { ILevelCatalogObserver } from './ILevelCatalogObserver';
import { upsertLevelFromFile } from '../syncLevelCatalogFromDirectory';

/**
 * Observador que persiste en SQLite cada archivo de nivel modificado.
 *
 * Conecta el sujeto (eventos del filesystem) con [UpsertLevelUseCase].
 */
export class LevelCatalogUpsertObserver implements ILevelCatalogObserver {
  constructor(private readonly container: AppContainer) {}

  public async onLevelFileChanged(filePath: string): Promise<void> {
    await upsertLevelFromFile(this.container, filePath);
  }
}

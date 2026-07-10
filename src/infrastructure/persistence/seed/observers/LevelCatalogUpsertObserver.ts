import { AppContainer } from '../../../http/container';
import { ILevelCatalogObserver } from './ILevelCatalogObserver';
import { upsertLevelFromFile } from '../syncLevelCatalogFromDirectory';

/**
 * Observador que persiste en SQLite cada archivo de nivel modificado.
 *
 * Conecta el sujeto (eventos del filesystem) con [UpsertLevelUseCase].
 */
export class LevelCatalogUpsertObserver implements ILevelCatalogObserver {
  /**
   * @param container Composition root con acceso a [UpsertLevelUseCase].
   */
  constructor(private readonly container: AppContainer) {}

  /**
   * Parsea el archivo modificado y lo persiste vía upsert en SQLite.
   *
   * @param filePath Ruta absoluta al `.json` notificado por el sujeto.
   */
  public async onLevelFileChanged(filePath: string): Promise<void> {
    await upsertLevelFromFile(this.container, filePath);
  }
}

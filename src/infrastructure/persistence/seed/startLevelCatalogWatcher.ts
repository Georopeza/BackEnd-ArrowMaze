import { AppContainer } from '../../http/container';
import { DEFAULT_LEVELS_DIRECTORY } from './loadLevelCatalogFromDirectory';
import { LevelCatalogFileSubject } from './observers/LevelCatalogFileSubject';
import { LevelCatalogUpsertObserver } from './observers/LevelCatalogUpsertObserver';

/**
 * Arranca el observador del catálogo: vigila `levels/*.json` y sincroniza SQLite al vuelo.
 *
 * @returns El sujeto activo (para detenerlo en tests o shutdown graceful).
 */
export function startLevelCatalogWatcher(
  container: AppContainer,
  levelsDir: string = DEFAULT_LEVELS_DIRECTORY,
): LevelCatalogFileSubject {
  const subject = new LevelCatalogFileSubject(levelsDir);
  subject.attach(new LevelCatalogUpsertObserver(container));
  subject.start();
  return subject;
}

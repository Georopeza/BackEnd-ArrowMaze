/**
 * Observador del catálogo de niveles (patrón Observer).
 *
 * Los sujetos (`LevelCatalogFileSubject`) notifican cambios en archivos
 * `levels/*.json` para que la infraestructura sincronice SQLite sin reiniciar.
 */
export interface ILevelCatalogObserver {
  /**
   * Se invoca cuando un archivo de nivel cambia en disco.
   *
   * @param filePath Ruta absoluta al `.json` afectado.
   */
  onLevelFileChanged(filePath: string): Promise<void>;
}

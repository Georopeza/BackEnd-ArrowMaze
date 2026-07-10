import fs from 'fs';
import path from 'path';

import { ILevelCatalogObserver } from './ILevelCatalogObserver';

/** Evento de filesystem relevante para el catálogo de niveles. */
export type LevelCatalogFileEventType = 'add' | 'change';

/**
 * Sujeto del patrón Observer: observa `levels/*.json` y notifica a los observadores.
 *
 * Usa `fs.watch` nativo con debounce para evitar dobles disparos al guardar archivos.
 */
export class LevelCatalogFileSubject {
  private watcher: fs.FSWatcher | null = null;
  private readonly pendingTimers = new Map<string, NodeJS.Timeout>();
  private readonly observers: ILevelCatalogObserver[] = [];

  /**
   * @param levelsDir Directorio vigilado (típicamente `levels/` en la raíz del repo).
   * @param debounceMs Retardo en ms para agrupar eventos duplicados del filesystem.
   */
  constructor(
    private readonly levelsDir: string,
    private readonly debounceMs = 300,
  ) {}

  /** Registra un observador que recibirá `onLevelFileChanged`. */
  public attach(observer: ILevelCatalogObserver): void {
    this.observers.push(observer);
  }

  /** Inicia la vigilancia del directorio; idempotente si ya estaba activa. */
  public start(): void {
    if (this.watcher) {
      return;
    }

    if (!fs.existsSync(this.levelsDir)) {
      throw new Error(`Level catalog directory not found: ${this.levelsDir}`);
    }

    this.watcher = fs.watch(this.levelsDir, (eventType, filename) => {
      if (!filename || !filename.endsWith('.json')) {
        return;
      }

      const normalizedEvent = eventType === 'rename' ? 'add' : 'change';
      this.scheduleNotify(normalizedEvent, path.join(this.levelsDir, filename));
    });
  }

  /** Detiene la vigilancia y cancela timers pendientes. */
  public stop(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }

    for (const timer of this.pendingTimers.values()) {
      clearTimeout(timer);
    }
    this.pendingTimers.clear();
  }

  private scheduleNotify(eventType: LevelCatalogFileEventType, filePath: string): void {
    const existing = this.pendingTimers.get(filePath);
    if (existing) {
      clearTimeout(existing);
    }

    const timer = setTimeout(() => {
      this.pendingTimers.delete(filePath);
      void this.notifyObservers(eventType, filePath);
    }, this.debounceMs);

    this.pendingTimers.set(filePath, timer);
  }

  private async notifyObservers(eventType: LevelCatalogFileEventType, filePath: string): Promise<void> {
    if (!fs.existsSync(filePath)) {
      // `rename` puede indicar borrado; no eliminamos niveles del repo en esta tarea.
      return;
    }

    for (const observer of this.observers) {
      try {
        await observer.onLevelFileChanged(filePath);
        // eslint-disable-next-line no-console
        console.log(`Level catalog ${eventType}: synced ${path.basename(filePath)}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        // eslint-disable-next-line no-console
        console.error(`Level catalog sync failed for ${filePath}: ${message}`);
      }
    }
  }
}

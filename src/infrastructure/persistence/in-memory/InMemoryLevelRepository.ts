import { ILevelRepository } from '../../../domain/repositories/ILevelRepository';
import { LevelDefinition } from '../../../domain/entities/LevelDefinition';

/**
 * Implementación en memoria de `ILevelRepository`.
 *
 * Sirve para desarrollar y probar los casos de uso sin depender todavía
 * de una base de datos real (esa decisión queda para un sprint
 * posterior); basta con que cumpla el contrato del puerto de dominio.
 */
export class InMemoryLevelRepository implements ILevelRepository {
  private readonly levelsById = new Map<string, LevelDefinition>();

  /** Busca un nivel por su identificador. */
  public async findById(id: string): Promise<LevelDefinition | null> {
    return this.levelsById.get(id) ?? null;
  }

  /** Busca un nivel por su número dentro de la progresión. */
  public async findByLevelNumber(levelNumber: number): Promise<LevelDefinition | null> {
    for (const level of this.levelsById.values()) {
      if (level.levelNumber === levelNumber) {
        return level;
      }
    }
    return null;
  }

  /** Lista todos los niveles registrados. */
  public async listAll(): Promise<LevelDefinition[]> {
    return [...this.levelsById.values()];
  }

  /** Guarda un nivel nuevo. */
  public async save(level: LevelDefinition): Promise<void> {
    this.levelsById.set(level.id, level);
  }

  /** Actualiza (sobrescribe) un nivel existente. */
  public async update(level: LevelDefinition): Promise<void> {
    this.levelsById.set(level.id, level);
  }
}

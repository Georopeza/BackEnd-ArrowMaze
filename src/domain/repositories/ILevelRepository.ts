import { LevelDefinition } from '../entities/LevelDefinition';

/** Puerto de persistencia para LevelDefinition. */
export interface ILevelRepository {
  /** Busca un nivel por identificador. */
  findById(id: string): Promise<LevelDefinition | null>;

  /** Busca un nivel por número ordinal. */
  findByLevelNumber(levelNumber: number): Promise<LevelDefinition | null>;

  /** Lista todos los niveles disponibles. */
  listAll(): Promise<LevelDefinition[]>;

  /** Guarda un nivel nuevo. */
  save(level: LevelDefinition): Promise<void>;

  /** Actualiza un nivel existente. */
  update(level: LevelDefinition): Promise<void>;
}

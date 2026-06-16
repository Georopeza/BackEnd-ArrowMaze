import { LevelDefinition } from '../entities/LevelDefinition';

// Puerto de repositorio puro para la entidad LevelDefinition.
// Mantiene el dominio independiente de la infraestructura.
export interface ILevelRepository {
  findById(id: string): Promise<LevelDefinition | null>;
  findByLevelNumber(levelNumber: number): Promise<LevelDefinition | null>;
  listAll(): Promise<LevelDefinition[]>;
  save(level: LevelDefinition): Promise<void>;
  update(level: LevelDefinition): Promise<void>;
}

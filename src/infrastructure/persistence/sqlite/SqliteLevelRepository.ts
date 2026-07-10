import Database from 'better-sqlite3';
import { ILevelRepository } from '../../../domain/repositories/ILevelRepository';
import { LevelDefinition } from '../../../domain/entities/LevelDefinition';
import { LevelJsonMapper } from '../../mappers/LevelJsonMapper';
import { StructuredLevelJsonDto } from '../../../../docs/contract/level.contract';

interface LevelRow {
  id: string;
  levelNumber: number;
  dto: string;
}

/**
 * Implementación de `ILevelRepository` respaldada por SQLite.
 *
 * El agregado `LevelDefinition` tiene un tablero (`Cell[][]`) demasiado rico
 * para modelar en columnas relacionales sin sobre-ingeniería; se persiste
 * como el JSON de transporte (`StructuredLevelJsonDto`, vía `LevelJsonMapper`,
 * ya existente para el mapeo API↔dominio) en una columna de texto, con
 * `id`/`levelNumber` como columnas indexadas para las consultas que el
 * repositorio realmente necesita (`findByLevelNumber`, orden de catálogo).
 */
export class SqliteLevelRepository implements ILevelRepository {
  constructor(
    private readonly db: Database.Database,
    private readonly mapper: LevelJsonMapper = new LevelJsonMapper(),
  ) {}

  public async findById(id: string): Promise<LevelDefinition | null> {
    const row = this.db.prepare('SELECT * FROM levels WHERE id = ?').get(id) as LevelRow | undefined;
    return row ? this.toDomain(row) : null;
  }

  public async findByLevelNumber(levelNumber: number): Promise<LevelDefinition | null> {
    const row = this.db.prepare('SELECT * FROM levels WHERE levelNumber = ?').get(levelNumber) as
      | LevelRow
      | undefined;
    return row ? this.toDomain(row) : null;
  }

  public async listAll(): Promise<LevelDefinition[]> {
    const rows = this.db.prepare('SELECT * FROM levels').all() as LevelRow[];
    return rows.map(row => this.toDomain(row));
  }

  public async save(level: LevelDefinition): Promise<void> {
    this.upsert(level);
  }

  public async update(level: LevelDefinition): Promise<void> {
    this.upsert(level);
  }

  private upsert(level: LevelDefinition): void {
    const dto = this.mapper.toDto(level);
    this.db
      .prepare(
        `INSERT INTO levels (id, levelNumber, dto)
         VALUES (@id, @levelNumber, @dto)
         ON CONFLICT(id) DO UPDATE SET
           levelNumber = excluded.levelNumber,
           dto = excluded.dto`,
      )
      .run({ id: level.id, levelNumber: level.levelNumber, dto: JSON.stringify(dto) });
  }

  private toDomain(row: LevelRow): LevelDefinition {
    const dto = JSON.parse(row.dto) as StructuredLevelJsonDto;
    return this.mapper.toLevelDefinition(dto);
  }
}

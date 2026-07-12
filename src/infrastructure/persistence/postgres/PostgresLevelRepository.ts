import { Pool } from 'pg';

import { ILevelRepository } from '../../../domain/repositories/ILevelRepository';
import { LevelDefinition } from '../../../domain/entities/LevelDefinition';
import { LevelJsonMapper } from '../../mappers/LevelJsonMapper';
import { StructuredLevelJsonDto } from '../../../../docs/contract/level.contract';

interface LevelRow {
  id: string;
  levelNumber: number;
  dto: string;
}

/** Implementación de [ILevelRepository] respaldada por PostgreSQL (Neon). */
export class PostgresLevelRepository implements ILevelRepository {
  /**
   * @param pool Pool de conexiones ya inicializado.
   * @param mapper Traductor wire↔dominio.
   */
  constructor(
    private readonly pool: Pool,
    private readonly mapper: LevelJsonMapper = new LevelJsonMapper(),
  ) {}

  /** @inheritdoc */
  public async findById(id: string): Promise<LevelDefinition | null> {
    const result = await this.pool.query<LevelRow>('SELECT * FROM levels WHERE id = $1', [id]);
    const row = result.rows[0];
    return row ? this.toDomain(row) : null;
  }

  /** @inheritdoc */
  public async findByLevelNumber(levelNumber: number): Promise<LevelDefinition | null> {
    const result = await this.pool.query<LevelRow>(
      'SELECT * FROM levels WHERE "levelNumber" = $1',
      [levelNumber],
    );
    const row = result.rows[0];
    return row ? this.toDomain(row) : null;
  }

  /** @inheritdoc */
  public async listAll(): Promise<LevelDefinition[]> {
    const result = await this.pool.query<LevelRow>('SELECT * FROM levels');
    return result.rows.map(row => this.toDomain(row));
  }

  /** @inheritdoc */
  public async save(level: LevelDefinition): Promise<void> {
    await this.upsert(level);
  }

  /** @inheritdoc */
  public async update(level: LevelDefinition): Promise<void> {
    await this.upsert(level);
  }

  private async upsert(level: LevelDefinition): Promise<void> {
    const dto = this.mapper.toDto(level);
    await this.pool.query(
      `INSERT INTO levels (id, "levelNumber", dto)
       VALUES ($1, $2, $3)
       ON CONFLICT(id) DO UPDATE SET
         "levelNumber" = EXCLUDED."levelNumber",
         dto = EXCLUDED.dto`,
      [level.id, level.levelNumber, JSON.stringify(dto)],
    );
  }

  private toDomain(row: LevelRow): LevelDefinition {
    const dto = JSON.parse(row.dto) as StructuredLevelJsonDto;
    return this.mapper.toLevelDefinition(dto);
  }
}

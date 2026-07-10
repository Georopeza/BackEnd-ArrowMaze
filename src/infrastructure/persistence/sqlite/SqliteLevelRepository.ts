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
  /**
   * @param db Conexión SQLite ya inicializada con el esquema de `levels`.
   * @param mapper Traductor wire↔dominio; por defecto crea una instancia nueva.
   */
  constructor(
    private readonly db: Database.Database,
    private readonly mapper: LevelJsonMapper = new LevelJsonMapper(),
  ) {}

  /**
   * Recupera un nivel por su identificador de catálogo.
   *
   * @param id Identificador único del nivel (`StructuredLevelJsonDto.id`).
   * @returns Agregado de dominio reconstruido desde JSON o `null`.
   */
  public async findById(id: string): Promise<LevelDefinition | null> {
    const row = this.db.prepare('SELECT * FROM levels WHERE id = ?').get(id) as LevelRow | undefined;
    return row ? this.toDomain(row) : null;
  }

  /**
   * Recupera un nivel por su número de progresión en el juego.
   *
   * @param levelNumber Orden lineal del nivel (1, 2, 3…).
   * @returns Agregado de dominio o `null` si no hay entrada con ese número.
   */
  public async findByLevelNumber(levelNumber: number): Promise<LevelDefinition | null> {
    const row = this.db.prepare('SELECT * FROM levels WHERE levelNumber = ?').get(levelNumber) as
      | LevelRow
      | undefined;
    return row ? this.toDomain(row) : null;
  }

  /**
   * Lista todos los niveles persistidos sin orden garantizado.
   *
   * @returns Colección completa de definiciones de nivel.
   */
  public async listAll(): Promise<LevelDefinition[]> {
    const rows = this.db.prepare('SELECT * FROM levels').all() as LevelRow[];
    return rows.map(row => this.toDomain(row));
  }

  /**
   * Inserta un nivel nuevo o lo sobrescribe si el `id` ya existe.
   *
   * @param level Definición de dominio a serializar como JSON en la columna `dto`.
   */
  public async save(level: LevelDefinition): Promise<void> {
    this.upsert(level);
  }

  /**
   * Actualiza la definición de un nivel existente (upsert por `id`).
   *
   * @param level Definición de dominio con el estado más reciente del tablero.
   */
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

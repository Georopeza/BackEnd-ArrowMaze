import { randomUUID } from 'node:crypto';
import { IProgressRepository } from '../../domain/repositories/IProgressRepository';
import { ILevelRepository } from '../../domain/repositories/ILevelRepository';
import { PlayerProgress } from '../../domain/entities/PlayerProgress';
import { SyncProgressDto, ProgressResultDto } from '../dto/ProgressDtos';
import { LevelNotFoundError } from '../errors';

/**
 * Caso de uso: sincronizar el progreso de un jugador en un nivel.
 *
 * Reutiliza la lógica de "mejor puntaje/movimientos/tiempo" ya encapsulada
 * en `PlayerProgress.updateScore` (la entidad, no el caso de uso, decide
 * qué valores conservar) — este caso de uso solo orquesta: valida que el
 * nivel exista, carga o crea el progreso, delega la actualización a la
 * entidad, y persiste el resultado.
 */
export class SyncProgressUseCase {
  constructor(
    private readonly progressRepository: IProgressRepository,
    private readonly levelRepository: ILevelRepository,
  ) {}

  public async execute(dto: SyncProgressDto): Promise<ProgressResultDto> {
    const level = await this.levelRepository.findById(dto.levelId);
    if (!level) {
      throw new LevelNotFoundError(dto.levelId);
    }

    const existing = await this.progressRepository.findByUserAndLevel(dto.userId, dto.levelId);
    const baseline =
      existing ?? new PlayerProgress(randomUUID(), dto.userId, dto.levelId, 0, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, false);

    const updated = baseline.updateScore(dto.score, dto.moves, dto.timeInSeconds, dto.completed);
    await this.progressRepository.save(updated);

    return {
      userId: updated.userId,
      levelId: updated.levelId,
      highScore: updated.highScore,
      minMoves: updated.minMoves,
      minTimeInSeconds: updated.minTimeInSeconds,
      isCompleted: updated.isCompleted,
    };
  }
}

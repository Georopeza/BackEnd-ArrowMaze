import { IProgressRepository } from '../../domain/repositories/IProgressRepository';
import { ICollectibleRepository } from '../../domain/repositories/ICollectibleRepository';
import { PlayerProgressListDto } from '../dto/ProgressDtos';

/**
 * Caso de uso: obtener todo el progreso guardado de un usuario.
 *
 * Permite que el cliente descargue su progreso al iniciar sesión desde un
 * dispositivo nuevo (o una sesión limpia) y lo fusione con el progreso local.
 * La regla de "mejor puntaje/movimientos/tiempo" al fusionar la aplica el
 * cliente sobre su propia entidad `PlayerProgress`; este caso de uso solo
 * expone lo que hay en el servidor.
 */
export class GetPlayerProgressUseCase {
  constructor(
    private readonly progressRepository: IProgressRepository,
    private readonly collectibleRepository: ICollectibleRepository,
  ) {}

  /**
   * Devuelve todo el progreso persistido de un usuario en todos los niveles.
   *
   * @param userId Identificador del jugador (típicamente extraído del JWT).
   * @returns Lista de progresos por nivel con mejores métricas almacenadas.
   */
  public async execute(userId: string): Promise<PlayerProgressListDto> {
    const all = await this.progressRepository.findAllByUser(userId);
    const collectibles = await this.collectibleRepository.findAllByUser(userId);

    return {
      userId,
      levels: all.map(progress => ({
        userId: progress.userId,
        levelId: progress.levelId,
        highScore: progress.highScore,
        minMoves: progress.minMoves,
        minTimeInSeconds: progress.minTimeInSeconds,
        isCompleted: progress.isCompleted,
      })),
      collectibles,
    };
  }
}

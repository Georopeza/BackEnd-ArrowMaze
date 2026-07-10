/** Entrada del caso de uso de sincronización de progreso. */
export interface SyncProgressDto {
  userId: string;
  levelId: string;
  score: number;
  moves: number;
  timeInSeconds: number;
  completed: boolean;
}

/** Resultado del progreso ya actualizado (mejor puntaje/movimientos/tiempo). */
export interface ProgressResultDto {
  userId: string;
  levelId: string;
  highScore: number;
  minMoves: number;
  minTimeInSeconds: number;
  isCompleted: boolean;
}

/** Consulta de tabla de clasificación para un nivel. */
export interface LeaderboardQueryDto {
  levelId: string;
  limit?: number;
}

/** Progreso completo de un usuario (todos sus niveles con registro). */
export interface PlayerProgressListDto {
  userId: string;
  levels: ProgressResultDto[];
}

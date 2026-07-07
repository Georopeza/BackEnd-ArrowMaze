import { PlayerProgress } from './PlayerProgress';

describe('PlayerProgress Entity', () => {
  let initialProgress: PlayerProgress;

  beforeEach(() => {
    // Inicializamos un progreso base: record de 100 puntos, 10 movimientos, 60 segundos, ya completado.
    initialProgress = new PlayerProgress(
      'progress-1',
      'user-123',
      'level-5',
      100, // highScore
      10,  // minMoves
      60,  // minTimeInSeconds
      true // isCompleted
    );
  });

  test('should_update_high_score_only_if_the_new_score_is_higher', () => {
    // Intentamos actualizar con un puntaje peor (80)
    const worseResult = initialProgress.updateScore(80, 10, 60, true);
    expect(worseResult.highScore).toBe(100); // Mantiene el viejo

    // Intentamos actualizar con un puntaje mejor (150)
    const betterResult = initialProgress.updateScore(150, 10, 60, true);
    expect(betterResult.highScore).toBe(150); // Se actualiza
  });

  test('should_update_min_moves_only_if_the_new_moves_are_fewer', () => {
    // Más movimientos (peor) -> no cambia
    const worseMoves = initialProgress.updateScore(100, 15, 60, true);
    expect(worseMoves.minMoves).toBe(10);

    // Menos movimientos (mejor) -> se actualiza
    const betterMoves = initialProgress.updateScore(100, 7, 60, true);
    expect(betterMoves.minMoves).toBe(7);
  });

  test('should_update_min_time_only_if_the_new_time_is_lower', () => {
    // Más tiempo (peor) -> no cambia
    const worseTime = initialProgress.updateScore(100, 10, 90, true);
    expect(worseTime.minTimeInSeconds).toBe(60);

    // Menos tiempo (mejor) -> se actualiza
    const betterTime = initialProgress.updateScore(100, 10, 45, true);
    expect(betterTime.minTimeInSeconds).toBe(45);
  });

  test('should_mark_as_completed_when_the_run_explicitly_finished_the_level', () => {
    // Creamos un progreso de un nivel que NUNCA se ha jugado (valores por defecto en 0 o vacíos)
    const freshProgress = new PlayerProgress('p-2', 'u-1', 'l-1', 0, 999, 999, false);

    // El jugador termina el nivel (sin flechas restantes) con score de 50
    const finishedRun = freshProgress.updateScore(50, 12, 120, true);

    expect(finishedRun.isCompleted).toBe(true);
    expect(finishedRun.highScore).toBe(50);
  });

  test('should_not_mark_as_completed_when_the_run_did_not_finish_the_level', () => {
    // REGLA: "completado" no se infiere del puntaje. Un intento fallido (con flechas restantes)
    // no debe marcar el nivel como completado, sin importar qué tan alto sea el puntaje reportado.
    const freshProgress = new PlayerProgress('p-3', 'u-1', 'l-1', 0, 999, 999, false);

    const failedRun = freshProgress.updateScore(0, 5, 30, false);

    expect(failedRun.isCompleted).toBe(false);
  });

  test('should_maintain_completed_status_even_if_subsequent_runs_are_worse_or_unfinished', () => {
    // Si ya estaba completado, jugar peor (o no terminar) no debería "des-completar" el nivel
    const worseButUnfinishedRun = initialProgress.updateScore(10, 40, 300, false);
    expect(worseButUnfinishedRun.isCompleted).toBe(true);
  });
});
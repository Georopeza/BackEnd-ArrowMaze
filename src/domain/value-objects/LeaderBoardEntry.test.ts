import { LeaderBoardEntry } from './LeaderBoardEntry';

describe('LeaderboardEntry - Sorting Logic', () => {
  test('should_sort_entries_correctly_based_on_score_moves_and_time', () => {
    const playerA = new LeaderBoardEntry('Kike_Pro', 1000, 10, 45);
    const playerB = new LeaderBoardEntry('German_AI', 1200, 15, 60); // Mejor score
    const playerC = new LeaderBoardEntry('Cheater_99', 1000, 8, 30);  // Mismo score que A, pero menos movimientos

    const leaderboard = [playerA, playerB, playerC];

    // Simulamos el criterio de ordenamiento oficial del juego
    leaderboard.sort((a, b) => {
      if (b.highScore !== a.highScore) return b.highScore - a.highScore;
      if (a.minMoves !== b.minMoves) return a.minMoves - b.minMoves;
      return a.minTimeInSeconds - b.minTimeInSeconds;
    });

    // Verificaciones de las posiciones del podio
    expect(leaderboard[0].username).toBe('German_AI'); // #1 por mayor puntaje absoluto
    expect(leaderboard[1].username).toBe('Cheater_99'); // #2 por desempatar en movimientos contra A
    expect(leaderboard[2].username).toBe('Kike_Pro');   // #3 queda al final de este grupo
  });
});
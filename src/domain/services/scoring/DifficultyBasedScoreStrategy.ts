import { Difficulty, Level } from '../../aggregates/Level';
import { IScoreStrategy } from './IScoreStrategy';

// Estrategia de puntuación que ajusta la dificultad del nivel según su complejidad.
export class DifficultyBasedScoreStrategy implements IScoreStrategy {
  // Calcula la puntuación del nivel aplicando un multiplicador según la dificultad.
  public calculateScore(level: Level, movements: number, timeSpent: number): number {
    const multiplier = this.getMultiplier(level.difficulty);
    const baseScore = 1000 * multiplier;
    const movePenalty = movements * (10 * multiplier);
    const timePenalty = timeSpent * (2 * multiplier);

    return Math.max(0, Math.round(baseScore - movePenalty - timePenalty));
  }

  // Devuelve el multiplicador numérico asociado a cada nivel de dificultad.
  private getMultiplier(difficulty: Difficulty): number {
    switch (difficulty) {
      case Difficulty.EASY:
        return 1;
      case Difficulty.MEDIUM:
        return 1.5;
      case Difficulty.HARD:
        return 2;
      default:
        return 1;
    }
  }
}

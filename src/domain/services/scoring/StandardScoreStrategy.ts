import { Level } from '../../aggregates/Level';
import { IScoreStrategy } from './IScoreStrategy';

// Estrategia básica de puntuación sin ajustar por dificultad.
export class StandardScoreStrategy implements IScoreStrategy {
  // Calcula la puntuación con una fórmula simple basada en movimientos y tiempo.
  public calculateScore(level: Level, movements: number, timeSpent: number): number {
    const baseScore = 1000;
    const movePenalty = movements * 10;
    const timePenalty = timeSpent * 2;
    const rawScore = baseScore - movePenalty - timePenalty;

    return Math.max(0, rawScore);
  }
}

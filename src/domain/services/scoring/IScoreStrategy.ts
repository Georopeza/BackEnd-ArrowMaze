import { Level } from '../../aggregates/Level';

// Contrato para cualquier estrategia que calcule la puntuación de un nivel.
export interface IScoreStrategy {
  // Devuelve la puntuación final del nivel según movimientos, tiempo y reglas específicas.
  calculateScore(level: Level, movements: number, timeSpent: number): number;
}

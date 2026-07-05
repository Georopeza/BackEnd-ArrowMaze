import { Board } from './Board';
import { IScoreStrategy } from '../services/scoring/IScoreStrategy';

// Niveles de dificultad disponibles para el juego.
export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

// Agregado de dominio que representa un nivel completo con tablero, reglas y límites de juego.
export class Level {
  public readonly id: string;
  public readonly levelNumber: number;
  public readonly difficulty: Difficulty;
  public readonly board: Board;
  public readonly maxMoves: number;
  public readonly maxTimeInSeconds: number;

  // Crea un nivel validando que tenga identificador, número, límites y al menos una flecha.
  constructor(
    id: string,
    levelNumber: number,
    difficulty: Difficulty,
    board: Board,
    maxMoves: number,
    maxTimeInSeconds: number,
  ) {
    if (!id.trim()) {
      throw new Error('Level id is required');
    }
    if (levelNumber <= 0) {
      throw new Error('Level number must be greater than zero');
    }
    if (maxMoves <= 0 || maxTimeInSeconds <= 0) {
      throw new Error('Game limits (maxMoves and maxTimeInSeconds) must be greater than zero');
    }
    if (board.getArrows().length === 0) {
      throw new Error('Level must contain at least one arrow to be playable');
    }

    this.id = id;
    this.levelNumber = levelNumber;
    this.difficulty = difficulty;
    this.board = board;
    this.maxMoves = maxMoves;
    this.maxTimeInSeconds = maxTimeInSeconds;
  }

  // Calcula la puntuación del nivel aplicando la estrategia de scoring recibida.
  public calculateScore(strategy: IScoreStrategy, movements: number, timeSpent: number): number {
    return strategy.calculateScore(this, movements, timeSpent);
  }

  // Indica si el nivel ya ha quedado resuelto al no tener flechas activas en el tablero.
  public isCompleted(): boolean {
    return this.board.isEmpty();
  }
}

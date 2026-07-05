import { Board } from '../aggregates/Board';
import { Difficulty, Level } from '../aggregates/Level';
import { Arrow } from '../entities/Arrow';
import { ArrowDefinition } from '../entities/ArrowDefinition';
import { ArrowId } from '../value-objects/ArrowId';
import { BoardDimensions } from '../value-objects/BoardDimensions';
import { Position } from '../value-objects/Position';

// Fábrica encargada de construir un nivel a partir de definiciones de flechas y dimensiones.
export class LevelFactory {
  // Crea un nivel completo, valida superposiciones y lo registra en el tablero.
  public create(
    id: string,
    levelNumber: number,
    difficulty: Difficulty,
    width: number,
    height: number,
    maxMoves: number,
    maxTimeInSeconds: number,
    arrows: ArrowDefinition[],
  ): Level {
    if (!arrows.length) {
      throw new Error('Level must contain at least one arrow');
    }

    const board = new Board(new BoardDimensions(height, width));
    const occupied = new Set<string>();

    for (const definition of arrows) {
      const arrow = this.createArrow(definition);

      for (const position of arrow.getAllPositions()) {
        const key = this.positionKey(position);
        if (occupied.has(key)) {
          throw new Error(`Arrow positions overlap at (${position.row}, ${position.col})`);
        }
        occupied.add(key);
      }

      board.addArrow(arrow);
    }

    return new Level(id, levelNumber, difficulty, board, maxMoves, maxTimeInSeconds);
  }

  // Convierte una definición simple de flecha en una instancia del dominio.
  private createArrow(definition: ArrowDefinition): Arrow {
    if (!definition.id.trim()) {
      throw new Error('Arrow id is required');
    }

    return new Arrow(
      new ArrowId(definition.id),
      definition.head,
      definition.direction,
      definition.body,
    );
  }

  // Genera una clave única para una posición para detectar colisiones entre flechas.
  private positionKey(position: Position): string {
    return `${position.row}:${position.col}`;
  }
}

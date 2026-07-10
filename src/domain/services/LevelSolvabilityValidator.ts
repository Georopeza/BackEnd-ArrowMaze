import { Direction } from '../value-objects/Direction';
import { getStep } from '../value-objects/DirectionVector';

/** Coordenada de fila y columna en el tablero. */
export interface Coordinate {
  row: number;
  col: number;
}

/** Pieza de flecha con cabeza, cuerpo y dirección para validación. */
export interface ArrowPiece {
  id: string;
  direction: Direction;
  head: Coordinate;
  body: Coordinate[];
}

/** DTO estructurado de nivel usado para validar solvabilidad. */
export interface StructuredLevelJsonDto {
  id: string;
  levelNumber: number;
  difficulty: string;
  maxMoves: number;
  maxTimeInSeconds: number;
  width: number;
  height: number;
  arrows: ArrowPiece[];
  // Paredes: obstáculos estáticos que también bloquean la línea de visión de las flechas.
  walls?: Coordinate[];
}

/** Valida si un nivel estructurado tiene al menos una secuencia de disparos ganadora. */
export class LevelSolvabilityValidator {

  /** Comprueba si el nivel JSON es jugable mediante backtracking. */
  public isPlayable(levelJson: StructuredLevelJsonDto): boolean {
    // Si el nivel nace sin flechas, técnicamente ya está resuelto (o es inválido según invariantes)
    if (!levelJson.arrows || levelJson.arrows.length === 0) {
      return true;
    }
    return this.solve(levelJson.arrows, levelJson.width, levelJson.height, levelJson.walls ?? []);
  }

  /**
   * Algoritmo de Backtracking (DFS) basado en la lista de flechas activas.
   */
  private solve(activeArrows: ArrowPiece[], width: number, height: number, walls: Coordinate[]): boolean {
    // 1. Condición de victoria: Si no quedan flechas en la lista, el nivel tiene solución
    if (activeArrows.length === 0) {
      return true;
    }

    // 2. Encontrar qué flechas tienen vía libre para salir en este estado actual
    const playableArrows = this.getAvailableMoves(activeArrows, width, height, walls);

    // 3. Si quedan flechas pero ninguna puede moverse -> Callejón sin salida / Bloqueo
    if (playableArrows.length === 0) {
      return false;
    }

    // 4. Probar recursivamente cada disparo posible
    for (const arrowToLaunch of playableArrows) {
      // Simulamos la desocupación masiva de la matriz simplemente clonando la lista
      // y excluyendo la flecha disparada (con toda su cabeza y cuerpo)
      const nextActiveArrows = activeArrows.filter(arrow => arrow.id !== arrowToLaunch.id);

      // Avanzamos en profundidad con el nuevo estado del tablero
      if (this.solve(nextActiveArrows, width, height, walls)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Filtra de la lista de flechas activas cuáles pueden salir disparadas sin chocar.
   */
  private getAvailableMoves(activeArrows: ArrowPiece[], width: number, height: number, walls: Coordinate[]): ArrowPiece[] {
    return activeArrows.filter(arrow => this.canArrowExit(arrow, activeArrows, width, height, walls));
  }

  /** Verifica si la trayectoria de la flecha hacia el exterior está despejada. */
  public canArrowExit(arrow: ArrowPiece, activeArrows: ArrowPiece[], width: number, height: number, walls: Coordinate[] = []): boolean {
    const { rowStep, colStep } = getStep(arrow.direction);

    // La trayectoria de escape inicia justo una casilla por delante de la cabeza
    let r = arrow.head.row + rowStep;
    let c = arrow.head.col + colStep;

    // Avanzamos en línea recta hasta salir de los límites físicos del tablero (width y height)
    while (r >= 0 && r < height && c >= 0 && c < width) {

      // Comprobamos si esta coordenada colisiona con el espacio ocupado por OTRA flecha activa
      const isBlockedByArrow = activeArrows.some(otherArrow => {
        // Obviamente una flecha no se bloquea con sus propias piezas
        if (otherArrow.id === arrow.id) return false;

        // Verifica si choca con la cabeza de la otra flecha
        const hitsHead = otherArrow.head.row === r && otherArrow.head.col === c;
        if (hitsHead) return true;

        // Verifica si choca con alguna parte del cuerpo de la otra flecha
        const hitsBody = otherArrow.body.some(b => b.row === r && b.col === c);
        return hitsBody;
      });

      // Comprobamos si esta coordenada corresponde a una pared (obstáculo estático)
      const isBlockedByWall = walls.some(wall => wall.row === r && wall.col === c);

      if (isBlockedByArrow || isBlockedByWall) {
        return false; // Trayectoria obstruida, la flecha no puede salir
      }

      r += rowStep;
      c += colStep;
    }

    return true; // Camino completamente despejado hacia el exterior
  }
}
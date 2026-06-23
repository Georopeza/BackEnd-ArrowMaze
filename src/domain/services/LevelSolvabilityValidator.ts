import { Direction } from '../value-objects/Direction';

// Interfaces que mapean exactamente la estructura de tu JSON acordado
export interface Coordinate {
  row: number;
  col: number;
}

export interface ArrowPiece {
  id: string;
  direction: Direction;
  head: Coordinate;
  body: Coordinate[];
}

export interface StructuredLevelJsonDto {
  id: string;
  levelNumber: number;
  difficulty: string;
  maxMoves: number;
  maxTimeInSeconds: number;
  width: number;
  height: number;
  arrows: ArrowPiece[];
}

export class LevelSolvabilityValidator {

  /**
   * Punto de entrada principal para validar el nivel estructurado.
   */
  public isPlayable(levelJson: StructuredLevelJsonDto): boolean {
    // Si el nivel nace sin flechas, técnicamente ya está resuelto (o es inválido según invariantes)
    if (!levelJson.arrows || levelJson.arrows.length === 0) {
      return true;
    }
    return this.solve(levelJson.arrows, levelJson.width, levelJson.height);
  }

  /**
   * Algoritmo de Backtracking (DFS) basado en la lista de flechas activas.
   */
  private solve(activeArrows: ArrowPiece[], width: number, height: number): boolean {
    // 1. Condición de victoria: Si no quedan flechas en la lista, el nivel tiene solución
    if (activeArrows.length === 0) {
      return true;
    }

    // 2. Encontrar qué flechas tienen vía libre para salir en este estado actual
    const playableArrows = this.getAvailableMoves(activeArrows, width, height);

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
      if (this.solve(nextActiveArrows, width, height)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Filtra de la lista de flechas activas cuáles pueden salir disparadas sin chocar.
   */
  private getAvailableMoves(activeArrows: ArrowPiece[], width: number, height: number): ArrowPiece[] {
    return activeArrows.filter(arrow => this.canArrowExit(arrow, activeArrows, width, height));
  }

  /**
   * Verifica si la trayectoria de la cabeza de la flecha hacia el exterior está despejada.
   */
  private canArrowExit(arrow: ArrowPiece, activeArrows: ArrowPiece[], width: number, height: number): boolean {
    const { rowStep, colStep } = this.getSteps(arrow.direction);
    
    // La trayectoria de escape inicia justo una casilla por delante de la cabeza
    let r = arrow.head.row + rowStep;
    let c = arrow.head.col + colStep;

    // Avanzamos en línea recta hasta salir de los límites físicos del tablero (width y height)
    while (r >= 0 && r < height && c >= 0 && c < width) {
      
      // Comprobamos si esta coordenada colisiona con el espacio ocupado por OTRA flecha activa
      const isBlocked = activeArrows.some(otherArrow => {
        // Obviamente una flecha no se bloquea con sus propias piezas
        if (otherArrow.id === arrow.id) return false;

        // Verifica si choca con la cabeza de la otra flecha
        const hitsHead = otherArrow.head.row === r && otherArrow.head.col === c;
        if (hitsHead) return true;

        // Verifica si choca con alguna parte del cuerpo de la otra flecha
        const hitsBody = otherArrow.body.some(b => b.row === r && b.col === c);
        return hitsBody;
      });

      if (isBlocked) {
        return false; // Trayectoria obstruida, la flecha no puede salir
      }

      r += rowStep;
      c += colStep;
    }

    return true; // Camino completamente despejado hacia el exterior
  }

  /**
   * Traduce la dirección al incremento de coordenadas en la matriz.
   */
  private getSteps(direction: Direction): { rowStep: number; colStep: number } {
    switch (direction) {
      case Direction.UP:    return { rowStep: -1, colStep: 0 };
      case Direction.DOWN:  return { rowStep: 1,  colStep: 0 };
      case Direction.LEFT:  return { rowStep: 0,  colStep: -1 };
      case Direction.RIGHT: return { rowStep: 0,  colStep: 1 };
      default: return { rowStep: 0, colStep: 0 };
    }
  }
}
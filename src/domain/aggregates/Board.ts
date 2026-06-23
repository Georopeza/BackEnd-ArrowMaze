import { Cell } from '../entities/Cell';
import { EmptyCell } from '../entities/EmptyCell';
import { Arrow } from '../entities/Arrow';
import { Position } from '../value-objects/Position';
import { BoardDimensions } from '../value-objects/BoardDimensions';
import { Direction } from '../value-objects/Direction';

export class Board {
  private grid: Cell[][];
  private arrows: Arrow[];

  constructor(private readonly dimensions: BoardDimensions) {
    this.grid = this.createEmptyGrid();
    this.arrows = [];
  }

  // Inicializa el tablero vacío

public printBoard(): void {
  const visual = this.grid.map((row, rowIndex) => 
    row.map((cell, colIndex) => {
      const pos = new Position(rowIndex, colIndex);
      // Buscamos la flecha que ocupa esta posición
      const arrow = this.arrows.find(a => a.occupies(pos));
      
      if (!arrow) return ' . '; // Celda vacía

      // Si es la cabeza, marcamos con H
      if (arrow.headPosition.equals(pos)) return ' H ';
      
      // Si es parte del cuerpo, ponemos el ID (cortado a 3 caracteres)
      return ` ${arrow.id.value.substring(0, 1)} ` ; 
    }).join('|')
  ).join('\n' + '-'.repeat(this.dimensions.cols * 4) + '\n');

  console.log('\n--- Current Board State ---');
  console.log(visual);
  console.log('---------------------------\n');
}

  private createEmptyGrid(): Cell[][] {
    return Array.from({ length: this.dimensions.rows }, () =>
      Array.from({ length: this.dimensions.cols }, () => new EmptyCell())
    );
  }

  // Método para inyectar flechas (útil para tests y carga de niveles)
  public addArrow(arrow: Arrow): void {
    this.arrows.push(arrow);
    // Nota: Opcionalmente aquí podrías actualizar el grid visualmente
    // si necesitas que las celdas sepan qué ArrowId contienen.
  }

  public interactWithCell(row: number, col: number): boolean {
    const pos = new Position(row, col);
    const arrow = this.arrows.find(a => a.occupies(pos));

    // Si no hay flecha, no hacemos nada
    if (!arrow) return false;

    // 1. Validar: ¿Está el camino despejado?
    if (!this.isPathClear(arrow)) return false;

    // 2. Ejecutar: Limpiar el tablero y eliminar la flecha
    this.removeArrow(arrow);
    return true;
  }

  private isPathClear(arrow: Arrow): boolean {
    const dir = arrow.getDirection();
    let currentPos = arrow.getHead();

    while (true) {
      const nextPos = this.calculateNextPosition(currentPos, dir);

      // Si salimos del tablero, el camino está libre -> ¡Éxito!
      if (!this.dimensions.isValidPosition(nextPos.row, nextPos.col)) {
        return true;
      }

      // Si encontramos otra flecha, bloqueado -> ¡Fallido!
      const blockingArrow = this.arrows.find(a => a.occupies(nextPos) && a.getId().value !== arrow.getId().value);
      if (blockingArrow) return false;

      currentPos = nextPos;
    }
  }

  private removeArrow(arrow: Arrow): void {
    // Limpiamos las celdas en el grid
    arrow.getAllPositions().forEach(pos => {
      this.grid[pos.row][pos.col] = new EmptyCell();
    });

    // Eliminamos la flecha de nuestra lista
    this.arrows = this.arrows.filter(a => a.getId().value !== arrow.getId().value);
  }

  private calculateNextPosition(pos: Position, dir: Direction): Position {
    switch (dir) {
      case Direction.UP: return new Position(pos.row - 1, pos.col);
      case Direction.DOWN: return new Position(pos.row + 1, pos.col);
      case Direction.LEFT: return new Position(pos.row, pos.col - 1);
      case Direction.RIGHT: return new Position(pos.row, pos.col + 1);
      default: throw new Error(`Dirección desconocida`);
    }
  }

  // Getters para tests
  public getArrows(): Arrow[] {
    return this.arrows;
  }
}
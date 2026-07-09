import { Cell } from '../entities/Cell';
import { EmptyCell } from '../entities/EmptyCell';
import { WallCell } from '../entities/WallCell';
import { Arrow } from '../entities/Arrow';
import { Position } from '../value-objects/Position';
import { BoardDimensions } from '../value-objects/BoardDimensions';

export class Board {
  private grid: Cell[][];
  private arrows: Arrow[];

  constructor(private readonly dimensions: BoardDimensions) {
    this.grid = this.createEmptyGrid();
    this.arrows = [];
  }

  private createEmptyGrid(): Cell[][] {
    return Array.from({ length: this.dimensions.rows }, () =>
      Array.from({ length: this.dimensions.cols }, () => new EmptyCell())
    );
  }

  // Mutators / query API mínimos para que servicios externos operen sobre el tablero.
  public addArrow(arrow: Arrow): void {
  // 1. Validar cada posición de la flecha contra los límites del tablero
  for (const pos of arrow.getAllPositions()) {
    if (pos.row < 0 || pos.row >= this.dimensions.rows ||
        pos.col < 0 || pos.col >= this.dimensions.cols) {
      throw new Error('Arrow is out of the board boundaries');
    }
  }

  // 2. Rechazar IDs duplicados: dos flechas no pueden compartir identidad
  if (this.arrows.some(a => a.getId().value === arrow.getId().value)) {
    throw new Error(`Arrow id "${arrow.getId().value}" already exists on the board`);
  }

  // 3. Rechazar solapamiento: ninguna posición (cabeza o cuerpo) puede coincidir con otra flecha ya colocada
  for (const pos of arrow.getAllPositions()) {
    if (this.findArrowAt(pos)) {
      throw new Error(`Position (${pos.row}, ${pos.col}) is already occupied by another arrow`);
    }
  }

  // 4. Si pasa todas las validaciones, se agrega la flecha
  this.arrows.push(arrow);
}

  public getArrows(): Arrow[] {
    return this.arrows;
  }

  public getDimensions(): BoardDimensions {
    return this.dimensions;
  }

  public findArrowAt(pos: Position): Arrow | undefined {
    return this.arrows.find(a => a.occupies(pos));
  }

  // Coloca una pared (obstáculo estático) en el grid. A diferencia de las flechas,
  // las paredes no se mueven ni se disparan: solo bloquean la línea de visión.
  public addWall(pos: Position): void {
    if (!this.dimensions.isValidPosition(pos.row, pos.col)) {
      throw new Error('Wall is out of the board boundaries');
    }
    this.grid[pos.row][pos.col] = new WallCell();
  }

  // Consulta el contenido estático del grid en una posición (por ejemplo, para saber si hay una pared).
  public getCellAt(row: number, col: number): Cell {
    if (!this.dimensions.isValidPosition(row, col)) {
      throw new Error('Position is out of the board boundaries');
    }
    return this.grid[row][col];
  }

  // El nivel está resuelto cuando ya no quedan flechas por disparar en el tablero.
  public isSolved(): boolean {
    return this.arrows.length === 0;
  }

  public clearPositions(positions: Position[]): void {
    positions.forEach(pos => {
      if (this.dimensions.isValidPosition(pos.row, pos.col)) {
        this.grid[pos.row][pos.col] = new EmptyCell();
      }
    });
  }

  public removeArrowById(id: string): void {
    const arrow = this.arrows.find(a => a.getId().value === id);
    if (arrow) {
      // limpiar grid para posiciones de la flecha encontrada
      arrow.getAllPositions().forEach(pos => {
        if (this.dimensions.isValidPosition(pos.row, pos.col)) {
          this.grid[pos.row][pos.col] = new EmptyCell();
        }
      });
    }
    this.arrows = this.arrows.filter(a => a.getId().value !== id);
  }
}
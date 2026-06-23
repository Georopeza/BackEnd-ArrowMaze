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

  private createEmptyGrid(): Cell[][] {
    return Array.from({ length: this.dimensions.rows }, () =>
      Array.from({ length: this.dimensions.cols }, () => new EmptyCell())
    );
  }

  // Mutators / query API mínimos para que servicios externos operen sobre el tablero.
  public addArrow(arrow: Arrow): void {
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
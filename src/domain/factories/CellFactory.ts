import { Cell } from '../entities/Cell';
import { ArrowCell } from '../entities/ArrowCell';
import { ArrowBodyCell } from '../entities/ArrowBodyCell';
import { WallCell } from '../entities/WallCell';
import { EmptyCell } from '../entities/EmptyCell';
import { ExitCell } from '../entities/ExitCell';
import { Direction } from '../value-objects/Direction';

// Factory registrable para crear celdas; permite extender sin modificar la clase.

// Definimos los tipos fijos del juego base, pero dejamos la puerta abierta a strings libres
export type DefaultCellType = 'ArrowCell' | 'ArrowBodyCell' | 'WallCell' | 'EmptyCell' | 'ExitCell';
export type CellType = DefaultCellType | (string & Record<never, never>);

export class CellFactory {
  private registry: Map<string, (data?: any) => Cell> = new Map();

  constructor() {
    // registraciones por defecto
    this.register('ArrowCell', (data?: any) => {
      if (!data?.direction) throw new Error('ArrowCell requires a direction');
      if (!data?.arrowId) throw new Error('ArrowCell requires an arrowId');
      return new ArrowCell(data.direction as Direction, data.arrowId as string);
    });
    this.register('ArrowBodyCell', (data?: any) => {
      if (!data?.arrowId) throw new Error('ArrowBodyCell requires an arrowId');
      return new ArrowBodyCell(data.arrowId as string);
    });
    this.register('WallCell', () => new WallCell());
    this.register('EmptyCell', () => new EmptyCell());
    this.register('ExitCell', () => new ExitCell());
  }

  public register(type: string, factoryFn: (data?: any) => Cell): void {
    this.registry.set(type, factoryFn);
  }

  public createCell(type: CellType, data?: any): Cell {
    const factoryFn = this.registry.get(type);
    if (!factoryFn) throw new Error(`Unknown cell type: ${type}`);
    return factoryFn(data);
  }
}
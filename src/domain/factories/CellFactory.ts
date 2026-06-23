import { Cell } from '../entities/Cell';
import { ArrowCell } from '../entities/ArrowCell';
import { WallCell } from '../entities/WallCell';
import { EmptyCell } from '../entities/EmptyCell';
import { ExitCell } from '../entities/ExitCell';
import { Direction } from '../value-objects/Direction';

// Factory registrable para crear celdas; permite extender sin modificar la clase.

// Definimos los tipos fijos del juego base, pero dejamos la puerta abierta a strings libres
export type DefaultCellType = 'ArrowCell' | 'WallCell' | 'EmptyCell' | 'ExitCell';
export type CellType = DefaultCellType | (string & {});

export class CellFactory {
  private registry: Map<string, (data?: any) => Cell> = new Map();

  constructor() {
    // registraciones por defecto
    this.register('ArrowCell', (data?: any) => {
      if (!data?.direction) throw new Error('ArrowCell requires a direction');
      return new ArrowCell(data.direction as Direction);
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
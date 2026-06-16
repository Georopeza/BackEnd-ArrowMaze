import { Cell } from '../entities/Cell';
import { ArrowCell } from '../entities/ArrowCell';
import { WallCell } from '../entities/WallCell';
import { EmptyCell } from '../entities/EmptyCell';
import { ExitCell } from '../entities/ExitCell';
import { Direction } from '../value-objects/Direction';

// Factory puramente creacional para la creación de celdas del tablero.
export class CellFactory {
  /**
   * Crea una celda a partir de un tipo y datos opcionales.
   * @param type tipo de celda a crear.
   * @param data datos adicionales necesarios para ciertos tipos de celda.
   * @returns instancia de Cell correspondiente.
   */
  public createCell(type: string, data?: any): Cell {
    switch (type) {
      case 'ArrowCell':
        if (!data?.direction) {
          throw new Error('ArrowCell requires a direction');
        }
        return new ArrowCell(data.direction as Direction);
      case 'WallCell':
        return new WallCell();
      case 'EmptyCell':
        return new EmptyCell();
      case 'ExitCell':
        return new ExitCell();
      default:
        throw new Error(`Unknown cell type: ${type}`);
    }
  }
}

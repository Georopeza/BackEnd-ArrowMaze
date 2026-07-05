
import { ArrowId } from '../value-objects/ArrowId';
import { Position } from '../value-objects/Position';
import { Direction } from '../value-objects/Direction';

export class Arrow {
  constructor(
    private readonly id: ArrowId,
    private readonly headPosition: Position,
    private readonly direction: Direction,
    private readonly bodyPositions: Position[],
  ) {}

  public getId(): ArrowId {
    return this.id;
  }

  public getDirection(): Direction {
    return this.direction;
  }

  public getHead(): Position {
    return this.headPosition;
  }

  // Devuelve todas las celdas ocupadas por la flecha, incluyendo cabeza y cuerpo.
  public getAllPositions(): Position[] {
    return [this.headPosition, ...this.bodyPositions];
  }

  // Comprueba si una posición concreta pertenece a esta flecha.
  public occupies(pos: Position): boolean {
    return this.getAllPositions().some(position => position.equals(pos));
  }
}

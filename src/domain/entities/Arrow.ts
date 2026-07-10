
import { ArrowId } from '../value-objects/ArrowId';
import { Position } from '../value-objects/Position';
import { Direction } from '../value-objects/Direction';

/** Entidad que representa una flecha con cabeza, dirección y celdas ocupadas. */
export class Arrow {
  /** Construye una flecha con identidad, cabeza, dirección y posiciones ocupadas. */
  constructor(
    private readonly id: ArrowId,
    private readonly headPosition: Position,
    private readonly direction: Direction,
    private readonly occupiedPositions: Position[] 
  ) {}

  /** Devuelve el identificador único de la flecha. */
  public getId(): ArrowId { return this.id; }

  /** Devuelve la dirección de disparo de la flecha. */
  public getDirection(): Direction { return this.direction; }

  /** Devuelve la posición de la cabeza de la flecha. */
  public getHead(): Position { return this.headPosition; }

  /** Devuelve todas las posiciones ocupadas por la flecha (cabeza y cuerpo). */
  public getAllPositions(): Position[] { return this.occupiedPositions; }

  /** Indica si la flecha ocupa la posición dada. */
  public occupies(pos: Position): boolean {
    return this.headPosition.equals(pos) || this.occupiedPositions.some(p => p.equals(pos));
  }
}

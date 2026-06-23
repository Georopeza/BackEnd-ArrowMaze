// src/domain/entities/Arrow.ts
import { ArrowId } from '../value-objects/ArrowId';
import { Position } from '../value-objects/Position';
import { Direction } from '../value-objects/Direction';

// src/domain/entities/Arrow.ts
export class Arrow {
  constructor(
    private readonly id: ArrowId,
    private readonly headPosition: Position,
    private readonly direction: Direction,
    private readonly occupiedPositions: Position[] 
  ) {}

  public getId(): ArrowId { return this.id; }
  public getDirection(): Direction { return this.direction; }
  public getHead(): Position { return this.headPosition; }
  
  // El tablero usa esto para limpiar
  public getAllPositions(): Position[] { return this.occupiedPositions; }

  // El tablero usa esto para verificar colisiones
  public occupies(pos: Position): boolean {
    return this.headPosition.equals(pos) || this.occupiedPositions.some(p => p.equals(pos));
  }
}
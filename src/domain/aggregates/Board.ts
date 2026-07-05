import { Arrow } from '../entities/Arrow';
import { BoardDimensions } from '../value-objects/BoardDimensions';
import { Position } from '../value-objects/Position';

export class Board {
  private readonly arrows: Arrow[];

  constructor(private readonly dimensions: BoardDimensions) {
    this.arrows = [];
  }

  // Registra una flecha solo si su espacio está dentro del tablero y no colisiona con otra.
  public addArrow(arrow: Arrow): void {
    for (const pos of arrow.getAllPositions()) {
      if (!this.dimensions.isValidPosition(pos.row, pos.col)) {
        throw new Error('La flecha está fuera de los límites del tablero');
      }
    }

    const hasOverlap = this.arrows.some(existing =>
      existing.getAllPositions().some(existingPos =>
        arrow.getAllPositions().some(newPos => newPos.equals(existingPos)),
      ),
    );

    if (hasOverlap) {
      throw new Error('La flecha se superpone con otra flecha existente');
    }

    this.arrows.push(arrow);
  }

  // Devuelve una copia de la lista de flechas para evitar modificaciones externas.
  public getArrows(): Arrow[] {
    return [...this.arrows];
  }

  // Devuelve las dimensiones del tablero para validar movimientos y renderizar el estado.
  public getDimensions(): BoardDimensions {
    return this.dimensions;
  }

  // Busca una flecha que ocupe la posición dada, si existe.
  public findArrowAt(pos: Position): Arrow | undefined {
    return this.arrows.find(arrow => arrow.occupies(pos));
  }

  // Elimina una flecha del tablero por su identificador único.
  public removeArrowById(id: string): void {
    this.arrows.splice(
      0,
      this.arrows.length,
      ...this.arrows.filter(arrow => arrow.getId().value !== id),
    );
  }

  // Comprueba si el tablero está vacío, es decir, sin flechas registradas.
  public isEmpty(): boolean {
    return this.arrows.length === 0;
  }
}

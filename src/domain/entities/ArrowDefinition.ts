import { Direction } from '../value-objects/Direction';
import { Position } from '../value-objects/Position';

export interface ArrowDefinition {
  id: string;
  direction: Direction;
  head: Position;
  body: Position[];
}

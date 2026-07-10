// Contrato de comunicación entre repos para la definición de un nivel.
//
// Es el formato JSON ("wire format") que el backend expone y que el
// frontend consume para cargar niveles. Ninguno de los dos lados debe
// duplicar esta forma: el backend lo traduce a `LevelDefinition` (ver
// `src/infrastructure/mappers/LevelJsonMapper.ts`) y el frontend lo
// traduce a sus propias entidades desde `lib/interface_adapters/level_dto_mapper.dart`,
// usando el espejo Dart en `Arrow-Maze-Escape-Puzzle/lib/contract/level_contract.dart`.

/** Dificultad de un nivel, en inglés para coincidir con ambos dominios. */
export type LevelDifficultyDto = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

/** Coordenada de una celda del tablero (fila/columna, base 0). */
export interface CellPositionDto {
  row: number;
  col: number;
}

/** Dirección de una flecha, reutilizando el enum de dominio `Direction`. */
export type ArrowDirectionDto = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

/**
 * Una flecha del nivel: su celda "cabeza" (la que efectivamente se mueve)
 * y las celdas de "cuerpo" que ocupa además de la cabeza.
 *
 * Máximo 2 segmentos de cuerpo (3 celdas en total incluyendo la cabeza),
 * alineado con el diseño visual del cliente Flutter.
 */
export interface StructuredArrowJsonDto {
  id: string;
  direction: ArrowDirectionDto;
  head: CellPositionDto;
  body: CellPositionDto[];
}

/**
 * Definición completa de un nivel tal como se transmite entre repos.
 *
 * `exit` y `walls` se agregaron durante la fusión de Sprint 1: el dominio
 * ya tiene `ExitCell`/`WallCell`, pero el contrato original solo describía
 * `arrows`, dejando sin representar dónde está la salida o si hay muros.
 */
export interface StructuredLevelJsonDto {
  id: string;
  levelNumber: number;
  difficulty: LevelDifficultyDto;
  maxMoves: number;
  maxTimeInSeconds: number;
  width: number;
  height: number;
  exit: CellPositionDto;
  walls?: CellPositionDto[];
  arrows: StructuredArrowJsonDto[];
}

import { StructuredArrowJsonDto, StructuredLevelJsonDto } from '../../../docs/contract/level.contract';

/**
 * Mínimo de segmentos de cuerpo por flecha: la flecha necesita cabeza + al
 * menos una celda de cuerpo para ser una pieza real del tablero (una celda
 * suelta sin cuerpo no es una "flecha" jugable en el diseño del juego).
 *
 * No hay máximo: el trazado del cliente (`ArrowPathGeometry.tailToHead`)
 * dibuja una polilínea con tantos puntos como el cuerpo tenga, y los límites
 * geométricos reales (que la flecha no salga del tablero ni se solape con
 * otra) ya los aplican `LevelBuilder.addCell` y `Board.addArrow`.
 */
export const MIN_ARROW_BODY_SEGMENTS = 1;

/**
 * Valida que cada flecha del DTO tenga al menos [MIN_ARROW_BODY_SEGMENTS] celdas de cuerpo.
 *
 * @throws Error si alguna flecha no cumple el mínimo.
 */
export function validateArrowBodyLengths(dto: StructuredLevelJsonDto): void {
  for (const arrow of dto.arrows) {
    validateSingleArrowBody(arrow);
  }
}

/**
 * Valida el array `body` de una flecha individual.
 */
export function validateSingleArrowBody(arrow: StructuredArrowJsonDto): void {
  const bodyLength = arrow.body?.length ?? 0;
  if (bodyLength < MIN_ARROW_BODY_SEGMENTS) {
    throw new Error(
      `Arrow "${arrow.id}" has ${bodyLength} body segments; ` +
        `every arrow needs at least ${MIN_ARROW_BODY_SEGMENTS} body cell in addition to its head.`,
    );
  }
}

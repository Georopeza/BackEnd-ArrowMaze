import { StructuredArrowJsonDto, StructuredLevelJsonDto } from '../../../docs/contract/level.contract';

/** Máximo de segmentos de cuerpo por flecha (cabeza + cuerpo ≤ 3 celdas). */
export const MAX_ARROW_BODY_SEGMENTS = 2;

/**
 * Valida que cada flecha del DTO no exceda el límite de celdas del diseño visual.
 *
 * @throws Error si alguna flecha tiene más de [MAX_ARROW_BODY_SEGMENTS] en `body`.
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
  if (bodyLength > MAX_ARROW_BODY_SEGMENTS) {
    throw new Error(
      `Arrow "${arrow.id}" has ${bodyLength} body segments; ` +
        `maximum allowed is ${MAX_ARROW_BODY_SEGMENTS} (3 cells total including head).`,
    );
  }
}

import { z } from 'zod';

/**
 * Esquemas Zod de las RESPUESTAS de la API, usados exclusivamente por las
 * pruebas de contrato (`tests/integration/contractFixtures.spec.ts`).
 *
 * A diferencia de los esquemas de request (`registerSchema`, `loginSchema`,
 * `syncProgressSchema` en `src/infrastructure/http/routes/*.ts`, que validan
 * en producción), estos no se usan en el servidor: la API no valida la forma
 * de lo que ella misma produce. Sirven para que la prueba de contrato
 * verifique TIPOS además de claves (un campo con el nombre correcto pero el
 * tipo equivocado —p. ej. `highScore` como string— pasaría una comparación
 * de solo-claves pero falla aquí), tanto en el fixture compartido como en la
 * respuesta real del servidor.
 *
 * `.strict()` en cada objeto además rechaza campos NO documentados en el
 * contrato, detectando el caso contrario: una respuesta real con un campo
 * extra que el fixture no anticipa.
 */

export const authRegisterResponseSchema = z
  .object({
    userId: z.string(),
    username: z.string(),
  })
  .strict();

export const authLoginResponseSchema = z
  .object({
    token: z.string(),
    userId: z.string(),
    username: z.string(),
  })
  .strict();

export const progressResultSchema = z
  .object({
    userId: z.string(),
    levelId: z.string(),
    highScore: z.number().int(),
    minMoves: z.number().int(),
    minTimeInSeconds: z.number().int(),
    isCompleted: z.boolean(),
  })
  .strict();

export const progressGetResponseSchema = z
  .object({
    userId: z.string(),
    levels: z.array(progressResultSchema),
    collectibles: z.array(z.string()),
  })
  .strict();

export const collectiblesSyncResponseSchema = z
  .object({
    userId: z.string(),
    collectibles: z.array(z.string()),
  })
  .strict();

export const leaderboardEntrySchema = z
  .object({
    username: z.string(),
    highScore: z.number().int(),
    minMoves: z.number().int(),
    minTimeInSeconds: z.number().int(),
  })
  .strict();

export const leaderboardResponseSchema = z.array(leaderboardEntrySchema);

const cellPositionSchema = z.object({ row: z.number().int(), col: z.number().int() }).strict();

const arrowSchema = z
  .object({
    id: z.string(),
    direction: z.enum(['UP', 'DOWN', 'LEFT', 'RIGHT']),
    head: cellPositionSchema,
    body: z.array(cellPositionSchema),
  })
  .strict();

/** Mismo shape que `StructuredLevelJsonDto` (`docs/contract/level.contract.ts`). */
export const levelDtoSchema = z
  .object({
    id: z.string(),
    name: z.string().optional(),
    levelNumber: z.number().int(),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT']),
    maxMoves: z.number().int(),
    maxTimeInSeconds: z.number().int(),
    width: z.number().int(),
    height: z.number().int(),
    exit: cellPositionSchema,
    walls: z.array(cellPositionSchema).optional(),
    arrows: z.array(arrowSchema),
    optimalMoves: z.number().int().optional(),
  })
  .strict();

export const levelsGetResponseSchema = z.array(levelDtoSchema);

/** Sobre de error consistente usado por `errorHandlerMiddleware` en toda la API. */
export const errorResponseSchema = z
  .object({
    error: z
      .object({
        message: z.string(),
      })
      .passthrough(), // Zod validation errors adjuntan `details`; no forma parte del contrato mínimo.
  })
  .strict();

# Registro de uso de IA

## Herramientas utilizadas

| Herramienta | Versión / modelo | Rol en el flujo de trabajo |
|---|---|---|
| GitHub Copilot Chat | Raptor mini Preview; luego Claude Haiku 4.5 | Generación inicial de código de dominio puro y de infraestructura HTTP a partir de prompts detallados dentro del IDE. |
| Cursor Agent (Composer) / Cursor AI | Integrado en el IDE | Implementación asistida con acceso de lectura/escritura al repositorio y ejecución de tests, usado en paralelo por distintos miembros del equipo durante Sprint 1. |
| Claude Code | Claude Sonnet 5 (mayoría de sesiones); Claude Opus 4.8 en una sesión autónoma nocturna puntual | Agente principal desde media sesión en adelante: sesiones interactivas de terminal con acceso de lectura/escritura al repositorio, ejecución real de tests/build/servidor, `git worktree` para reproducir commits aislados, y modo de planificación explícita para cambios de mayor alcance antes de tocar código. |

## Registro de consultas

## Consulta #1 — Diseño del modelo de dominio puro (Clean Architecture y DDD)

**Problema abordado.**

Diseñar el modelo de dominio puro (Capa 1) para el juego "Arrow Maze" en TypeScript: implementar patrones SOLID (Liskov Substitution Principle), Factory Method, Composite y Strategy; asegurar código puro sin frameworks, librerías externas ni ORM; sin archivos de pruebas en esta fase.

**Herramienta de IA utilizada.**

- GitHub Copilot Chat (modelo: Raptor mini Preview).

**Prompt o instrucción proporcionada.**

> Actúa como un arquitecto de software experto en Clean Architecture y Domain-Driven Design (DDD). Vamos a diseñar de forma masiva el modelo de dominio puro (Capa 1) para el juego "Arrow Maze" en TypeScript.
>
> Restricciones críticas: No uses librerías externas ni decoradores de bases de datos (ORM). Todo debe ser código puro de TypeScript, independiente de cualquier framework. No generes archivos de pruebas (tests) ni stubs de testing.
>
> Quiero que generes los archivos necesarios para cubrir estos 4 aspectos clave del dominio: 1) OBJETOS DE VALOR (Value Objects): Direction (Enum con UP, DOWN, LEFT, RIGHT) y Position (Clase inmutable con propiedades row y col). 2) PATRÓN FACTORY METHOD + LISKOV SUBSTITUTION: Clase abstracta Cell de base, subclases ArrowCell, WallCell, EmptyCell y ExitCell, y clase CellFactory con createCell(type: string, data?: any): Cell. 3) PATRÓN COMPOSITE: Clase BoardGroup que agrupe celdas y subgrupos uniformemente. 4) ENTIDAD RAÍZ (Aggregate Root) Y PATRÓN STRATEGY: LevelDefinition con id, levelNumber, difficulty (EASY, MEDIUM, HARD) y board, interfaz IScoreStrategy, método calculateScore en LevelDefinition, e interfaz ILevelRepository con métodos de persistencia.

**Resultado obtenido.**

| Componente | Ubicación | Responsabilidad |
|------------|-----------|-----------------|
| Direction | `src/domain/value-objects/Direction.ts` | Enum con las 4 direcciones cardinales |
| Position | `src/domain/value-objects/Position.ts` | Value Object inmutable (row, col) |
| Cell (abstracta) | `src/domain/entities/Cell.ts` | Contrato base para todas las celdas |
| ArrowCell / WallCell / EmptyCell / ExitCell | `src/domain/entities/*.ts` | Subtipos de celda (Liskov Substitution) |
| BoardComponent / BoardGroup | `src/domain/entities/` | Patrón Composite (luego reemplazado) |
| CellFactory | `src/domain/factories/CellFactory.ts` | Factory Method con validación |
| LevelDefinition | `src/domain/entities/LevelDefinition.ts` | Aggregate Root + `IScoreStrategy` + `ILevelRepository` |

**Modificaciones realizadas por el equipo al resultado de la IA.**

- Se agregaron comentarios detallados en cada constructor y método (JSDoc) para documentación interna.
- Se validó que el código respete la regla de dependencia (de afuera hacia adentro) y que el dominio sea 100 % puro.

**Lecciones aprendidas o limitaciones identificadas.**

- La IA fue excelente para diseñar una arquitectura completa de dominio puro respetando Clean Architecture y DDD desde el inicio.
- Es crítico verificar manualmente que todas las carpetas se creen físicamente en el repositorio, no solo propuestas conceptualmente.
- El código puro del dominio facilita testeabilidad y mantenibilidad, pero requiere capas de aplicación e infraestructura bien definidas para consumirlo.
- Es necesario documentar interfaces de puertos (`ILevelRepository`) en el dominio para que las capas externas conozcan el contrato a cumplir.
- El equipo debe revisar siempre los artefactos generados para asegurar que la capa de dominio permanezca puramente desacoplada.

---

## Consulta #2 — Extensión del dominio con User, PlayerProgress y patrones Builder/Template Method

**Problema abordado.**

Ampliar la Capa 1 de Dominio con nuevas entidades (`User`, `PlayerProgress`), puertos de repositorio (DIP), `LevelBuilder` y `BaseLevelProcessor` (Template Method), manteniendo TypeScript puro sin dependencias de frameworks, ORMs o librerías de infraestructura.

**Herramienta de IA utilizada.**

- GitHub Copilot Chat (modelo: Raptor mini Preview).

**Prompt o instrucción proporcionada.**

> Actúa como un Arquitecto de Software experto en Domain-Driven Design (DDD), Clean Architecture y principios SOLID. Estamos trabajando estrictamente en la Capa 1: Dominio (Domain Layer), por lo que todo el código generado debe ser TypeScript puro, sin dependencias de frameworks, ORMs, Express o librerías externas.
>
> Necesito que generes el código TypeScript completo, con tipado estricto y encapsulamiento robusto, para completar el dominio incorporando los requisitos del negocio y 2 patrones de diseño GoF adicionales (Builder y Template Method).
>
> Por favor, genera los siguientes archivos organizados por carpetas: 1) EN ENTITIES (`src/domain/entities/`): User.ts y PlayerProgress.ts con reglas de negocio. 2) EN REPOSITORIES (`src/domain/repositories/`): interfaces puras IUserRepository.ts, ILevelRepository.ts e IProgressRepository.ts. 3) PATRÓN CREACIONAL - BUILDER (`src/domain/builders/LevelBuilder.ts`). 4) PATRÓN DE COMPORTAMIENTO - TEMPLATE METHOD (`src/domain/rules/BaseLevelProcessor.ts`).
>
> Entrega los archivos con comentarios limpios que expliquen brevemente qué principio SOLID o patrón GoF se está cumpliendo en cada sección.

**Resultado obtenido.**

| Componente | Ubicación | Responsabilidad |
|------------|-----------|-----------------|
| User | `src/domain/entities/User.ts` | Entidad con reglas de negocio |
| PlayerProgress | `src/domain/entities/PlayerProgress.ts` | Progreso del jugador |
| Puertos | `src/domain/repositories/I*.ts` | Contratos DIP de persistencia |
| LevelBuilder | `src/domain/builders/LevelBuilder.ts` | Patrón Builder para niveles |
| BaseLevelProcessor | `src/domain/rules/BaseLevelProcessor.ts` | Template Method de acciones |

**Modificaciones realizadas por el equipo al resultado de la IA.**

- Se actualizó `LevelDefinition` para incluir `maxMoves` y `maxTimeInSeconds`, permitiendo que el Builder construya niveles con restricciones.
- Se aseguró que `LevelBuilder` mantuviera coherencia con la firma del constructor actualizado de `LevelDefinition`.
- Se validó que `User` y `PlayerProgress` incluyeran reglas de negocio puras sin dependencias externas.

**Lecciones aprendidas o limitaciones identificadas.**

- El dominio puro debe concentrar solo lógica de negocio y no incluir interfaces de persistencia dentro de entidades agregadas.
- El patrón Builder facilita la construcción de objetos complejos de dominio desde configuraciones externas.
- El Template Method permite definir un flujo de reglas de juego extensible para variantes de niveles.
- Es crítico asegurar que los patrones creacionales trabajen en coherencia con los constructores de las entidades que construyen.
- Siempre validar que el código TypeScript compile correctamente antes de considerar una consulta como completada.

---

## Consulta #3 — Fundamentos de Sprint 1 (framework HTTP, contrato de niveles, repos en memoria)

**Problema abordado.**

El repositorio solo tenía la capa de dominio; faltaban framework HTTP, endpoints, tests, CI y un contrato acordado para transportar niveles hacia el frontend. Se necesitaba montar Express + TypeScript, aspectos AOP mínimos (logging y manejo de errores), repositorios en memoria para los puertos existentes y el contrato `StructuredLevelJsonDto` con su primer consumidor (`LevelJsonMapper`).

**Herramienta de IA utilizada.**

- Claude Code (Anthropic), modelo Claude Sonnet 5, ejecutado como agente con acceso a la terminal y al sistema de archivos del repositorio.

**Prompt o instrucción proporcionada.**

> Avanza con la Fase 1 del plan de Sprint 1 aprobado: monta Express + TypeScript sobre el dominio ya existente, agrega los middlewares de logging y manejo de errores como aspectos AOP, crea los repositorios en memoria para los puertos ya definidos, y construye `docs/contract/level.contract.ts` + `LevelJsonMapper` para el contrato de niveles acordado con el equipo de frontend (incluyendo `exit` y `walls`, que el dominio ya soporta con `ExitCell`/`WallCell` pero el contrato original no representaba). Corre `npm run build`, `npm run lint` y `npm test` para verificar.

**Resultado obtenido.**

| Componente | Ubicación | Responsabilidad |
|------------|-----------|-----------------|
| Servidor HTTP | `src/infrastructure/http/server.ts`, `src/main.ts` | Express, CORS, helmet, Swagger, `GET /health` |
| AOP | `requestLogger.middleware.ts`, `errorHandler.middleware.ts` | Logging y errores centralizados |
| Repos en memoria | `src/infrastructure/persistence/in-memory/` | `InMemory*Repository` para los 3 puertos |
| Contrato | `docs/contract/level.contract.ts` | `StructuredLevelJsonDto` compartido con frontend |
| Mapper | `src/infrastructure/mappers/LevelJsonMapper.ts` | Wire ↔ dominio vía `LevelBuilder`/`CellFactory` |
| Tests | `ArrowCell.spec.ts`, `LevelJsonMapper.spec.ts`, `health.spec.ts` | Unitarios e integración con supertest |
| CI | `.github/workflows/ci.yml` | Lint + build + test en PR/push a `main` |

**Modificaciones realizadas por el equipo al resultado de la IA.**

- Se agregó `Difficulty.EXPERT` a `LevelDefinition.ts` para coincidir con el `LevelDifficulty` de 4 niveles del frontend.
- Se ajustó `@typescript-eslint/no-unused-vars` en `.eslintrc.cjs` (`args: 'none'`) en vez de modificar `BaseLevelProcessor.ts`.
- Se destrackeó `node_modules/` (más de 5000 archivos comiteados) y se agregó `.gitignore`.
- Se corrigió el fixture del mapper: tablero 5×5 en vez de 4×4 (posiciones hasta fila/columna 4).

**Lecciones aprendidas o limitaciones identificadas.**

- Revisar el `.gitignore` antes de `npm install` en repos heredados evita comitear accidentalmente `node_modules`.
- Mantener el endpoint HTTP de `/levels` fuera de Sprint 1 (solo mapper + prueba) permitió enfocar el sprint en la plomería sin sobre-comprometerse.

---

## Consulta #4 — Board como Aggregate Root con lógica de negocio pura

**Problema abordado.**

Auditoría y refactorización del agregado Board (anteriormente BoardGroup): `BoardGroup` no era un Aggregate Root real, faltaba matriz bidimensional y lógica de negocio central. Implementar Regla de Bloqueo (línea de visión) y Regla de Despeje; eliminar el Composite innecesario; crear `BoardDimensions` como Value Object.

**Herramienta de IA utilizada.**

- GitHub Copilot Chat (modelo: Claude Haiku 4.5).

**Prompt o instrucción proporcionada.**

> Actúa como un Arquitecto de Software Senior experto en Domain-Driven Design (DDD) y Clean Architecture en TypeScript. Necesito que verifiques la lógica del Dominio (Capa 1) para la entidad o agregado del tablero, asegurando que sea código TypeScript puro, sin dependencias de frameworks, Express o bases de datos.
>
> Mecánica exacta del juego: 1) El tablero es una cuadrícula que solo contiene EmptyCell y ArrowCell. 2) Cada flecha tiene dirección fija que nunca cambia. 3) Al interactuar, la flecha intenta dispararse en su dirección. 4) Regla de Bloqueo: verificar línea de visión; si hay otra flecha en el camino, el movimiento está bloqueado. 5) Regla de Despeje: si el camino está libre, la flecha sale y su celda pasa a EmptyCell.

**Resultado obtenido.**

| Componente | Ubicación | Responsabilidad |
|------------|-----------|-----------------|
| BoardDimensions | `src/domain/value-objects/BoardDimensions.ts` | Value Object con rows/cols y validación |
| Board | `src/domain/aggregates/Board.ts` | Aggregate Root: `interactWithCell`, `isPathClear`, despeje |

**Evaluación técnica.**

- 100 % del análisis arquitectónico y código de `Board.ts` y `BoardDimensions.ts` generado por IA.
- Cobertura de reglas de negocio: las 5 mecánicas del juego implementadas y validadas.
- Principios SOLID: SRP, OCP, DIP. Patrones: Aggregate Root, Value Object, métodos privados para encapsulación.

**Modificaciones realizadas por el equipo al resultado de la IA.**

- `BoardGroup.ts` quedó deprecado; `Board` es el modelo vigente.

**Lecciones aprendidas o limitaciones identificadas.**

- El uso de Aggregate Root con matriz bidimensional es más semánticamente correcto que Composite para un tablero de juego.
- La Regla de Bloqueo con `isPathClear()` es clara, eficiente y cumple la mecánica del juego.
- No forzar Composite cuando la semántica de dominio no lo requiere.
- Impacto crítico: se corrigió una violación fundamental de DDD que habría complicado las capas superiores.
- Recomendación futura: considerar Observer o Event Sourcing si se requiere notificar cambios del tablero.

---

## Consulta #5 — Auditoría y corrección de la Capa de Dominio

**Problema abordado.**

Auditar a fondo la Capa 1 antes de subir capas: bugs en `PlayerProgress`, `Board.addArrow`, `grid` desincronizado; paredes que no bloqueaban; falta de mapper `LevelDefinition` → `Board`; código muerto Composite; huecos de cobertura de tests.

**Herramienta de IA utilizada.**

- Claude Code (Anthropic), modelo Claude Sonnet 5, en modo conversación guiada.

**Prompt o instrucción proporcionada.**

> Revisa bien la capa de dominio, dime qué puede mejorarse o qué falta.

Tras el listado de hallazgos, el equipo aprobó un plan de 5 fases (limpieza, bugs, paredes, mapper, cobertura de tests) con comentarios en español y sin commit automático.

**Resultado obtenido.**

| Componente | Ubicación | Responsabilidad |
|------------|-----------|-----------------|
| Board | `src/domain/aggregates/Board.ts` | `addArrow` con anti-solapamiento; `addWall`; `isSolved` |
| PlayerProgress | `src/domain/entities/PlayerProgress.ts` | `completed` explícito en `updateScore` |
| DirectionVector | `src/domain/value-objects/DirectionVector.ts` | Vector compartido (antes duplicado) |
| LevelToBoardMapper | `src/domain/services/LevelToBoardMapper.ts` | Puente autoría → tablero jugable |
| FireArrowLevelProcessor | `src/domain/rules/FireArrowLevelProcessor.ts` | Subclase concreta del Template Method |
| ArrowBodyCell | `src/domain/entities/ArrowBodyCell.ts` | Soporte multi-celda con `arrowId` |
| Tests | `src/domain/**/*.test.ts` | ~29 tests nuevos; suite 31 → 65 |

**Modificaciones realizadas por el equipo al resultado de la IA.**

- "Completado" = `Board.isSolved()`, no inferencia por puntaje.
- Eliminación total del Composite deprecado (`BoardComponent`, `BoardGroup`).
- Opción completa para mapper: `arrowId`/`ArrowBodyCell` para flechas multi-celda.
- Sin `git commit`/`git push` automático.

**Lecciones aprendidas o limitaciones identificadas.**

- Bugs como `grid` desincronizado solo aparecen trazando uso real entre servicios y tests.
- Extender el modelo de autoría para cuerpos multi-celda tocó 5 archivos para mantener invariantes.
- `BoardRenderer` accedía a privados de `Arrow`; se corrigió con getters (`getHead()`, `getId()`).
- Pendiente: extender DTO externo con `walls` y conectar mapper con Capa 2.

---

## Consulta #6 — Fusión de ramas y construcción de la Capa 2 (Use Cases)

**Problema abordado.**

`feature/use-cases-layer` carecía de infraestructura de Sprint 1; `src/application/` vacío. Antes de Capa 2, el código fusionado de `feature/backend-foundations` no compilaba (`BoardGroup` inexistente, `InMemoryProgressRepository` incompleto, Jest duplicado).

**Herramienta de IA utilizada.**

- Claude Code (Anthropic), modelo Claude Sonnet 5, en modo planificación explícita.

**Prompt o instrucción proporcionada.**

> Vamos con los casos de uso.

El agente propuso fusión, corrección de bugs, puertos de aplicación, errores tipados, DTOs y 7 casos de uso con tests; el equipo aprobó el plan.

**Resultado obtenido.**

| Componente | Ubicación | Responsabilidad |
|------------|-----------|-----------------|
| Capa 2 | `src/application/use-cases/` | 7 casos de uso (auth, progreso, niveles, leaderboard) |
| Errores tipados | `src/application/errors/` | `ApplicationError` con `statusCode` HTTP |
| DTOs | `src/application/dto/` | Auth y Progress |
| ITokenService | `src/application/ports/` | Puerto de sesión JWT |
| LevelJsonMapper | `src/infrastructure/mappers/LevelJsonMapper.ts` | Reescrito sin `BoardGroup`; `toDto()` añadido |
| Tests | `tests/unit/application/` | 16 tests AAA nuevos; 25 suites / 90 tests en verde |

**Modificaciones realizadas por el equipo al resultado de la IA.**

- Fixture de `LevelJsonMapper.spec.ts` corregido (cabeza/cuerpo duplicados).
- Alcance limitado a Capa 2; rutas HTTP quedaron para Consulta #7.
- Commit multilínea vía `git commit -F` por fallo de parseo en PowerShell.

**Lecciones aprendidas o limitaciones identificadas.**

- Fusionar ramas en paralelo exige re-verificar integración, no solo el verde aislado de cada rama.
- `InMemoryProgressRepository` compilaba pero no implementaba `getLeaderboardByLevel` hasta invocarlo con la firma exacta.
- `ITokenService` separado de puertos de dominio clarifica orquestación vs. reglas de juego.

---

## Consulta #7 — Reparación de `develop` y construcción de la Capa 3 (rutas HTTP)

**Problema abordado.**

Merge manual defectuoso dejó 5 archivos corruptos en `develop`; CI solo corría en `main`. Con `develop` sano, faltaba Capa 3 HTTP y implementaciones reales de `IPasswordHasher`/`ITokenService`.

**Herramienta de IA utilizada.**

- Claude Code (Anthropic), modelo Claude Sonnet 5, agente autónomo con aprobación explícita.

**Prompt o instrucción proporcionada.**

> Ahora vamos a trabajar en la rama develop [...] necesito que hagas una revisión exhaustiva del repositorio y busques inconsistencias [...] es para dejarlo completamente limpio y funcional.

Tras confirmar corrupción: "Sí, restaura los 5 archivos y corre la suite completa". Luego: "Ambos, CI primero" (CI + rutas HTTP).

**Resultado obtenido.**

| Componente | Ubicación | Responsabilidad |
|------------|-----------|-----------------|
| Restauración | 5 archivos desde commit `020115c` | `tsconfig.json`, mappers, repos, specs |
| CI | `.github/workflows/ci.yml` | También en `develop` y PRs hacia `develop` |
| Seguridad | `BcryptPasswordHasher`, `JwtTokenService` | Implementaciones reales |
| HTTP | `src/infrastructure/http/routes/*.ts` | auth, progress, leaderboard, levels |
| Composition root | `container.ts` | Wiring de casos de uso |
| Tests | `tests/integration/*.spec.ts` | 12 tests supertest nuevos |

**Modificaciones realizadas por el equipo al resultado de la IA.**

- Confirmación explícita antes de push y restauración.
- Schemas Zod de login separados del registro (bug 400 vs 401 detectado con `curl`).
- Branch protection en `develop` no activado (fuera de alcance pedido).

**Lecciones aprendidas o limitaciones identificadas.**

- Tests no detectaron el bug de contraseña corta en login; hizo falta probar la API viva con `curl`.
- Restaurar desde commit conocido-bueno fue más seguro que re-diagnosticar línea por línea.
- CI mal alcanzado (solo `main`) da falsa confianza de "está en verde".

---

## Consulta #8 — Primera corrida real de CI en `develop` (deuda de lint)

**Problema abordado.**

Tras Consulta #7, la primera ejecución real de GitHub Actions en `develop` falló en `npm run lint` con 3 errores documentados como deuda conocida pero nunca ejercitados por CI.

**Herramienta de IA utilizada.**

- Claude Code (Anthropic), modelo Claude Sonnet 5, agente con acceso a terminal.

**Prompt o instrucción proporcionada.**

> Verifica el repositorio.

Instrucción implícita tras confirmar push; el agente corrigió el lint al detectar el fallo de CI.

**Resultado obtenido.**

| Componente | Ubicación | Responsabilidad |
|------------|-----------|-----------------|
| CellFactory.test.ts | `src/domain/factories/` | Import sin usar eliminado |
| CellFactory.ts | `src/domain/factories/CellFactory.ts` | `{}` → `Record<never, never>` |
| LevelActionService.ts | `src/domain/services/` | `eslint-disable` documentado en `while (true)` intencional |
| CI remoto | GitHub Actions | Lint + build + test en verde sobre `develop` |

**Modificaciones realizadas por el equipo al resultado de la IA.**

- Ninguna — cambios de una línea cada uno.

**Lecciones aprendidas o limitaciones identificadas.**

- Deuda "fuera de alcance" solo se vuelve visible cuando CI la ejercita.
- Verificar checks en GitHub, no solo comandos locales, antes de cerrar la consulta.

---

## Consulta #9 — Backend operativo: seed de catálogo y middleware JWT (Día 2)

**Problema abordado.**

Completar el segundo bloque crítico del plan de integración (5 días): hacer el backend **operable sin configuración manual** al arrancar y cerrar el **tercer aspecto AOP** (autorización JWT) exigido por la rúbrica académica.

**Herramienta de IA utilizada.**

- Cursor AI (asistente integrado en el IDE).

**Prompt o instrucción proporcionada.**

> Implementar en `BackEnd-ArrowMaze` (rama `develop`): (1) seed idempotente de `StructuredLevelJsonDto` en `InMemoryLevelRepository` al bootstrap; (2) middleware JWT (`Authorization: Bearer`) en rutas mutantes `POST /progress/sync` y `PUT /levels/:id`; (3) documentación dartdoc/TSDoc en español por función; (4) registro en `AI_USAGE.md`.

**Resultado obtenido.**

| Componente | Ubicación | Responsabilidad |
|------------|-----------|-----------------|
| Catálogo seed | `src/infrastructure/persistence/seed/levelSeedCatalog.ts` | 5 niveles wire-format (`simple-1` … `level-05`), validables por `UpsertLevelUseCase` |
| Orquestador seed | `src/infrastructure/persistence/seed/seedLevelCatalog.ts` | Itera catálogo → `upsertLevel.execute()` |
| Middleware JWT | `src/infrastructure/http/middlewares/auth.middleware.ts` | Extrae Bearer, `ITokenService.verify`, adjunta `req.auth` |
| Error 401 | `src/application/errors/UnauthorizedError.ts` | Mapeo HTTP vía `errorHandlerMiddleware` |
| Tipos Express | `src/infrastructure/http/types/express.d.ts` | `Request.auth?: TokenPayload` |
| Bootstrap | `src/main.ts` | `createServer(jwtSecret, { seedLevels: true })` antes de `listen` |
| Rutas | `progress.routes.ts`, `levels.routes.ts` | JWT solo en mutaciones; `GET /levels*` público |
| Tests | `tests/integration/seed.spec.ts`, helpers `authTestHelper.ts` | Seed on/off + Bearer en integración |

**Contrato de arranque (`createServer`).**

```typescript
export interface CreateServerOptions {
  seedLevels?: boolean; // default false (tests); true en main.ts
}

export async function createServer(
  jwtSecret?: string,
  options?: CreateServerOptions,
): Promise<Express>;
```

**Rutas y seguridad.**

| Método | Ruta | JWT |
|--------|------|-----|
| `GET` | `/levels`, `/levels/:id` | No |
| `PUT` | `/levels/:id` | Sí |
| `POST` | `/progress/sync` | Sí |
| `POST` | `/auth/register`, `/auth/login` | No |

**Modificaciones realizadas por el equipo al resultado de la IA.**

- (Pendiente de revisión tras merge.)

**Lecciones aprendidas o limitaciones identificadas.**

- `createServer` pasó a **async** para garantizar seed completo antes de aceptar tráfico; los tests de integración deben `await createServer(...)`.
- El seed reutiliza `UpsertLevelUseCase` (misma validación de solvabilidad que `PUT` manual); niveles del catálogo deben pasar `LevelSolvabilityValidator`.
- Pendiente Día 2 frontend: `RemoteLevelRepository` consumiendo `GET /levels` ya poblado.

---

## Consulta #10 — Ampliación del catálogo seed a 15 niveles (Día 3 backend)

**Problema abordado.**

Completar el primer entregable del **Día 3** del plan de integración: garantizar que el backend arranque con un catálogo **jugable y suficiente** (15 niveles en `StructuredLevelJsonDto`) para alimentar `GET /levels` y la app Flutter vía `RemoteLevelRepository`, sin intervención manual (`PUT`).

**Herramienta de IA utilizada.**

- Cursor AI (asistente integrado en el IDE).

**Prompt o instrucción proporcionada.**

> Extender el seed del backend (`BackEnd-ArrowMaze`, rama `develop`) de 5 a 15 niveles wire-format validables por `LevelSolvabilityValidator` y `UpsertLevelUseCase`; modularizar el catálogo, añadir tests de invariantes/solvabilidad, documentar cada módulo con TSDoc en español y registrar la consulta en `AI_USAGE.md`.

**Resultado obtenido.**

| Componente | Ubicación | Responsabilidad |
|------------|-----------|-----------------|
| Bloque 1–5 | `seed/catalogEntries/seedLevels01to05.ts` | Niveles existentes + `simple-1` canónico |
| Bloque 6–10 | `seed/catalogEntries/seedLevels06to10.ts` | Tutorial vertical/horizontal, paralelo, cadena |
| Bloque 11–15 | `seed/catalogEntries/seedLevels11to15.ts` | Muros, cuerpos, EXPERT con desbloqueo en cadena |
| Ensamblador | `levelSeedCatalog.ts` | `LEVEL_SEED_CATALOG`, `LEVEL_SEED_CATALOG_SIZE = 15`, `assertSeedCatalogInvariants()` |
| Orquestador | `seedLevelCatalog.ts` | Retorna `SeedLevelCatalogResult { seeded, expected }` |
| Bootstrap | `server.ts` / `main.ts` | Log `Level seed: 15/15 niveles cargados` |
| Tests unitarios | `tests/unit/infrastructure/levelSeedCatalog.spec.ts` | Solvabilidad por nivel + ids únicos |
| Tests integración | `tests/integration/seed.spec.ts` | `GET /levels` devuelve 15 entradas incl. `level-15` |

**Progresión de dificultad.**

| Rango | IDs | Dificultad predominante |
|-------|-----|-------------------------|
| 1–5 | `simple-1` … `level-05` | EASY → HARD (existentes) |
| 6–10 | `level-06` … `level-10` | EASY → MEDIUM |
| 11–15 | `level-11` … `level-15` | MEDIUM → EXPERT |

**Verificación local.**

```bash
cd BackEnd-ArrowMaze
npm run lint && npm test
npm run dev
curl http://localhost:3000/levels | jq length   # debe ser 15
```

**Modificaciones realizadas por el equipo al resultado de la IA.**

-Ninguna  cambios de una línea cada uno.

**Lecciones aprendidas o limitaciones identificadas.**

- Cada nivel nuevo debe pasar `levelSeedCatalog.spec.ts` antes del merge; un layout “intuitivo” puede ser irresoluble según el backtracking del validador.
- `maxMoves` del seed debe ser holgado respecto a la ruta óptima del frontend (`LevelDtoMapper` rechaza `optimalMoves > maxMoves`).
- Siguiente paso del plan (Día 4): login/registro + `POST /progress/sync` al ganar.

---

## Consulta #11 — Suite E2E HTTP del catálogo sembrado (Día 3 backend)

**Problema abordado.**

Complementar el Día 3 con pruebas de integración HTTP que validen que el catálogo de **15 niveles** sembrado al arrancar es consultable vía API y cumple el esquema mínimo de `StructuredLevelJsonDto` consumido por Flutter.

**Herramienta de IA utilizada.**

- Cursor AI (asistente integrado en el IDE).

**Prompt o instrucción proporcionada.**

> Diseñar e implementar una suite E2E HTTP en `BackEnd-ArrowMaze` que verifique `GET /levels` (exactamente 15 entradas) y `GET /levels/:id` para cada identificador del catálogo seed, con aserciones de schema wire-format. Documentar la consulta en `AI_USAGE.md`.

**Resultado obtenido.**

| Archivo | Responsabilidad |
|---------|-----------------|
| `tests/e2e/catalog-http-playable.spec.ts` | Validación de schema y fetch individual por `id` |

**Modificaciones realizadas por el equipo al resultado de la IA.**

- Ninguna — cambios de una línea cada uno.

**Lecciones aprendidas o limitaciones identificadas.**

- Este E2E valida contrato HTTP, no jugabilidad en Flutter; la capa de dominio/juego se cubre en el repo frontend (`test/e2e/wire_format_playability_e2e_test.dart`).

---

## Consulta #12 — Verificación integral del sistema (Día 3 — ejecución E2E)

**Problema abordado.**

Ejecutar la **prueba de sistema completa** acordada en el plan de integración: validar que backend y frontend funcionan de punta a punta (seed de 15 niveles, API HTTP, suite de tests automatizados) y corregir los defectos detectados durante la verificación antes de cerrar el Día 3.

**Herramienta de IA utilizada.**

- Cursor AI (asistente integrado en el IDE).

**Prompt o instrucción proporcionada.**

> Ejecutar la verificación integral del sistema Arrow Maze (backend `BackEnd-ArrowMaze` + frontend `Arrow-Maze-Escape-Puzzle`): correr `npm test` y levantar el servidor con seed; confirmar `GET /health` y `GET /levels` (15 niveles); ejecutar `flutter analyze` y `flutter test` (incluida la suite `test/e2e`); corregir los fallos encontrados; documentar resultados y parámetros de verificación en `AI_USAGE.md`.

**Parámetros y comandos de verificación.**

| Capa | Comando | Criterio de éxito |
|------|---------|-------------------|
| Backend — lint | `npm run lint` | Exit code 0 |
| Backend — tests | `npm test` | 127/127 tests passed |
| Backend — API | `npm run dev` + `curl /health` | `{"status":"ok"}` |
| Backend — catálogo | `curl /levels` | Array de longitud **15** |
| Frontend — análisis | `flutter analyze` | Sin issues |
| Frontend — tests | `flutter test` | 49/49 tests passed |
| Frontend — E2E | `flutter test test/e2e` | 11/11 tests passed |

**Resultado obtenido (ejecución real).**

| Métrica | Valor final |
|---------|-------------|
| Test suites backend | 31 passed |
| Tests backend | **127 passed**, 0 failed |
| `GET /levels` | **15** niveles (`simple-1` … `level-15`) |
| Tests frontend | **49 passed**, 0 failed |

**Correcciones aplicadas durante la verificación.**

| Defecto detectado | Archivo | Corrección |
|-------------------|---------|------------|
| Seed fallaba: `ExitCell` sobrescrita por flechas | `LevelJsonMapper.ts` | Colocar `ExitCell` **después** de `addArrow()` |
| `req.auth` no tipado en runtime (`ts-node-dev`) | `express-augment.ts`, `server.ts` | Módulo de ampliación importable; eliminar `express.d.ts` problemático |
| Suites de integración no cargaban | `auth.middleware.ts` | Quitar import inválido de `../types/express` |

**Fragmento de corrección (`LevelJsonMapper`):**

```typescript
for (const arrow of dto.arrows) {
  builder.addArrow(/* ... */);
}
// La salida se aplica al final para que cabezas/cuerpos no la sobrescriban.
builder.addCell(dto.exit.row, dto.exit.col, this.cellFactory.createCell('ExitCell'));
```

**Modificaciones realizadas por el equipo al resultado de la IA.**

- Ninguna — cambios de una línea cada uno.

**Lecciones aprendidas o limitaciones identificadas.**

- El orden de materialización en `LevelJsonMapper` (muros → flechas → salida) es crítico: un `ExitCell` colocado antes de las flechas puede desaparecer si una cabeza/cuerpo ocupa la misma coordenada.
- Los archivos `.d.ts` de ampliación de Express no siempre se resuelven en `ts-node-dev`; un módulo `.ts` importado desde `server.ts` es más fiable en desarrollo y tests.
- La verificación automatizada del backend (127 tests) no sustituye la prueba manual Flutter ↔ API en dispositivo/emulador (CORS, IP de red).
- Siguiente paso del plan (Día 4): autenticación en la app y `POST /progress/sync` al completar un nivel.

---

## Consulta #13 — Reconciliación de `main` y `develop` antes de fusionar (PR hacia `main`)

**Problema abordado.**

Al abrir el Pull Request de `develop` hacia `main` para consolidar todo el trabajo del proyecto (`gh pr create ... --base main --head develop`), GitHub lo marcó como `CONFLICTING`: `main` tenía 1 commit propio (`b0f81e9`, "agregar validación de tablero, solvabilidad y lógica de scoring para niveles") que nunca se integró a `develop`, resultado de una fusión manual antigua de este repositorio (documentada como recurrente en las Consultas #6-#8 de este mismo archivo). Había que reconciliar ambas ramas sin perder trabajo real ni reintroducir el tipo de corrupción de merge ya sufrido antes.

**Herramienta de IA utilizada.**

- Claude Code (Anthropic), modelo Claude Opus 4.8, agente con acceso a terminal, en modo autónomo tras autorización explícita del equipo (sesión nocturna sin supervisión directa).

**Prompt o instrucción proporcionada (transcripción literal o paráfrasis fiel).**

> Ok, fusionemos las ramas. [...] Te voy a dejar en modo automático, ¿crees que puedas hacer esto que resta por tu cuenta sin comprometer la integridad del repositorio? De hacer commit y push a las ramas. Tengo sueño y necesito dormir.

**Resultado obtenido (fragmento de código, diseño, explicación).**

- Diagnóstico: 4 archivos con conflicto real de Git (`Board.ts`, `BoardRenderer.ts`, `LevelActionService.ts`, `LevelSolvabilityValidator.ts`) — confirmado, comparando tamaños y contenido, que la versión de `develop` era estrictamente más evolucionada en los cuatro (p. ej. `LevelActionService` en `develop` ya usa el helper compartido `getStep()` en vez de duplicar el switch de dirección, exactamente la convención documentada en este mismo repo).
- Al fusionar `origin/main` en una rama de prueba primero (`tmp-merge-check`), tras resolver los 4 conflictos a favor de `develop`, el build (`tsc`) siguió fallando: aparecieron 5 archivos **huérfanos** que solo existían en `main` (`Level.ts`, `LevelFactory.ts`, y 3 archivos de `services/scoring/`) — un aggregate y una estrategia de scoring paralelos, ya superados por `LevelDefinition.ts`/`LevelBuilder` en `develop`, sin ningún archivo fuera del propio clúster que los referenciara (verificado con `grep` antes de borrar). Se eliminaron los 5.
- **Hallazgo más importante**: `Arrow.ts` (la entidad, no un test) se fusionó *sin marcarse como conflicto* pero terminó con el contenido de `main`, no el de `develop` — un caso de fusión silenciosa incorrecta que `git merge` no señala como error. Las dos versiones tienen semántica distinta (`getAllPositions()` en `main` devuelve cabeza+cuerpo combinados; en `develop`, solo las celdas de cuerpo, con `occupies()` verificando la cabeza aparte), y el resto del dominio (`Board`, `CollisionValidator`) está escrito contra la semántica de `develop`. Se forzó `git checkout develop -- Arrow.ts`.
- Al repetir la reconciliación real sobre `develop` (no solo en la rama de prueba), aparecieron **2 archivos huérfanos adicionales** (`ArrowDefinition.ts`, `LeaderboardService.ts`) que no habían aparecido en la prueba anterior — mismo patrón, mismo criterio de eliminación tras verificar ausencia de referencias externas.
- Se construyó una auditoría sistemática (no solo revisión manual) para detectar más casos de "fusión silenciosa incorrecta": por cada archivo que `main` modificó desde el ancestro común y que también existe en `develop`, comparar el contenido resultante contra `develop` (ignorando fin de línea) y señalar cualquier discrepancia real. Confirmó que, tras las correcciones, ningún otro archivo quedó contaminado.
- Verificación final sobre `develop`: `npm run build` sin errores, `npm run lint` sin errores, `npm test` con **127/127 tests en verde** (31 suites), igual que antes de la reconciliación.

**Modificaciones realizadas por el equipo al resultado de la IA:**

- El equipo autorizó explícitamente automatizar el resto de la tarea (commit + push) antes de desconectarse, con la condición explícita de "no comprometer la integridad del repositorio".
- Un intento previo de fusionar directamente hacia `main` con `git push` fue bloqueado automáticamente por el clasificador de permisos del agente (acción de alto riesgo — push directo a la rama por defecto sin revisión); el equipo, consultado, prefirió abrir Pull Requests en vez de push directo tanto para el backend como para el frontend, y el agente respetó ese límite incluso en modo automático: la reconciliación se aplicó y pusheó a `develop` (rama de integración, no protegida), dejando el PR #12 (`develop` → `main`) abierto para revisión humana en vez de fusionarlo automáticamente.

**Lecciones aprendidas o limitaciones identificadas:**

- `git merge` no marca como conflicto un archivo que un solo lado modificó — pero si ese archivo fue reescrito de forma independiente y contradictoria en ambas ramas sin overlap línea a línea (como pasó con `Arrow.ts`, editado en `main` sin que `develop` lo tocara desde el ancestro común, pero con **otro** commit de `develop` reescribiéndolo por completo más tarde de forma no detectada por el 3-way merge), el resultado puede ser semánticamente incorrecto sin que Git lo señale. La única defensa real es auditar explícitamente cada archivo que ambas ramas tocaron, no confiar en "0 conflictos reportados" como sinónimo de "merge correcto".
- Repetir la reconciliación en una rama de prueba primero (`tmp-merge-check`, descartable) antes de tocar `develop` de verdad permitió detectar y corregir el problema de `Arrow.ts` sin arriesgar la rama real — pero el segundo intento (ahora sí sobre `develop`) reveló *más* archivos huérfanos que la prueba no había mostrado, confirmando que ni siquiera un ensayo previo garantiza cobertura completa; hay que re-auditar cada vez que se repite la operación, no asumir que "ya se probó una vez".
- El límite de autorización (PRs sí, push directo a `main` no) establecido explícitamente por el equipo en la sesión se respetó incluso en modo automático sin supervisión — la autonomía otorgada ("puedes hacer commit y push a las ramas") no se interpretó como autorización implícita para expandir el alcance a la rama protegida.

---

## Consulta #14 — Endpoint `GET /progress` para descarga de progreso del jugador

**Problema abordado.**

El backend solo exponía `POST /progress/sync` (subir progreso), lo que hacía la sincronización unidireccional: el cliente subía sus victorias pero no había forma de recuperarlas al iniciar sesión desde otro dispositivo o una sesión limpia. El equipo detectó que esto contradice el propósito real del ítem 5.2.2 del enunciado ("sincronizar el progreso del jugador con el servidor") — que el progreso sea del jugador y viva en el servidor, no solo en el dispositivo. Se pidió agregar el endpoint de descarga que cierra el ciclo.

**Herramienta de IA utilizada.**

- Claude Code (Anthropic), modelo Claude Sonnet 5, agente con acceso a terminal.

**Prompt o instrucción proporcionada (transcripción literal o paráfrasis fiel).**

"Sí, impleméntalo, endpoint GET y pull+merge al login [...]" — la parte de backend de una tarea que abarcó ambos repos (el pull+merge del lado cliente se documenta en el `AI_USAGE.md` del repo `Arrow-Maze-Escape-Puzzle`, Consulta #19).

**Resultado obtenido (fragmento de código, diseño, explicación).**

| Componente | Ubicación | Responsabilidad |
|------------|-----------|-----------------|
| Puerto | `src/domain/repositories/IProgressRepository.ts` | Nuevo método `findAllByUser(userId)` |
| Implementación | `src/infrastructure/persistence/in-memory/InMemoryProgressRepository.ts` | Filtra el mapa de progreso por `userId` |
| Caso de uso | `src/application/use-cases/GetPlayerProgressUseCase.ts` | Devuelve `PlayerProgressListDto` con todos los niveles del usuario |
| DTO | `src/application/dto/ProgressDtos.ts` | `PlayerProgressListDto` |
| Ruta | `src/infrastructure/http/routes/progress.routes.ts` | `GET /progress` protegido por JWT; `userId` tomado de `req.auth`, nunca del cliente (un usuario no puede leer el progreso de otro) |
| Wiring | `src/infrastructure/http/container.ts` | `getPlayerProgress` en el `AppContainer` |
| Doc | `src/infrastructure/http/openapi/openapi.json` | Schema de respuesta documentado en Swagger |
| Tests | `tests/unit/application/GetPlayerProgressUseCase.spec.ts` (2), `tests/integration/progress-leaderboard.spec.ts` (+3: 401 sin JWT, devuelve lo sincronizado, vacío para usuario nuevo) | — |

Decisión de seguridad: el `userId` proviene exclusivamente del JWT verificado (`req.auth!.userId`), no de un parámetro de query o path — así el endpoint no puede usarse para leer el progreso de otro usuario. La regla "mejor de ambos" al fusionar vive en el cliente (`PlayerProgress.mergeRemoteLevel`); este endpoint solo expone lo persistido.

**Modificaciones realizadas por el equipo al resultado de la IA.**

- Ninguna corrección posterior; `npx tsc --noEmit` limpio y suite completa en verde (unitarios + integración) antes de dar por terminado. Se corrigieron los stubs de `IProgressRepository` en los specs existentes (`SyncProgressUseCase`, `GetLeaderboardUseCase`) para incluir el nuevo método `findAllByUser`.

**Lecciones aprendidas o limitaciones identificadas.**

- Agregar un método a un puerto (`IProgressRepository`) rompe en tiempo de compilación todos los stubs de test que lo implementan — TypeScript los marca de inmediato, lo que es una ventaja frente a lenguajes más laxos: ningún stub quedó desactualizado silenciosamente.
- Limitación conocida (heredada del esquema): `PlayerProgress` del backend guarda `highScore/minMoves/minTimeInSeconds/isCompleted` pero no estrellas, así que el pull del cliente no puede restaurar la calificación en estrellas de otro dispositivo. Ampliar el esquema con `stars` sería la mejora natural si se quisiera fidelidad completa.

---

## Consulta #15 — Persistencia real con SQLite (usuarios, niveles y progreso sobreviven reinicios)

**Problema abordado.**

Al probar la sincronización de progreso entre ventanas/dispositivos, el equipo notó que reiniciar el proceso del backend (`npm run dev`) borraba todos los datos — los tres repositorios (`InMemoryUserRepository`, `InMemoryLevelRepository`, `InMemoryProgressRepository`) vivían solo en RAM, una decisión explícitamente diferida "a un sprint posterior" desde las primeras consultas (ver comentarios originales en esos archivos). Antes de decidir la tecnología, se discutió con el equipo relacional vs. no relacional y local vs. nube; se concluyó que los datos del proyecto son tabulares con consultas de agregación (leaderboard ordenado) — relacional es la elección técnicamente correcta — y que un motor embebido (sin servidor externo que levantar) es preferible a una base gestionada en la nube para una entrega académica con demo local.

**Herramienta de IA utilizada.**

- Claude Code (Anthropic), modelo Claude Sonnet 5, agente con acceso a terminal.

**Prompt o instrucción proporcionada (transcripción literal o paráfrasis fiel).**

"Sí. Enciende el backend" (tras una discusión previa comparando SQLite/NeDB/Postgres/local vs. nube) → "Sí, empieza con SQLite".

**Resultado obtenido (fragmento de código, diseño, explicación).**

| Componente | Ubicación | Responsabilidad |
|------------|-----------|-----------------|
| Bootstrap DB | `src/infrastructure/persistence/sqlite/Database.ts` | Abre/crea el archivo `.db` (o `:memory:` en tests), crea el esquema (`users`, `levels`, `progress`) si no existe |
| Repositorios | `SqliteUserRepository.ts`, `SqliteLevelRepository.ts`, `SqliteProgressRepository.ts` | Implementan los mismos puertos (`IUserRepository`, `ILevelRepository`, `IProgressRepository`) que ya usaban los casos de uso — DIP hizo el reemplazo transparente, cero cambios en dominio/aplicación/rutas |
| Entidad | `User.toPersistenceRecord()` | Accesor explícito para que infraestructura serialice el hash sin exponerlo para comparación (distinto de `verifyPassword`) |
| Wiring | `createContainer(jwtSecret, dbPath = ':memory:')`, `createServer(jwtSecret, { dbPath })`, `main.ts` (`DB_PATH` env var, default `data/arrowmaze.db`) | Tests siguen aislados por defecto (`:memory:`); producción persiste a archivo real |
| Serialización de niveles | `SqliteLevelRepository` reutiliza `LevelJsonMapper` (ya existente) para guardar el `StructuredLevelJsonDto` como JSON en una columna de texto, en vez de modelar `Cell[][]` relacionalmente | Evita sobre-ingeniería: el agregado es demasiado rico para columnas, pero el JSON de transporte ya existe |
| Limpieza | Se eliminaron `InMemoryUserRepository`, `InMemoryLevelRepository`, `InMemoryProgressRepository` (código muerto tras el reemplazo) | — |
| Tests nuevos | `tests/integration/sqlite-persistence.spec.ts` (3 casos: usuario, nivel y progreso sobreviven un "reinicio" simulado con dos instancias de `createServer` sobre el mismo archivo) | — |

**Modificaciones realizadas por el equipo al resultado de la IA.**

- Ninguna corrección posterior; `npx tsc --noEmit` limpio y suite completa en verde (33 suites, 135 tests) tras el cambio. Se verificó también manualmente en vivo: registrar un usuario, matar el proceso (`Stop-Process`), reiniciarlo, y hacer login exitoso con el mismo usuario contra el proceso nuevo.

**Lecciones aprendidas o limitaciones identificadas.**

- En Windows, `better-sqlite3` mantiene el archivo (y sus `.db-wal`/`.db-shm` de modo WAL) abierto con un handle nativo que no se libera de inmediato; el primer intento del test de persistencia fallaba con `EBUSY` al intentar borrar el directorio temporal en `afterEach`, incluso con reintentos de `fs.rmSync`. Como no hay una API pública de `close()` expuesta desde `createServer` (y agregarla infla el alcance de esta tarea), se optó por ignorar deliberadamente el error de limpieza del directorio temporal en el test — no afecta la aserción real (que los datos persistieron), solo la prolijidad del `afterEach`.
- Gracias al DIP ya aplicado desde el inicio del proyecto, cambiar de "sin persistencia real" a "SQLite" fue un cambio *puramente aditivo* en la capa de infraestructura: cero líneas tocadas en dominio, casos de uso o rutas HTTP — la mejor demostración práctica de por qué se exige ese principio.
- Decisión documentada explícitamente para la defensa: se eligió SQLite (relacional, embebido) en vez de una base NoSQL o un servicio en la nube porque (a) los datos del proyecto son tabulares con consultas de agregación, y (b) el enunciado solo pide la URL del repositorio como entregable, no un backend desplegado — depender de un servicio en la nube durante la sustentación añadiría un punto de falla innecesario sin exigirlo la rúbrica.

---

## Consulta #16 — Catálogo seed modular: un archivo JSON por nivel con descubrimiento automático

**Problema abordado.**

El catálogo inicial de 15 niveles vivía repartido en tres módulos TypeScript (`seedLevels01to05.ts`, `seedLevels06to10.ts`, `seedLevels11to15.ts`) ensamblados manualmente en `levelSeedCatalog.ts`, con una constante fija `LEVEL_SEED_CATALOG_SIZE = 15`. Ese diseño dificultaba añadir niveles (había que editar código, importar arrays y actualizar contadores en tests) y mezclaba la *autoría* del puzzle con la *infraestructura* de carga. Se solicitó migrar a un archivo JSON por nivel, con descubrimiento automático al arrancar, sin alterar el comportamiento observable del sistema (mismos 15 niveles, misma API, misma validación de solvabilidad).

**Herramienta de IA utilizada.**

- Cursor Agent (Composer), con acceso a lectura/escritura del repositorio y ejecución de tests.

**Prompt o instrucción proporcionada (transcripción literal o paráfrasis fiel).**

> Refactorizar el catálogo de niveles del backend para que cada nivel resida en un archivo JSON independiente, actualizando la infraestructura de seed y los tests necesarios para soportar descubrimiento automático del directorio, preservando el comportamiento actual del sistema (mismos 15 niveles, mismas respuestas HTTP y mismas reglas de validación) y documentando la consulta en `AI_USAGE.md`.

**Resultado obtenido (fragmento de código, diseño, explicación).**

| Componente | Ubicación | Responsabilidad |
|------------|-----------|-----------------|
| Fuente de datos | `levels/*.json` (raíz del repo) | Un `StructuredLevelJsonDto` por archivo; convención de nombre `NN-id.json` (p. ej. `01-simple-1.json`) |
| Loader | `src/infrastructure/persistence/seed/loadLevelCatalogFromDirectory.ts` | Lee todos los `*.json` del directorio (orden lexicográfico determinista), parsea y devuelve el catálogo |
| Ensamblador | `levelSeedCatalog.ts` | `LEVEL_SEED_CATALOG = loadLevelCatalogFromDirectory()`; `LEVEL_SEED_CATALOG_SIZE` derivado de `catalog.length` |
| Bootstrap | `seedLevelCatalog.ts` / `server.ts` | Sin cambios de contrato: sigue iterando el catálogo y llamando `UpsertLevelUseCase` |
| Eliminado | `seed/catalogEntries/*.ts` | Arrays TypeScript duplicados sustituidos por JSON |
| Tests nuevos | `tests/unit/infrastructure/loadLevelCatalogFromDirectory.spec.ts` (6 casos) | Carga del directorio real, equivalencia con `LEVEL_SEED_CATALOG`, ignorar no-JSON, errores de directorio vacío/JSON inválido |
| Tests existentes | `levelSeedCatalog.spec.ts`, `seed.spec.ts`, `catalog-http-playable.spec.ts` | Siguen en verde: 15 niveles, solvabilidad, `GET /levels` y `GET /levels/:id` |

Para añadir un nivel en el futuro: crear `levels/16-nuevo-id.json` válido según el contrato, reiniciar el servidor con `seedLevels: true` (o usar `PUT /levels/:id` con JWT). No hace falta tocar código TypeScript ni constantes de tamaño.

**Modificaciones realizadas por el equipo al resultado de la IA.**

- Ninguna — cambios de una línea cada uno.

**Lecciones aprendidas o limitaciones identificadas.**

- El nombre del archivo no define la progresión del jugador: la ordenación en juego sigue dependiendo de `levelNumber` dentro del JSON; el prefijo numérico en el nombre es solo convención editorial.
- `LEVEL_SEED_CATALOG_SIZE` deja de ser una constante mágica duplicada: al derivarse del catálogo cargado, los tests de integración que comparan contra `LEVEL_SEED_CATALOG.length` escalan solos al crecer el juego.
- El directorio `levels/` debe desplegarse junto al proceso Node (resuelto con `path.resolve(__dirname, '../../../../levels')` desde `dist/` o `src/`); no se empaqueta dentro de `dist/` — coherente con tratar los puzzles como datos editables fuera del bundle compilado.

---

## Consulta #17 — Hot-reload del catálogo con patrón Observer y botón de actualización en el cliente

**Problema abordado.**

Tras modularizar el seed en `levels/*.json` (Consulta #16), seguía siendo necesario reiniciar el backend para que un archivo nuevo llegara a SQLite, y la app mantenía el catálogo en caché en memoria sin forma de refrescarlo desde la UI. Se pidió cerrar el ciclo: observar cambios en disco en tiempo de ejecución (patrón Observer) y permitir al jugador pulsar un botón sencillo en la pantalla de niveles que vuelva a descargar el catálogo y muestre una notificación con el resultado.

**Herramienta de IA utilizada.**

- Cursor Agent (Composer), con acceso a lectura/escritura del repositorio y ejecución de tests.

**Prompt o instrucción proporcionada (transcripción literal o paráfrasis fiel).**

> Implementar recarga en caliente del catálogo de niveles mediante el patrón Observer en el backend (vigilancia de `levels/*.json` y sincronización automática con SQLite sin reiniciar el proceso), añadir en el cliente un botón de actualización en la pantalla de selección de niveles que invalide la caché local, vuelva a consumir `GET /levels` y muestre una notificación al usuario tras la operación; incluir tests de regresión y documentar la consulta en `AI_USAGE.md`.

**Resultado obtenido (fragmento de código, diseño, explicación).**

| Componente | Ubicación | Responsabilidad |
|------------|-----------|-----------------|
| Sujeto Observer | `LevelCatalogFileSubject.ts` | `fs.watch` sobre `levels/` con debounce; notifica observadores en `add`/`change` de `*.json` |
| Observador | `LevelCatalogUpsertObserver.ts` | Persiste cada archivo cambiado vía `UpsertLevelUseCase` |
| Bootstrap | `startLevelCatalogWatcher.ts`, `server.ts` (`watchLevelCatalog: true` en `main.ts`) | Arranca el watcher junto al seed |
| Sync reutilizable | `syncLevelCatalogFromDirectory.ts`, `parseLevelJsonFile.ts` | Seed y watcher comparten la misma ruta de upsert |
| Puerto FE | `ILevelRepository.invalidateCache()` | Permite forzar nueva descarga |
| Caso de uso FE | `RefreshLevelsUseCase` | Compara ids antes/después y devuelve `LevelCatalogRefreshResult` |
| UI | `level_select_screen.dart` | `IconButton` refresh + `SnackBar` con mensaje i18n |
| Tests BE | `levelCatalogWatcher.spec.ts`, `syncLevelCatalogFromDirectory.spec.ts` | Observer + upsert sin reinicio |
| Tests FE | `refresh_levels_use_case_test.dart`, `cached_level_repository_test.dart`, `level_select_screen_test.dart` | Invalidación, conteos y notificación |

**Modificaciones realizadas por el equipo al resultado de la IA.**

- Ninguna — cambios de una línea cada uno.

**Lecciones aprendidas o limitaciones identificadas.**

- `fs.watch` en Windows puede emitir `rename` al crear archivos; el sujeto normaliza a `add` y ignora borrados (no se eliminan niveles de SQLite automáticamente en esta versión).
- El botón de actualización en el cliente es necesario aunque el backend ya sincronice: `CachedLevelRepository` cachea en memoria la primera respuesta de `GET /levels` por sesión.
- Flujo de demo recomendado: guardar `levels/16-*.json` con el backend en marcha → pulsar refresh en la app → SnackBar confirma niveles nuevos.

---

## Consulta #18 — Validación de flechas multi-celda (máx. 3) y ajuste de niveles JSON

**Problema abordado.**

Alinear el backend con el nuevo diseño visual del cliente: cada flecha puede ocupar como máximo **3 celdas** (cabeza + 2 segmentos de `body`). Se añadió validación en `UpsertLevelUseCase` y se recortaron niveles seed que excedían el límite.

**Herramienta de IA utilizada.**

- Cursor Agent (Composer).

**Prompt o instrucción proporcionada (transcripción literal o paráfrasis fiel).**

> Implementar el rediseño visual del cliente Flutter según la paleta Tollens y el logo del laberinto: flechas con trazo continuo que abarquen hasta tres celdas del tablero, tablero minimalista con esquinas redondeadas, tema global coherente, validación del límite de segmentos en el contrato compartido, documentación en español en cada función nueva, y registro en `AI_USAGE.md`.

**Resultado obtenido.**

| Componente | Ubicación | Responsabilidad |
|------------|-----------|-----------------|
| Validador | `src/domain/validators/arrowPlacementValidator.ts` | `MAX_ARROW_BODY_SEGMENTS = 2` |
| Caso de uso | `UpsertLevelUseCase.execute` | Rechaza DTOs con flechas demasiado largas antes del BFS |
| Contrato | `docs/contract/level.contract.ts` | Documenta el límite de 3 celdas |
| Niveles | `levels/01-simple-1.json`, `levels/15-level-15.json` | Flechas `f6`, `f7`, `k-free` recortadas a ≤ 2 body |
| Tests | `tests/unit/domain/arrowPlacementValidator.spec.ts` | Acepta 2 segmentos; rechaza 3+ |

**Modificaciones realizadas por el equipo al resultado de la IA.**

- Pendiente de revisión del equipo tras merge.

**Lecciones aprendidas o limitaciones identificadas.**

- Validar en el upsert evita persistir niveles que el cliente no puede dibujar correctamente con el nuevo `ArrowBoardPainter`.
- Recortar flechas largas puede cambiar la solvabilidad: conviene re-ejecutar tests E2E del catálogo tras editar JSON.

---

## Consulta #19 — Corrección del límite de flechas, `optimalMoves` calculado en el servidor y catálogo de 20 niveles

**Problema abordado.**

Al probar en vivo con niveles reales se detectaron dos problemas de diseño, no solo de código: (1) el límite de "máximo 3 celdas por flecha" agregado en la Consulta #18 estaba mal — se copió el límite visual del cliente en lugar de corregirlo, y la regla real del juego es "mínimo 1 celda de cuerpo, sin máximo"; (2) el cliente recalculaba `optimalMoves` con un BFS exhaustivo sobre el espacio de estados cada vez que cargaba el catálogo, lo cual congelaba la pestaña con niveles grandes (48 flechas). Se corrigió la regla de validación, se movió el cálculo de `optimalMoves` al backend (matemáticamente siempre `arrows.length`, ya que cada disparo exitoso retira exactamente una flecha), y se reconstruyó el catálogo `levels/` con 20 niveles diseñados manualmente por el equipo (reemplazando los 15 originales, varios de los cuales tenían flechas sin cuerpo y ya no cumplían la regla corregida).

**Herramienta de IA utilizada.**

- Claude Code (Claude Sonnet 5), sesión interactiva de terminal con acceso de lectura/escritura al repositorio, ejecución de la suite de tests y control de versiones.

**Prompt o instrucción proporcionada (transcripción literal o paráfrasis fiel).**

> Solucionar que las flechas tengan cualquier longitud (no solo 5) en el frontend; las flechas deben tener al menos una cabeza y una celda de cuerpo. Blindar el servicio ante la subida de niveles corruptos o no resolubles. Más adelante: el cliente congela la pantalla al cargar niveles grandes porque recalcula la ruta óptima — mover ese cálculo al backend ya que el óptimo es siempre igual a la cantidad de flechas.

**Resultado obtenido (fragmento de código, diseño, explicación).**

| Componente | Ubicación | Responsabilidad |
|------------|-----------|-----------------|
| Validador | `src/domain/validators/arrowPlacementValidator.ts` | `MIN_ARROW_BODY_SEGMENTS = 1`; rechaza flechas sin cuerpo, ya no limita el máximo |
| Contrato | `docs/contract/level.contract.ts` | `optimalMoves?: number`, documentado como siempre igual a `arrows.length` |
| Mapper | `src/infrastructure/mappers/LevelJsonMapper.toDto` | Calcula y adjunta `optimalMoves` en cada respuesta de `/levels` |
| Catálogo | `levels/*.json` | 20 niveles nuevos (`level-1`…`level-20`), diseñados manualmente por el equipo, todos validados (cuerpo mínimo + resolubles) antes de reemplazar el catálogo anterior |
| Tests BE | `arrowPlacementValidator.spec.ts`, tests de integración de niveles/progreso/SQLite | Actualizados a la regla de mínimo y al catálogo de 20 |

**Modificaciones realizadas por el equipo al resultado de la IA.**

- El equipo diseñó y aportó manualmente los 20 niveles del catálogo (formas de tablero y disposición de flechas); la IA solo los validó (JSON válido, sin BOM, ids únicos, cuerpo mínimo, solubilidad) antes de aceptarlos como reemplazo del catálogo anterior.
- Se decidió explícitamente mantener el catálogo de `levels/` puramente aditivo (sin mecanismo de borrado automático al quitar un archivo), priorizando no perder progreso/puntajes de jugadores ya asociados a un nivel sobre la conveniencia de limpieza automática.

**Lecciones aprendidas o limitaciones identificadas.**

- Un límite de validación "copiado" de una limitación de otra capa (el pintor del cliente) en vez de derivado de la regla de negocio real es un error fácil de introducir sin notarlo — solo se detectó al probar con niveles reales de mayor tamaño.
- El costo de un algoritmo de búsqueda (BFS/backtracking) depende de la estructura del nivel, no solo de la cantidad de flechas: conviene medir con datos reales (se hizo con un script de validación aislado) antes de asumir que "más grande implica más lento".
- Duplicar una regla de negocio en dos repositorios (cliente y backend) con implementaciones de distinto costo computacional es un riesgo real de arquitectura distribuida; centralizar el cálculo en el lado que ya lo valida (el backend) elimina la duplicación y el riesgo de que diverjan.

---

## Consulta #20 — Corrección de la resolución de `levels/` en el build compilado (`dist/`)

**Problema abordado.**

El servidor arrancaba correctamente en desarrollo (`ts-node-dev` sobre `src/`) pero fallaba al ejecutar el build de producción con `Error: Level catalog directory not found: .../dist/levels`. La causa: `DEFAULT_LEVELS_DIRECTORY` calculaba la ruta del catálogo subiendo un número fijo de directorios desde `__dirname` (`path.resolve(__dirname, '../../../../levels')`), asumiendo siempre la profundidad de `src/infrastructure/persistence/seed/`. Como `tsc` compila con `rootDir: '.'`, el build conserva el prefijo `src/` bajo `dist/` (`dist/src/infrastructure/persistence/seed/`), añadiendo un nivel extra de profundidad que el cálculo fijo no contemplaba. El defecto se manifestó y se corrigió dos veces de forma independiente: primero en `main`, y posteriormente en `develop` (rama que había divergido de `main` antes de que el primer fix se fusionara).

**Herramienta de IA utilizada.**

- Claude Code (Claude Sonnet 5), sesión interactiva de terminal con acceso de lectura/escritura al repositorio y ejecución del servidor en modo desarrollo y compilado.

**Prompt o instrucción proporcionada (transcripción literal o paráfrasis fiel).**

> Actualiza los repos y vuelve a lanzar el proyecto. Al correr el backend compilado, el servidor no arranca: `Error: Level catalog directory not found`. Diagnostica la causa raíz y corrígela sin romper el modo de desarrollo.

**Resultado obtenido (fragmento de código, diseño, explicación).**

Se reemplazó el cálculo de profundidad fija por una búsqueda ascendente del directorio raíz del repositorio (ubicación de `package.json`), robusta frente a diferencias de profundidad entre `src/` y `dist/src/`:

```typescript
function findRepoRoot(startDir: string): string {
  let dir = startDir;
  while (!fs.existsSync(path.join(dir, 'package.json'))) {
    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error(`Could not locate repo root (package.json) from ${startDir}`);
    }
    dir = parent;
  }
  return dir;
}

export const DEFAULT_LEVELS_DIRECTORY = path.join(findRepoRoot(__dirname), 'levels');
```

| Componente | Ubicación | Cambio |
|------------|-----------|--------|
| Resolución de ruta | `src/infrastructure/persistence/seed/loadLevelCatalogFromDirectory.ts` | `findRepoRoot()` reemplaza el conteo fijo de niveles de directorio |

**Modificaciones realizadas por el equipo al resultado de la IA.**

- Ninguna; el fix se aplicó y verificó en ambas ramas (`main` y `develop`) tal como se generó.

**Lecciones aprendidas o limitaciones identificadas.**

- Calcular rutas de archivos relativas a `__dirname` contando un número fijo de niveles es frágil ante cualquier diferencia entre el árbol de fuentes y el árbol compilado (p. ej. `rootDir` en `tsconfig.json`); buscar un punto de referencia estable (`package.json`) es más robusto que contar directorios.
- Un defecto corregido en una rama no se propaga automáticamente a otra que ya había divergido: conviene fusionar o reaplicar correcciones de infraestructura cuanto antes para evitar reproducir el mismo diagnóstico dos veces.

---

## Consulta #21 — Corrección de dos brechas de consistencia en el manejo de errores HTTP

**Problema abordado.**

Se solicitó validar el cumplimiento del criterio "manejo adecuado de errores HTTP y respuestas consistentes" sobre la API existente. La auditoría identificó una arquitectura de manejo de errores sólida (middleware centralizado, jerarquía de errores tipados, códigos de estado correctos, validación con Zod, cobertura de tests en las rutas de error existentes), pero con dos brechas concretas: (1) las rutas no reconocidas por ningún router caían en el 404 por defecto de Express (HTML/texto plano), rompiendo la forma `{ error: { message } }` que usa el resto de la API; (2) la rama de error 500 genérico enviaba siempre el mensaje real de la excepción al cliente, sin distinguir el entorno, exponiendo potencialmente detalles internos (p. ej. de la base de datos) en un despliegue de producción.

**Herramienta de IA utilizada.**

- Claude Code (Anthropic), modelo Sonnet 5. La auditoría inicial se delegó a un subagente de exploración de solo lectura; la corrección se implementó en una sesión de terminal con acceso de lectura/escritura al repositorio y ejecución de la suite de tests.

**Prompt o instrucción proporcionada (transcripción literal o paráfrasis fiel).**

> Valida lo siguiente por favor: manejo adecuado de errores HTTP y respuestas consistentes. [Tras el informe de auditoría, con dos brechas identificadas:] Corrige eso por favor.

**Resultado obtenido (fragmento de código, diseño, explicación).**

```typescript
// src/infrastructure/http/middlewares/notFound.middleware.ts
export function notFoundMiddleware(req: Request, res: Response): void {
  res.status(404).json({ error: { message: `Route not found: ${req.method} ${req.originalUrl}` } });
}
```

```typescript
// src/infrastructure/http/middlewares/errorHandler.middleware.ts (rama 500)
const isProduction = process.env.NODE_ENV === 'production';
res.status(500).json({
  error: {
    message: isProduction ? 'Internal server error' : message,
  },
});
```

| Componente | Ubicación | Cambio |
|------------|-----------|--------|
| Middleware nuevo | `notFound.middleware.ts` | Responde 404 con la misma forma `{ error: { message } }` para cualquier ruta no reconocida |
| Registro | `server.ts` | `notFoundMiddleware` registrado tras todos los routers y antes de `errorHandlerMiddleware` |
| Middleware existente | `errorHandler.middleware.ts` | Rama 500 sanitiza el mensaje según `NODE_ENV`; el mensaje real se sigue registrando en el log del servidor en todos los casos |
| Tests | `tests/integration/notFound.spec.ts`, `tests/unit/infrastructure/errorHandler.middleware.spec.ts` | Verifican la forma del 404 y ambas ramas (dev/producción) de la sanitización del 500 |

**Modificaciones realizadas por el equipo al resultado de la IA.**

- Ninguna; se verificó con `npm run lint`, `npm run build` y `npm test` (162/162 tests) antes de commitear.

**Lecciones aprendidas o limitaciones identificadas.**

- Un middleware de errores centralizado no cubre por sí solo las rutas que ningún router reconoce: Express requiere un middleware adicional explícito, registrado después de todas las rutas, para que también esas respuestas sigan el formato consistente del resto de la API.
- Enviar `err.message` de una excepción genuina al cliente sin distinguir el entorno es un riesgo real de fuga de información en producción, incluso si nunca se envía el stack trace; sanitizar por `NODE_ENV` preserva la utilidad del mensaje detallado en desarrollo sin exponerlo en despliegues reales.
- Una auditoría explícita ("valida X") antes de implementar evita corregir supuestos problemas que en realidad ya estaban bien resueltos, y concentra el esfuerzo en las brechas reales.

---

## Consulta #22 — Prueba de contrato del DTO de nivel contra el fixture compartido con el frontend

**Problema abordado.**

El equipo preguntó qué es una prueba de contrato y dónde aplicarla en el proyecto. El backend y el frontend ya comparten un contrato explícito de nivel (`docs/contract/level.contract.ts` ↔ `lib/contract/level_contract.dart`), pero ninguna prueba lo verificaba de punta a punta: cada repo probaba su propio mapeo contra su propia copia del fixture `docs/levels/simple-1.json`, y ese archivo **no existía en el backend** — solo en el frontend. Al investigar, se confirmó que el objeto de prueba embebido en `LevelJsonMapper.spec.ts` ya había divergido del contrato real vigente: declaraba `height: 5` (el valor correcto es `6`) y una flecha (`f4`) con 0 celdas de cuerpo, forma que el analizador del DTO en el frontend rechaza explícitamente por la regla de mínimo 1 celda de cuerpo por flecha. En otras palabras, el backend probaba su mapeo contra un nivel que el frontend real ya no aceptaría.

**Herramienta de IA utilizada.**

- Claude Code (Anthropic), modelo Sonnet 5. La exploración del contrato compartido y de las fronteras de forma entre ambos repos se delegó a un subagente de solo lectura; el diseño de la solución se validó en modo de planificación con aprobación explícita antes de implementar.

**Prompt o instrucción proporcionada (transcripción literal o paráfrasis fiel).**

> ¿Qué es una prueba de contrato? ¿Y dónde lo podríamos aplicar según este proyecto? [Tras la propuesta, acotando el alcance:] Solo aplica el de `level.contract.ts` y `level_contract.dart`.

**Resultado obtenido (fragmento de código, diseño, explicación).**

Se agregó `docs/levels/simple-1.json` al backend como copia idéntica del mismo archivo en el repo frontend, y se reemplazó el objeto embebido de `LevelJsonMapper.spec.ts` por una lectura de ese fixture desde disco, de modo que el test ejercita el mapeo real contra el mismo JSON que usa el frontend, no contra una copia que puede desincronizarse silenciosamente.

```typescript
// Antes: objeto literal embebido, desincronizado del contrato real sin que
// ningún test lo detectara.
const simpleLevel: StructuredLevelJsonDto = { /* ...height: 5, f4 sin cuerpo... */ };

// Después: se lee el fixture compartido con el frontend desde disco.
const simpleLevelPath = path.join(__dirname, '../../../docs/levels/simple-1.json');
const simpleLevel: StructuredLevelJsonDto = JSON.parse(fs.readFileSync(simpleLevelPath, 'utf-8'));
```

| Componente | Ubicación | Cambio |
|------------|-----------|--------|
| Fixture | `docs/levels/simple-1.json` (nuevo) | Copia idéntica del fixture del repo frontend |
| Documentación | `docs/levels/README.md` (nuevo) | Nota de mantenimiento: debe permanecer idéntico en ambos repos |
| Prueba de contrato | `tests/unit/infrastructure/LevelJsonMapper.spec.ts` | Lee el fixture desde disco en vez de un literal embebido; aserción de altura del tablero corregida de 5 a 6 |

**Modificaciones realizadas por el equipo al resultado de la IA.**

- Ninguna; se verificó con `npm run lint`, `npm run build` y `npm test` (162/162 tests) en el backend, y con `flutter test` (99/99 tests) en el frontend, antes de commitear.

**Lecciones aprendidas o limitaciones identificadas.**

- Un contrato compartido documentado no garantiza por sí solo que ambos lados se prueben contra los mismos datos: si cada repo mantiene su propia copia del fixture, pueden divergir en silencio, y de hecho ya habían divergido en este proyecto sin que ningún test lo señalara.
- Leer el fixture de contrato desde un archivo compartido (en vez de embeberlo como literal en el test) convierte cualquier divergencia futura entre repos en un fallo de test explícito, en lugar de un supuesto implícito no verificado.
- Al ser dos repositorios independientes sin pipeline compartido, la sincronización del fixture de contrato es manual; documentarlo explícitamente (README junto al fixture) es la única salvaguarda disponible sin invertir en infraestructura adicional (p. ej. un paquete o submódulo compartido).

---

## Consulta #23 — Extensión de pruebas de contrato a auth, progress y leaderboard (sin Pact)

**Problema abordado.**

El enunciado del proyecto recomienda explícitamente usar **Pact** (o herramienta equivalente) para pruebas de contrato consumer-driven entre el cliente del juego y el backend. Tras evaluar la recomendación, se confirmó que el patrón de fixture compartido ya aplicado al DTO de nivel (Consulta #22) cubría solo una de las cinco fronteras HTTP compartidas entre ambos repos. Se solicitó extender ese mismo patrón a las cuatro restantes — `POST /auth/register`, `POST /auth/login`, `POST /progress/sync` (request y response) y `GET /progress`, `GET /leaderboard/:levelId` — explícitamente **sin** adoptar Pact, y documentar el razonamiento detrás de esa decisión.

**Herramienta de IA utilizada.**

- Claude Code (Anthropic), modelo Sonnet 5. La decisión de no usar Pact se validó primero investigando el estado real del soporte de Pact para Dart/Flutter (sin SDK de consumidor oficial ni bien mantenido), y la extensión del patrón se diseñó en modo de planificación con aprobación explícita antes de implementar.

**Prompt o instrucción proporcionada (transcripción literal o paráfrasis fiel).**

> [Sobre la recomendación de Pact del enunciado:] ¿Crees que lo estamos cumpliendo según lo realizado o hay que mejorarlo? [Tras la evaluación, con la brecha identificada de que solo se cubría el contrato de nivel:] Estoy de acuerdo, aplícalo a todos los endpoints compartidos como estás sugiriendo, sin la necesidad de usar Pact. Agrega ese razonamiento en la documentación.

**Resultado obtenido (fragmento de código, diseño, explicación).**

Se agregaron seis fixtures JSON compartidos (bit-a-bit idénticos en ambos repos) bajo `docs/contract/fixtures/`, y una prueba de contrato en cada repo por cada fixture que ejercita el **código real** de ese lado (no una re-implementación de su forma): en el backend, el esquema Zod real y rutas reales vía `supertest`; en el frontend, los clientes HTTP reales (`AuthApiClient`, `ProgressApiClient`, `LeaderboardApiClient`) contra un `MockHttpClient` que reenvía el fixture.

```typescript
// Backend: la respuesta REAL de una ruta debe tener las mismas claves que el fixture.
const response = await request(app).post('/auth/login').send({ username, password });
expectSameKeys(response.body, loadFixture('auth-login-response.json'));
```

```dart
// Frontend: el cliente HTTP REAL debe parsear el fixture en el modelo esperado.
final session = await api.login(username: 'ignored', password: 'ignored12');
expect(session.token, fixture['token']);
```

| Componente | Ubicación | Rol |
|------------|-----------|-----|
| Fixtures | `docs/contract/fixtures/*.json` (6 archivos) | Forma compartida de cada frontera HTTP, idéntica en ambos repos |
| Razonamiento documentado | `docs/contract/fixtures/README.md` | Por qué fixtures compartidos en vez de Pact, y la limitación aceptada |
| Prueba de contrato (backend) | `tests/integration/contractFixtures.spec.ts` | Valida el fixture de request con el Zod schema real; compara claves de las respuestas reales (vía rutas HTTP reales) contra cada fixture de respuesta |
| Prueba de contrato (frontend) | `test/infrastructure/http/contract_fixtures_test.dart` | Parsea cada fixture de respuesta con el cliente HTTP real; verifica que el cuerpo de la petición real de sync coincide con el fixture de request |

**Modificaciones realizadas por el equipo al resultado de la IA.**

- Ninguna; se verificó con `npm run lint`, `npm run build` y `npm test` (169/169 tests) en el backend, y con `flutter analyze` y `flutter test` (104/104 tests) en el frontend, antes de commitear.

**Lecciones aprendidas o limitaciones identificadas.**

- No toda recomendación de la rúbrica aplica igual de bien a cualquier stack: Pact tiene soporte maduro para JVM/.NET/JS/Python/Go/Ruby, pero no para Dart/Flutter en el lado consumidor, lo que lo vuelve poco práctico como "primera opción" para este proyecto en particular sin construir tooling propio desproporcionado al alcance.
- Una prueba de contrato no necesita un framework dedicado para dar la garantía central que importa (ambos lados coinciden en la forma de los datos): un fixture compartido más pruebas que ejercitan el código de producción real de cada lado logra el mismo objetivo con mucho menos costo de adopción, al precio de sincronización manual entre repos en vez de automática.
- Comparar **conjuntos de claves** (no valores exactos) en las pruebas del lado del backend es la forma correcta de verificar forma sin acoplar el test a datos específicos generados en cada corrida (usuarios, tokens, puntajes).
- Documentar explícitamente por qué se descartó la herramienta recomendada por el enunciado (con la limitación técnica concreta que lo motivó) dentro del propio repositorio (`docs/contract/fixtures/README.md`) deja el razonamiento disponible para quien evalúe el proyecto, en vez de depender de que se explique solo verbalmente en la defensa.

---

## Consulta #24 — Fixture de `GET /levels`, validación de tipos con Zod, fixtures de error y verificación de sincronización en CI

**Problema abordado.**

Como refinamiento sobre la extensión de pruebas de contrato (Consulta #23), se pidieron cuatro mejoras puntuales: (1) un fixture compartido para `GET /levels` (un nivel de ejemplo del catálogo, distinto del fixture de `LevelJsonMapper` ya existente); (2) que las pruebas del lado del backend validaran **tipos**, no solo el conjunto de claves de las respuestas — hasta ahora, un campo con el nombre correcto pero el tipo equivocado habría pasado la comparación; (3) fixtures para los dos errores más comunes de la API (401 no autorizado, 409 usuario duplicado); (4) un script o chequeo en CI que compare los fixtures de contrato entre los dos repos por hash, pese a ser repositorios independientes sin pipeline compartido.

**Herramienta de IA utilizada.**

- Claude Code (Anthropic), modelo Sonnet 5, sesión interactiva de terminal con acceso de lectura/escritura al repositorio, ejecución de la suite de tests y del script de sincronización (incluyendo una prueba deliberada de divergencia para confirmar que el script sí falla cuando corresponde).

**Prompt o instrucción proporcionada (transcripción literal o paráfrasis fiel).**

> Ahora: añadir fixture compartido para `GET /levels` (un nivel de ejemplo del catálogo). Validar tipos además de claves en el backend (p. ej. con Zod schemas para respuestas, no solo requests). Añadir fixtures de error: 401 Unauthorized, 409 UserAlreadyExists. Script o check en CI que compare hashes de fixtures entre repos (aunque sean repos separados).

**Resultado obtenido (fragmento de código, diseño, explicación).**

```typescript
// tests/support/contractSchemas.ts: schemas SOLO de test, .strict() rechaza
// campos extra además de validar tipos.
export const authLoginResponseSchema = z
  .object({ token: z.string(), userId: z.string(), username: z.string() })
  .strict();
```

```bash
# scripts/check-contract-fixtures-sync.sh: usa un checkout hermano local si
# existe, o clona el otro repo en CI; nunca hace fallar el build por un
# problema de acceso, solo por una divergencia real de contenido.
if ! git clone --depth 1 --branch "$OTHER_REPO_REF" "$OTHER_REPO_URL" "$OTHER_REPO_PATH"; then
  echo "No se pudo clonar el repo frontend... Omitiendo verificación (no es un fallo)."
  exit 0
fi
```

| Componente | Ubicación | Cambio |
|------------|-----------|--------|
| Fixtures nuevos | `docs/contract/fixtures/levels-get-response.json`, `error-401-unauthorized.json`, `error-409-user-already-exists.json` | Un nivel de ejemplo de `GET /levels`; sobre de error para 401 y 409 |
| Schemas de tipo | `tests/support/contractSchemas.ts` | Un `z.object().strict()` por cada forma de respuesta (auth, progress, leaderboard, nivel, error) |
| Prueba de contrato | `tests/integration/contractFixtures.spec.ts` | Reemplaza la comparación de solo-claves por `schema.parse()` sobre fixture y respuesta real; agrega casos para `GET /levels` (comparación exacta, no solo de forma, al ser datos controlados en el test) y para 401/409 |
| Script de sincronización | `scripts/check-contract-fixtures-sync.sh` | Compara SHA-256 de cada fixture contra el repo frontend (checkout hermano en local, clon superficial en CI); falla solo ante una divergencia real de contenido |
| CI | `.github/workflows/ci.yml` | Nuevo paso que corre el script tras la suite de tests |

**Modificaciones realizadas por el equipo al resultado de la IA.**

- Ninguna; se verificó con `npm run lint`, `npm run build` y `npm test` (172/172 tests), y adicionalmente se probó el script de sincronización de forma manual introduciendo una divergencia deliberada en un fixture para confirmar que detecta el fallo (`exit 1`) antes de revertirla.

**Lecciones aprendidas o limitaciones identificadas.**

- Comparar solo el conjunto de claves de una respuesta (Consulta #23) es más débil de lo que parece: no detecta un campo con el tipo equivocado. Validar con un schema de tipos (`.strict()` para además rechazar campos no documentados) es la forma correcta de que una prueba de contrato cumpla su propósito completo.
- Un chequeo de sincronización entre dos repos independientes en CI debe decidir explícitamente cómo comportarse cuando **no puede** hacer la comparación (repo privado, sin red): fallar el build en ese caso penalizaría un problema de acceso ajeno al contenido de los fixtures; reportarlo y continuar es el comportamiento correcto para una red de seguridad adicional, no un gate obligatorio.
- Probar el "camino de fallo" de un script de verificación (no solo el camino feliz) antes de darlo por terminado — en este caso, corromper temporalmente un fixture y confirmar que el script realmente devuelve `exit 1` — es la única forma de tener certeza de que la comprobación funciona, en vez de asumirlo por lectura del código.

## Consulta #25 — Balance de movimientos y tiempo por nivel en el catálogo

**Problema abordado.**

El usuario pidió revisar si la cantidad de movimientos permitidos (`maxMoves`) y el tiempo límite (`maxTimeInSeconds`) de los 22 niveles del catálogo estaban bien calibrados, señalando que algunos parecían muy ajustados y otros muy holgados.

**Herramienta de IA utilizada.**

- Claude Code (Anthropic), modelo Sonnet 5, sesión interactiva de terminal con acceso de lectura/escritura al repositorio y ejecución de un script de análisis puntual (no incorporado al repositorio).

**Prompt o instrucción proporcionada (transcripción literal o paráfrasis fiel).**

> Ahora necesito tu ayuda para chequear la cantidad de movimientos y tiempo por nivel (algunos son muy ajustados y otros son muy holgados).
>
> Ajusta el tiempo de esos niveles que comentas, y en los niveles medium, déjales 5 movimientos de margen.

**Resultado obtenido (fragmento de código, diseño, explicación).**

Se escribió un script temporal (`node`, no parte del repositorio) que, para cada uno de los 22 niveles, calculó:
- `optimalMoves` = cantidad de flechas (cada flecha exitosa se extrae una vez; ganar exige extraerlas todas).
- Margen de movimientos = `maxMoves - optimalMoves`.
- Tiempo esperado según la fórmula real del frontend (`LevelTimeLimitCalculator`: `optimalMoves * segundosPorMovimiento(dificultad) + 15`, acotado a `[30, 600]`) comparado contra el `maxTimeInSeconds` real de cada nivel.

Hallazgos relevantes:
- Los 9 niveles `MEDIUM` (5 al 12, y 21) tenían márgenes de movimiento inconsistentes entre sí, algunos con solo 1 movimiento de holgura.
- Se confirmó en `lib/domain/game/game.dart:221` que el contador de movimientos se incrementa en **todo** intento (`performMove`), exitoso o bloqueado — es decir, un margen de movimiento bajo penaliza al jugador incluso por un solo intento fallido, no solo por ineficiencia real.
- Los niveles `level-14` (HARD) y `level-19` (EXPERT) tenían un `maxTimeInSeconds` marcadamente más holgado que sus pares de la misma dificultad al comparar la razón tiempo/movimiento.

Cambios aplicados en `levels/*.json`:

| Nivel | Campo | Antes | Después |
|-------|-------|-------|---------|
| level-5 | `maxMoves` | 8 | 12 |
| level-6 | `maxMoves` | 9 | 13 |
| level-7 | `maxMoves` | 11 | 15 |
| level-8 | `maxMoves` | 12 | 16 |
| level-9 | `maxMoves` | 11 | 15 |
| level-10 | `maxMoves` | 11 | 15 |
| level-11 | `maxMoves` | 11 | 15 |
| level-12 | `maxMoves` | 11 | 15 |
| level-21 | `maxMoves` | 8 | 9 |
| level-14 | `maxTimeInSeconds` | 220 | 160 |
| level-19 | `maxTimeInSeconds` | 320 | 240 |

Todos los niveles `MEDIUM` quedan con exactamente `optimalMoves + 5` movimientos de margen. Los niveles `level-14` y `level-19` quedan con una razón tiempo/movimiento consistente con sus pares `HARD`/`EXPERT`.

**Modificaciones realizadas por el equipo al resultado de la IA.**

- Ninguna; se verificó con `npm run lint`, `npm run build` y `npm test` (172/172 tests) tras aplicar los 11 cambios, confirmando que el catálogo sigue cargando correctamente.

**Lecciones aprendidas o limitaciones identificadas.**

- El diseño de niveles no puede evaluarse mirando solo `maxMoves` en aislado: hay que cruzarlo contra `optimalMoves` (derivado del propio contenido del nivel) y contra el comportamiento real del contador de movimientos en el dominio del juego, no solo contra la intuición de "cuántas flechas hay".
- Un margen de movimiento igual a cero es más severo de lo que parece a simple vista, porque el contador de movimientos penaliza intentos bloqueados, no solo decisiones subóptimas — un detalle de implementación que cambia por completo la evaluación de qué margen es "justo".
- Quedó fuera de alcance de esta consulta —y pendiente de decisión del usuario— si conviene aplicar el mismo criterio de margen a los niveles `HARD`/`EXPERT` (13 al 20), que hoy en su mayoría tienen margen cero; no se modificó su `maxMoves` sin instrucción explícita.

## Consulta #26 — Validación estructural del catálogo de niveles y nombres faltantes

**Problema abordado.**

Dos pedidos relacionados: (1) validar si el JSON de los 22 niveles del catálogo tenía algún problema estructural; (2) corregir que el catálogo de niveles en la app mostrara nombres genéricos en vez de un nombre propio para algunos niveles.

**Herramienta de IA utilizada.**

- Claude Code (Anthropic), modelo Sonnet 5, sesión interactiva de terminal con acceso de lectura/escritura al repositorio y al repositorio frontend, y un script de validación puntual en Node.js (no incorporado al repositorio) para auditar los 22 archivos.

**Prompt o instrucción proporcionada (transcripción literal o paráfrasis fiel).**

> Ahora necesito que valides si el JSON de los niveles y veas si hay algún problema en ellos.
>
> También corrige que los idiomas mostrados en el catálogo de niveles en la app, sean nombres propios y no un nombre genérico que digan "nivel 1".

**Resultado obtenido (fragmento de código, diseño, explicación).**

Se escribió un validador temporal que revisó, para cada uno de los 22 niveles: campos requeridos, límites de tablero, dificultad válida, ids duplicados (dentro y entre archivos), solapamiento silencioso de celdas (el `LevelBuilder` no lo detecta), `maxMoves >= optimalMoves`, y solvabilidad real vía backtracking (misma lógica que `LevelSolvabilityValidator.ts`). Un primer intento marcó ~27 falsos positivos por asumir que el cuerpo de una flecha debía ser una línea recta alineada con su `direction`; se confirmó contra el código real (`Arrow` entity del frontend, `LevelBuilder` del backend) que el diseño soporta formas en L/Z/"cortina" a propósito, y que el único requisito real es que cabeza+cuerpo formen una cadena conexa por adyacencia (para que el trazador del cliente dibuje una línea continua). Con esa corrección, los 22 niveles pasaron sin problemas — salvo un hallazgo de datos, no de estructura: `level-21.json` y `level-22.json` eran los únicos dos sin campo `"name"`, lo que hacía que el frontend (que ya prioriza `name` y solo cae al `id` como último recurso) mostrara su id crudo en el catálogo. Se agregó:

```json
// level-21.json
"name": "Simetría Perfecta",
// level-22.json
"name": "Todos los Tamaños",
```

**Modificaciones realizadas por el equipo al resultado de la IA.**

- Ninguna; se verificó con `npm run lint`, `npm run build` y `npm test` (172/172 tests) tras agregar los nombres, y con `flutter analyze`/`flutter test` (107/107 tests) en el repo frontend para confirmar que el catálogo ya no muestra el id crudo.

**Lecciones aprendidas o limitaciones identificadas.**

- Ningún paso del arranque del servidor valida hoy el esquema, el solapamiento de celdas ni la solvabilidad de los niveles al cargarlos (`parseLevelJsonFile.ts` solo hace `JSON.parse`); un nivel corrupto se serviría igual sin aviso. Queda como mejora sugerida (no aplicada) convertir este validador en un test o chequeo de arranque/CI.
- Antes de reportar un hallazgo de validación hay que confirmar la regla real del dominio, no la intuición: asumir que el cuerpo de una flecha debe alinearse con su dirección de disparo habría producido un reporte de "10 niveles rotos" completamente falso.

## Consulta #27 — Conteo de catálogo hardcodeado en tests y arranque no resiliente a niveles rotos

**Problema abordado.**

El usuario señaló dos problemas relacionados en `LEVEL_SEED_CATALOG`: (1) el test `should_contain_the_currently_curated_levels` afirmaba `expect(LEVEL_SEED_CATALOG_SIZE).toBe(22)` con un número fijo, que se rompería apenas se agregara o quitara un nivel de `levels/`; (2) preguntó qué pasaría si se subieran niveles nuevos junto con algunos no resolubles (p. ej. 30 niveles, 15 sin solución) — si el número debía derivarse de la carpeta, y cómo debía comportarse el sistema ante contenido inválido.

**Herramienta de IA utilizada.**

- Claude Code (Anthropic), modelo Sonnet 5, sesión interactiva de terminal con acceso de lectura/escritura al repositorio, ejecución de la suite de tests y arranque real del servidor (`npm run dev`) para reproducir el comportamiento antes y después del fix.

**Prompt o instrucción proporcionada (transcripción literal o paráfrasis fiel).**

> Hay un tema en las pruebas de LEVEL SEED CATALOG, la prueba should_contain_the_currently_curated_levels pone que el número de niveles debe ser 22, pero en verdad ese número puede ser variable con el tiempo [...] como puedo solucionar que este número vaya de la mano con la cantidad de niveles de la carpeta o, si el test debe ser diferente, porque puede darse el caso de que, yo suba 30 niveles, pero 15 no tengan solución, que puedo hacer?
>
> Ok, voy a subir un nivel malo [...] crea un nivel que no tenga solución [...] reinicia el servidor e inclúyelo en la carpeta de niveles, y prueba el comportamiento que me estás comentando.
>
> Sí, hazlo [implementar el fix de resiliencia] y reinicia el servidor.

**Resultado obtenido (fragmento de código, diseño, explicación).**

Se investigó el código real antes de proponer nada: `LEVEL_SEED_CATALOG_SIZE` ya se derivaba de `LEVEL_SEED_CATALOG.length` (`levelSeedCatalog.ts`), así que el único punto hardcodeado era la aserción del test. Se cambió por una comparación contra `listLevelJsonFiles().length` (el conteo real de `levels/*.json`), eliminando el número fijo sin perder cobertura.

Para la segunda pregunta, se leyó `syncLevelCatalogFromDirectory.ts`/`seedLevelCatalog.ts` y se confirmó que el arranque (`seedLevelCatalog` → `syncLevelCatalogFromDirectory`) procesaba los archivos en un bucle **sin try/catch**, documentado explícitamente como intencional ("Propaga errores de dominio [...] para fallar el bootstrap"). Antes de tocar nada se reprodujo el problema en vivo: se creó `levels/level-99.json` con dos flechas apuntándose entre sí (bloqueo mutuo permanente, sin salida posible), se verificó de forma aislada con `LevelSolvabilityValidator.isPlayable()` que efectivamente era `false`, y se arrancó el servidor con ese archivo junto a los 22 buenos — el proceso murió con `LevelNotSolvableError` sin llegar a escuchar en el puerto, tumbando también los 22 niveles válidos.

Se corrigió haciendo que `syncLevelCatalogFromDirectory` capture el error **por archivo** (igual que ya hacía el watcher de hot-reload, `LevelCatalogFileSubject.notifyObservers`) en vez de abortar en el primero que falle:

```ts
for (const filePath of files) {
  try {
    const saved = await upsertLevelFromFile(container, filePath);
    levelIds.push(saved.id);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failed.push({ filePath, fileName: path.basename(filePath), message });
    console.error(`Level catalog seed: skipping "${path.basename(filePath)}" — ${message}`);
  }
}
```

`SyncLevelCatalogResult`/`SeedLevelCatalogResult` ganaron un campo `failed: SyncLevelCatalogFailure[]`, y `server.ts` ahora loguea cada archivo omitido con su motivo tras el seed. Se repitió la misma prueba en vivo con el fix aplicado: el log mostró `Level seed: 22/23 niveles cargados` + el detalle de `level-99.json`, el servidor sí quedó escuchando, `GET /health` respondió `{"status":"ok"}`, `GET /levels` devolvió los 22 niveles válidos, y `GET /levels/level-99` devolvió `404`.

**Modificaciones realizadas por el equipo al resultado de la IA.**

- Ninguna; se verificó con `npm run lint`, `npm run build` y `npm test` (173/173 tests, incluyendo el test de regresión nuevo `should_skip_an_unsolvable_level_and_still_sync_the_rest`) y con la reproducción manual en vivo (arranque real con y sin el fix) descrita arriba.

**Lecciones aprendidas o limitaciones identificadas.**

- El mismo tipo de error (`LevelNotSolvableError`) se comportaba de forma opuesta según el momento: resiliente en el watcher de hot-reload, fatal en el arranque. Ningún test cubría el camino de arranque con un archivo roto — el test suite validaba la solvabilidad de cada nivel curado (`it.each`), pero no el comportamiento del *pipeline* de seed ante un nivel inválido.
- Reproducir el bug en vivo (crear el archivo, arrancar el servidor, ver el crash real) antes de escribir el fix, y repetir la misma reproducción después, dio una confirmación mucho más sólida que solo leer el código o confiar en los tests unitarios — especialmente para un comportamiento de arranque que ningún test cubría todavía.
- Queda una decisión de producto pendiente, no resuelta aquí: el arranque ahora es resiliente por archivo, pero sigue sin existir una alerta activa (más allá del log de consola) si un nivel queda fuera del catálogo servido; una futura mejora sería exponer `failed` en algún endpoint de salud/diagnóstico en vez de solo loguearlo.

## Consulta #28 — Leaderboard sin desempate real (empates de puntaje ordenados por azar de inserción)

**Problema abordado.**

El usuario reportó que el leaderboard se veía mal ordenado: cada flecha extraída otorga los mismos 100 puntos fijos, así que todo jugador que completa un nivel termina con exactamente el mismo `highScore` (arrows × 100). Como el ranking solo ordenaba por `highScore`, el orden entre jugadores empatados quedaba librado al orden de inserción en SQLite en vez de reflejar quién jugó mejor (menos tiempo, menos movimientos). Pidió también sugerencias más creativas para el sistema de puntuación, y si el fix implicaba un cambio grande en el backend.

**Herramienta de IA utilizada.**

- Claude Code (Anthropic), modelo Sonnet 5, sesión interactiva de terminal con acceso de lectura/escritura al repositorio y ejecución de tests.

**Prompt o instrucción proporcionada (transcripción literal o paráfrasis fiel).**

> [...] al completar el nivel, todos tienen los mismos puntos [...] entonces, si todos completan el nivel y tienen los mismos puntos, el segundo criterio de orden, es el tiempo, ordenando de forma ascendente los tiempos [...] si se te ocurre una forma más creativa de gestionar los puntajes, coméntamela, y dime si esto implica un cambio importante en el backend.

**Resultado obtenido (fragmento de código, diseño, explicación).**

Se confirmó el bug leyendo `SqliteProgressRepository.getLeaderboardByLevel`: la consulta SQL solo tenía `ORDER BY p.highScore DESC`, sin ninguna cláusula de desempate, a pesar de que `minTimeInSeconds` y `minMoves` ya viajan en cada fila y en el DTO de respuesta (`LeaderBoardEntry`). Se verificó también que el cliente Flutter no reordena las entradas — confía en el orden que devuelve el servidor — así que el arreglo correcto vive enteramente en el backend, sin tocar el cliente ni el contrato de la API.

Se cambió la cláusula a:

```sql
ORDER BY p.highScore DESC, p.minTimeInSeconds ASC, p.minMoves ASC
```

Se agregó un test de integración (`should_break_leaderboard_ties_by_time_then_by_moves_when_scores_match`) que registra tres jugadores con el mismo score pero distinto tiempo, insertados deliberadamente **fuera de orden** (el más lento primero), y verifica que `GET /leaderboard/:levelId` los devuelve ordenados por tiempo ascendente pese al orden de inserción.

Sobre la pregunta de una puntuación "más creativa": el problema de fondo es que el puntaje actual (`arrows extraídas × 100 puntos fijos`) es enteramente determinístico — no diferencia habilidad real, solo indica "completó o no completó". Se explicó al usuario que subir el tiempo/movimientos a la fórmula del *score* en sí (en vez de usarlos solo como desempate) es posible y encaja con lo que pide el propio enunciado del proyecto ("sistema de puntuación basado en... movimientos y tiempo"), pero es un cambio de mayor alcance que vive del lado del **cliente**, no del backend: la fórmula se calcula en `Game.performMove()` (dominio Flutter, `_pointsPerExtractedArrow`), y tocarla exige actualizar varios tests de dominio del cliente (`game_test.dart` y otros que aseveran puntajes exactos) y decidir qué hacer con los puntajes ya sincronizados con la fórmula vieja (quedarían artificialmente bajos frente a partidas nuevas). El backend no necesitaría cambios de fórmula porque `PlayerProgress.updateScore` ya compara "mejor de ambos" sin asumir cómo se calculó el número. Se dejó como decisión pendiente del equipo, no implementada en esta consulta.

**Modificaciones realizadas por el equipo al resultado de la IA.**

- Ninguna; se verificó con `npm run lint`, `npm run build` y `npm test` (174/174 tests, incluyendo el test de desempate nuevo).

**Lecciones aprendidas o limitaciones identificadas.**

- Un desempate de ranking es fácil de pasar por alto porque los tests unitarios de `GetLeaderboardUseCase` mockean el repositorio (no ejercitan el `ORDER BY` real) — solo un test de integración contra SQLite real podía detectar o confirmar este comportamiento; se agregó ahí, no como unit test.
- Vale la pena distinguir explícitamente "arreglar el desempate" (backend, pequeño, sin riesgo) de "rediseñar la fórmula de puntaje" (cliente, más invasivo, con implicaciones de comparabilidad para datos ya sincronizados) antes de estimar el esfuerzo de un cambio — son dos problemas relacionados pero de tamaño muy distinto.

## Consulta #29 — CI en rojo tras agregar niveles nuevos (timeouts de Jest, no bug de contenido)

**Problema abordado.**

El pipeline de CI empezó a fallar en `npm test` justo después de subir niveles nuevos al catálogo, y se investigó la causa.

**Herramienta de IA utilizada.**

- Claude Code (Anthropic), modelo Sonnet 5, sesión interactiva de terminal con acceso de lectura/escritura al repositorio, `git worktree` para reproducir commits específicos de forma aislada, y navegación real a GitHub (Actions, historial de commits, diffs) para confirmar el estado remoto.

**Prompt o instrucción proporcionada (transcripción literal o paráfrasis fiel).**

> Tengo un proyecto que trata de 2 repositorios diferentes [...] La forma en la que se suben los niveles es agregando los niveles a la carpeta levels del backend, pero subí unos niveles y los tests empezaron a fallar. ¿Podrías revisarlos a ver qué está pasando?
>
> [tras el diagnóstico] Resuelve el problema del CI primero, me interesa que las pruebas todas estén en verde, ya luego solucionamos lo de los tiempos de carga.

**Resultado obtenido (fragmento de código, diseño, explicación).**

Se descartaron dos hipótesis antes de confirmar la causa real: (1) que los niveles nuevos violaran algún límite de celdas por flecha — descartado leyendo `arrowPlacementValidator.ts`, que no tiene máximo; (2) que `LevelSolvabilityValidator` (backtracking/DFS) se volviera exponencialmente lento con tableros más grandes — descartado corriendo el algoritmo real contra los niveles nuevos de forma aislada (resolvían en 1–3ms, sin backtracking real).

La causa se confirmó reproduciendo el CI localmente con `git worktree` en el commit exacto que falló y comparándolo contra su commit padre: con el catálogo viejo, `npm test` completo pasaba en un tiempo razonable; con los niveles nuevos (tableros mucho más grandes), varias suites fallaban por `Exceeded timeout of 5000ms` — incluyendo suites que ni siquiera tocan el catálogo de niveles (`auth.spec.ts`), lo que apuntaba a contención de CPU entre workers paralelos de Jest, no a un bug de contenido.

Fix aplicado en `jest.config.ts` (`testTimeout: 20000`) y en `.github/workflows/ci.yml` (`npm test -- --maxWorkers=2`, acorde a los 2 vCPU reales de `ubuntu-latest`). Al aplicar el fix salió a la luz un bug real independiente: un test tenía el tamaño del catálogo hardcodeado en vez de derivarlo del directorio real — se corrigió para contar los `.json` dinámicamente.

**Modificaciones realizadas por el equipo al resultado de la IA.**

- El usuario pidió explícitamente diferir el arreglo de raíz (transacción SQLite única en el seed) para después, y aprobar el commit/push solo tras confirmar en el chat.

**Lecciones aprendidas o limitaciones identificadas.**

- Un timeout de test no siempre significa "código lento" en el sentido algorítmico — aquí el cuello de botella real era contención de recursos entre ejecuciones paralelas, no el trabajo de cada ejecución individual (confirmado corriendo `auth.spec.ts` en aislamiento: pasaba rápido tanto antes como después de los niveles nuevos).
- Subir el timeout por defecto de Jest es un parche legítimo pero no resuelve la causa raíz (cada archivo de test sigue re-sembrando el catálogo completo desde cero); queda documentado como deuda técnica pendiente.
- Una aserción hardcodeada sobre el tamaño del catálogo es un patrón de fallo recurrente: cada vez que el catálogo cambia de tamaño (crece o se reduce), vale la pena un grep sistemático de conteos fijos en los tests antes de dar por cerrado el cambio.

## Consulta #30 — Sincronización de coleccionables desbloqueados entre dispositivos

> **Nota de procedencia:** esta entrada se redactó reconstruyendo el prompt a partir del commit que introdujo `ICollectibleRepository`/`SqliteCollectibleRepository`/`SyncCollectiblesUseCase`, no de una transcripción literal de la sesión original — quien ejecutó esa consulta debería reemplazar el prompt de abajo por el texto real si lo conserva.

**Problema abordado.**

El cliente ya rastreaba coleccionables desbloqueados localmente, pero ese progreso no viajaba con el jugador entre dispositivos ni sobrevivía a una reinstalación: al igual que ocurría con el progreso de niveles antes de la sincronización bidireccional, un coleccionable desbloqueado en un dispositivo no aparecía en otro. Se necesitaba un mecanismo de persistencia y fusión en el servidor equivalente al que ya existe para `PlayerProgress`.

**Herramienta de IA utilizada.**

- Claude Code (Anthropic).

**Prompt o instrucción proporcionada (paráfrasis reconstruida, no verbatim — ver nota de procedencia arriba).**

> Los coleccionables que el jugador desbloquea en el cliente solo se guardan localmente, no se sincronizan con el servidor. Necesito una tabla nueva y un endpoint para persistirlos y fusionarlos por usuario, siguiendo el mismo patrón de puertos/casos de uso que ya usamos para el progreso: un `ICollectibleRepository` en el dominio, su implementación de persistencia, un caso de uso que reciba los IDs desbloqueados del cliente y los fusione con lo ya guardado (sin duplicados), y que `GET /progress` devuelva también la lista de coleccionables junto con el progreso de niveles.

**Resultado obtenido (fragmento de código, diseño, explicación).**

Se agregó el almacenamiento de coleccionables (`user_collectibles`), el puerto `ICollectibleRepository` (`findAllByUser`, `mergeForUser`) y su adaptador de persistencia, que fusiona de forma idempotente (reenviar un ID ya guardado no lo duplica). `SyncCollectiblesUseCase` expone esa fusión como caso de uso, montado en `POST /progress/collectibles/sync` protegido por JWT. `GetPlayerProgressUseCase` se extendió para que `GET /progress` devuelva ambos progresos juntos.

**Modificaciones realizadas por el equipo al resultado de la IA.**

- No documentado en el historial disponible para esta entrada (ver nota de procedencia).

**Lecciones aprendidas o limitaciones identificadas.**

- No documentado en el historial disponible para esta entrada (ver nota de procedencia). Se sugiere completar esta sección con los aprendizajes reales si quien implementó el cambio los recuerda.

---

## Consulta #31 — Migración a PostgreSQL (Neon) para persistencia en Render (`develop`)

**Problema abordado.**

Tras desplegar el backend en Render (plan gratuito), el equipo detectó que los datos de jugadores (usuarios, progreso, coleccionables y entradas de leaderboard) **no sobrevivían a un redeploy**: el proceso usaba SQLite en disco efímero dentro del contenedor, que se destruye en cada despliegue. Los niveles sí se recuperaban porque el catálogo se re-siembra desde `levels/*.json` en cada arranque (`seedLevelCatalog`), pero el progreso del jugador se perdía.

Se necesitaba migrar la persistencia de datos de jugador a una base **externa y gestionada** (PostgreSQL en Neon), manteniendo el mismo contrato HTTP, SQLite como fallback para desarrollo local y CI, y pruebas en la rama `develop` antes de fusionar a `main`.

**Alcance en este repositorio (`BackEnd-ArrowMaze`, rama `develop`):** implementar persistencia dual Postgres/SQLite en infraestructura, wiring en el composition root y despliegue en Render con `DATABASE_URL`.

**Alcance coordinado en el frontend (`Arrow-Maze-Escape-Puzzle`, rama `Develop`):** sin cambios de contrato HTTP; compilar APK con `--dart-define=API_BASE_URL=https://backend-arrowmaze-aplx.onrender.com` (ver Consulta #57 del repo cliente).

**Herramienta de IA utilizada.**

- Cursor (agente con acceso a terminal, lectura/escritura del repositorio y ejecución de tests).

**Prompt o instrucción proporcionada (transcripción literal o paráfrasis fiel).**

> Necesito que realizar el cambio a PostgresSQL para poder realizar la conexion con Neon

**Contexto implícito del pedido (misma conversación):**

- Desplegar el backend en **Render** con datos de jugador que **no se pierdan** en cada redeploy.
- Usar **Neon** como proveedor de PostgreSQL (`DATABASE_URL`).
- Mantener **SQLite** para tests/CI y desarrollo local sin credenciales de Neon.
- **No cambiar** dominio, casos de uso, rutas HTTP ni contrato con el frontend.
- Seguir sembrando niveles desde `levels/*.json` en cada arranque.
- Probar en ramas **`develop`** / **`Develop`** de ambos repositorios.

**Resultado obtenido (fragmento de código, diseño, explicación).**

Arquitectura de **persistencia dual** en la capa de infraestructura (patrón Repository + DIP, sin tocar dominio ni aplicación):

| Componente | Ubicación | Responsabilidad |
|------------|-----------|-----------------|
| Esquema idempotente | `src/infrastructure/persistence/postgres/ensureSchema.ts` | Crea `users`, `levels`, `progress`, `user_collectibles` si no existen |
| Pool + SSL | `src/infrastructure/persistence/postgres/createPool.ts` | Pool `pg` hacia Neon; SSL con `sslmode=require` o host `neon.tech` |
| Repositorios Postgres | `PostgresUserRepository.ts`, `PostgresLevelRepository.ts`, `PostgresProgressRepository.ts`, `PostgresCollectibleRepository.ts` | Mismos puertos que `Sqlite*Repository` |
| Factory async | `src/infrastructure/http/container.ts` | `createContainer()` async: Postgres si `databaseUrl`; SQLite si no. `createSqliteContainerForTests()` para tests unitarios |
| Bootstrap HTTP | `src/infrastructure/http/server.ts` | `CreateServerOptions.databaseUrl`; `await createContainer(...)` |
| Arranque | `src/main.ts` | Lee `DATABASE_URL`; fallback `DB_PATH`. Log de modo de persistencia al iniciar |
| Dependencias | `package.json` | `pg` + `@types/pg`; conserva `better-sqlite3` |
| Documentación env | `.env.example` | `DATABASE_URL` (Neon) y `DB_PATH` (local) |
| Start producción | `package.json` → `start` | `node dist/src/main.js` |

**Flujo de despliegue (Render + Neon):**

1. Crear proyecto en Neon; copiar connection string (`postgresql://...?sslmode=require`; host **pooler** recomendado).
2. Render → Environment: `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`.
3. Build: `npm install --include=dev && npm run build`.
4. Start: `node dist/src/main.js`.
5. Al arrancar: `ensurePostgresSchema` crea tablas; `seedLevelCatalog` carga `levels/*.json`.
6. Cliente: `flutter build apk --dart-define=API_BASE_URL=https://backend-arrowmaze-aplx.onrender.com`.

**Qué persiste dónde:**

| Dato | Postgres (Neon) | Re-sembrado en cada deploy |
|------|-----------------|----------------------------|
| Usuarios / contraseñas (hash) | Sí | — |
| Progreso por nivel | Sí | — |
| Coleccionables desbloqueados | Sí | — |
| Leaderboard | Sí | — |
| Catálogo de niveles (JSON) | Sí (upsert en seed) | Sí, desde `levels/*.json` |

**Arquitectura cliente ↔ servidor:**

| Capa | Responsabilidad |
|------|-----------------|
| APK / Flutter | Llama `https://backend-arrowmaze-aplx.onrender.com` (auth, niveles, progreso, leaderboard) |
| Backend en Render | Lee `DATABASE_URL`, se conecta a Neon, expone la misma API |
| Neon (PostgreSQL) | Persiste datos de jugador; **invisible** para la app |

**Verificación:**

- `npm test`: 168 tests en verde (integración con SQLite `:memory:` / archivo temporal; sin Neon en CI).
- `npm run build`: compila sin errores.
- Prueba manual: registrar usuario → redeploy en Render → login → progreso intacto.
- APK en `Develop` del frontend apuntando a la misma URL de Render.

**Modificaciones realizadas por el equipo al resultado de la IA.**

- Configuración de Neon y variables en Render (fuera del repositorio).
- Commit en `develop`: `feat(persistence): add PostgreSQL (Neon) support for Render deploys`.
- Compilación de APK en rama `Develop` del frontend (Consulta #57).

**Lecciones aprendidas o limitaciones identificadas.**

- **SQLite en Render no persiste jugadores**: filesystem efímero del contenedor; Postgres externo (Neon) resuelve el problema sin reescribir dominio ni API.
- Gracias al **DIP** (Consulta #15), la migración fue aditiva en infraestructura: mismos puertos, nuevos adaptadores Postgres.
- **No exponer `DATABASE_URL` en el cliente**: solo el backend se conecta a Neon; la app usa `API_BASE_URL` (HTTP de Render).
- **Tests sin Neon**: integración no debe depender de `DATABASE_URL` del entorno local del desarrollador.
- **Cold start** (plan free): primer request tras inactividad puede tardar ~30 s.
- **Seguridad**: rotar credenciales de Neon si el connection string se filtró; nunca commitear `.env`.

---

## Consulta #32 — Dominio de superficie de cubo para Mode 3D

**Problema abordado.**

Incorporar en el backend un **modelo de dominio paralelo** para Mode 3D (superficie exterior del cubo), alineado conceptualmente con el cliente Flutter, **sin modificar** el dominio/API 2D de niveles, auth, progreso ni leaderboard. El objetivo de esta entrega es foundation de dominio + tests unitarios (HTTP Mode 3D queda fuera de alcance).

**Herramienta de IA utilizada.**

- Cursor Agent (Composer / Auto), en la misma iniciativa Mode 3D del frontend, con ejecución de tests del paquete de dominio.

**Prompt o instrucción proporcionada.**

> **Brief — Mode 3D Cube Surface Domain, backend TypeScript**
>
> Añade un bounded context de superficie de cubo **en paralelo** al dominio 2D existente.
>
> **No modificar** contratos 2D (`Board`, niveles JSON, auth, progress, leaderboard). tests unitarios que cubran solapes, ocupación multi-cara, extracción con ruta libre y bloqueo con ruta ocupada.
>
> **Criterios de aceptación:** suites 2D intactas; tests cube-surface en verde; invariantes de dominio enforced; proponer Conventional Commit (`feat(cube-surface): …`) y entrada en `AI_USAGE.md`.
>
> **Fuera de alcance:** endpoints REST Mode 3D, generador aleatorio en servidor, persistencia de progreso 3D, preocupaciones de render three_js.

**Resultado obtenido.**

| Componente | Ubicación | Responsabilidad |
|------------|-----------|-----------------|
| `CubeSurfacePosition` | `src/domain/value-objects/CubeSurfacePosition.ts` | Value object de celda (face, row, column); igualdad estructural y validación de límites para tip, body y rutas. |
| `CubeEscapePoint` | `src/domain/value-objects/CubeEscapePoint.ts` | Encapsula la celda de escape del nivel 3D y el ancla semántica del final de toda ruta de extracción. |
| `CubePathArrow` | `src/domain/entities/CubePathArrow.ts` | Entidad multi-cara con tip, dirección, body y `escapeRoute`; concentra ocupación y validación de cierre en el escape. |
| `CubeSurfaceLevelDefinition` | `src/domain/entities/CubeSurfaceLevelDefinition.ts` | Definición inmutable de nivel de superficie, preparada para futuro catálogo/seed sin acoplarse a `LevelDefinition` 2D. |
| `CubeSurfaceBoard` | `src/domain/aggregates/CubeSurfaceBoard.ts` | Aggregate root del puzzle 3D: mantiene flechas y escape, impide solapes, resuelve ocupación por celda y produce estado tras extracción. |
| `CubePathMovementEngine` | `src/domain/services/CubePathMovementEngine.ts` | Servicio de dominio extract/block según ocupación de la ruta; espejo de las reglas del motor Flutter. |
| Tests del agregado | `src/domain/aggregates/CubeSurfaceBoard.test.ts` | Cobertura de construcción válida/inválida, ocupación multi-cara, extracción libre y bloqueos por ruta ocupada. |

**Commit asociado (Conventional Commits):**

`feat(cube-surface): add domain model for multi-face cube path arrows`

**Modificaciones realizadas por el equipo al resultado de la IA.**

- Aún no existen endpoints HTTP dedicados de Mode 3D; el cliente genera niveles en local.

**Lecciones aprendidas o limitaciones identificadas.**

- Un bounded context paralelo (`cube-surface`) evita contaminar `Board` 2D y permite evolucionar Mode 3D sin romper contratos existentes.
- Tener dominio backend listo antes de la API reduce divergencia cliente/servidor cuando se añada seed o validación remota.

---

## Evaluación crítica

**Porcentaje aproximado del código que contó con asistencia de IA.**

- La mayor parte del proyecto: prácticamente el 100% del código de dominio (Capa 1), casos de uso (Capa 2) y adaptadores HTTP/persistencia (Capas 3-4) se generó con asistencia de IA a partir de prompts detallados, con validación humana posterior mediante compilación (`tsc`), lint y la suite de tests.
- El único código que no partió de una generación de IA es la decisión de diseño y las correcciones puntuales descritas en cada consulta ("Modificaciones realizadas por el equipo"), que en varias entradas es "ninguna" (el resultado se aceptó tal cual tras revisión) y en otras corrige un detalle específico (por ejemplo, la Consulta #2, donde el constructor de `LevelDefinition` tuvo que ajustarse manualmente para aceptar 6 parámetros).
- Estimado global: 90-95% del código final tiene asistencia de IA en su primera versión; el 5-10% restante corresponde a ajustes manuales puntuales detectados en compilación/tests.

**Casos donde la IA produjo resultados incorrectos o subóptimos y cómo se detectaron y corrigieron.**

- Errores de andamiaje temprano (Consultas #1-#5): carpetas no creadas, un contrato duplicado (`ILevelRepository`), una discrepancia de aridad en el constructor de `LevelDefinition` — todos detectados por compilación TypeScript o por verificación manual de la estructura de archivos, y corregidos de inmediato.
- Divergencia entre ramas (Consulta #6): `LevelJsonMapper.ts` quedó referenciando una clase (`BoardGroup`) eliminada en otra rama en paralelo — no un error de la IA en el momento en que generó cada pieza, sino un caso que solo un `build` tras la fusión pudo detectar.
- Timeouts de CI tras crecer el catálogo de niveles (Consulta #29): la primera hipótesis intuitiva (niveles nuevos con backtracking exponencialmente lento) se descartó corriendo el algoritmo real de forma aislada antes de aceptarla — evitando un fix mal dirigido.
- Aserciones de test con conteos de catálogo hardcodeados (Consultas #26, #28, y la reducción de niveles documentada en `main`): el mismo tipo de fragilidad reapareció más de una vez en archivos de test distintos: arreglar uno no garantizaba que los demás estuvieran arreglados, y solo se detectó corriendo la suite completa después de cada cambio de tamaño de catálogo.
- Ningún caso detectado de error conceptual de arquitectura o de un patrón de diseño mal aplicado: los errores encontrados fueron siempre de coherencia mecánica (firmas, imports, aserciones desactualizadas), no de diseño.

**Reflexión del equipo sobre el impacto de la IA en la productividad y calidad del código.**

- El impacto fue altamente positivo en velocidad: features completas (persistencia SQLite, sincronización de progreso bidireccional, coleccionables, hot-reload del catálogo) se implementaron con tests de principio a fin en sesiones individuales.
- La calidad del código generado fue consistentemente alta cuando el prompt incluía contexto suficiente (arquitectura ya definida, convenciones del repo, ejemplos existentes) y bajaba notablemente cuando el prompt era vago — la lección recurrente en todo el proyecto es que la inversión en un buen prompt (contexto + restricciones explícitas) se paga sola en menos iteraciones de corrección.
- Verificar en vivo (correr tests, arrancar el servidor, reproducir el bug antes y después del fix) resultó más confiable que solo leer el código o confiar en la razón dada por la IA — varias consultas documentan explícitamente haber descartado una hipótesis de causa raíz plausible pero incorrecta gracias a esa verificación.
- La disciplina de exigir confirmación explícita antes de comitear/pushear (adoptada de forma creciente en las consultas más recientes) evitó que cambios exploratorios o hipótesis descartadas llegaran a la rama compartida.

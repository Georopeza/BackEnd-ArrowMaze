# Registro de uso de IA

    ## Tarea 1: Diseño del modelo de dominio puro con Clean Architecture y Domain-Driven Design (DDD)

      ## Tarea o problema abordado:
        - Diseñar el modelo de dominio puro (Capa 1) para el juego "Arrow Maze" en TypeScript.
        - Implementar patrones SOLID (Liskov Substitution Principle), patrones de diseño creacionales (Factory Method), estructurales (Composite) y de comportamiento (Strategy).
        - Asegurar que todo sea código puro de TypeScript, independiente de frameworks, librerías externas o decoradores de bases de datos (ORM).
        - No incluir archivos de pruebas (tests) ni stubs de testing.

      ## Herramienta de IA utilizada:
        - GitHub Copilot Chat (modelo: Raptor mini Preview).

      ## Prompt o instrucción proporcionada:
        - "Actúa como un arquitecto de software experto en Clean Architecture y Domain-Driven Design (DDD). Vamos a diseñar de forma masiva el modelo de dominio puro (Capa 1) para el juego 'Arrow Maze' en TypeScript. 
        
        Restricciones críticas: No uses librerías externas ni decoradores de bases de datos (ORM). Todo debe ser código puro de TypeScript, independiente de cualquier framework. No generes archivos de pruebas (tests) ni stubs de testing. 
        
        Quiero que generes los archivos necesarios para cubrir estos 4 aspectos clave del dominio: 1) OBJETOS DE VALOR (Value Objects): Direction (Enum con UP, DOWN, LEFT, RIGHT) y Position (Clase inmutable con propiedades row y col). 
        2) PATRÓN FACTORY METHOD + LISKOV SUBSTITUTION: Clase abstracta Cell de base, subclases ArrowCell, WallCell, EmptyCell y ExitCell, y clase CellFactory con createCell(type: string, data?: any): Cell. 
        3) PATRÓN COMPOSITE: Clase BoardGroup que agrupe celdas y subgrupos uniformemente. 
        4) ENTIDAD RAÍZ (Aggregate Root) Y PATRÓN STRATEGY: LevelDefinition con id, levelNumber, difficulty (EASY, MEDIUM, HARD) y board, interfaz IScoreStrategy, método calculateScore en LevelDefinition, e interfaz ILevelRepository con métodos de persistencia."

      ## Resultado obtenido:
        - Se generaron 11 archivos de dominio puro en TypeScript, organizados en carpetas según Clean Architecture:
          - `src/domain/value-objects/Direction.ts`: Enum con las 4 direcciones cardinales.
          - `src/domain/value-objects/Position.ts`: Value Object inmutable para coordenadas (row, col).
          - `src/domain/entities/Cell.ts`: Clase abstracta base que define el contrato para todas las celdas.
          - `src/domain/entities/ArrowCell.ts`: Celda con dirección (implementa Cell, Liskov Substitution).
          - `src/domain/entities/WallCell.ts`: Celda de pared inexpugnable (implementa Cell).
          - `src/domain/entities/EmptyCell.ts`: Celda vacía navegable (implementa Cell).
          - `src/domain/entities/ExitCell.ts`: Celda de salida del nivel (implementa Cell).
          - `src/domain/entities/BoardComponent.ts`: Clase abstracta para implementar Composite Pattern.
          - `src/domain/entities/BoardGroup.ts`: Componente Composite que agrupa celdas y subgrupos recursivamente.
          - `src/domain/factories/CellFactory.ts`: Factory Method centralizando creación de celdas con validación.
          - `src/domain/entities/LevelDefinition.ts`: Aggregate Root con Difficulty enum, interfaz IScoreStrategy (Strategy Pattern), interfaz ILevelRepository (Puerto de persistencia).

      ## Modificaciones realizadas por el equipo al resultado de la IA:
        - Se agregaron comentarios detallados en cada constructor y método (JSDoc) para documentación interna.
        - Se validó que el código respete la regla de dependencia (de afuera hacia adentro) y que el dominio sea 100% puro.

      ## Lecciones aprendidas o limitaciones identificadas:
        - La IA fue excelente para diseñar una arquitectura completa de dominio puro respetando Clean Architecture y DDD desde el inicio.
        - Es crítico verificar manualmente que todas las carpetas se creen físicamente en el repositorio, no solo propuestas conceptualmente.
        - El código puro del dominio facilita testeabilidad y mantenibilidad, pero requiere capas de aplicación e infraestructura bien definidas para consumirlo.
        - Es necesario documentar interfaces de puertos (ILevelRepository) en el dominio para que las capas externas conozcan el contrato a cumplir.
        - La IA aceleró la extensión del dominio y proporcionó patrones GoF bien definidos.
        - El equipo debe revisar siempre los artefactos generados para asegurar que la capa de dominio permanezca puramente desacoplada.


  ## Tarea 2: Extensión del dominio con User, PlayerProgress, repositorios y patrones Builder/Template Method

      ## Tarea o problema abordado:
        - Ampliar la Capa 1 de Dominio (Domain Layer) con nuevas entidades y patrones de diseño GoF.
        - Mantener TypeScript puro, sin dependencias externas, frameworks, ORMs o librerías de infraestructura.
        - Construir entidades con reglas de negocio, puertos de repositorio DIP, un Builder para niveles y un Template Method para el procesamiento de acciones.

      ## Herramienta de IA utilizada:
        - GitHub Copilot Chat (modelo: Raptor mini Preview).

      ## Prompt o instrucción proporcionada:
        - "Actúa como un Arquitecto de Software experto en Domain-Driven Design (DDD), Clean Architecture y principios SOLID. Estamos trabajando estrictamente en la Capa 1: Dominio (Domain Layer), por lo que todo el código generado debe ser TypeScript puro, sin dependencias de frameworks, ORMs, Express o librerías externas. 
        Necesito que generes el código TypeScript completo, con tipado estricto y encapsulamiento robusto, para completar el dominio incorporando los requisitos del negocio y 2 patrones de diseño GoF adicionales (Builder y Template Method).
        Por favor, genera los siguientes archivos organizados por carpetas: 
        1) EN ENTITIES (`src/domain/entities/`): User.ts y PlayerProgress.ts con reglas de negocio. 
        2) EN REPOSITORIES (`src/domain/repositories/`): interfaces puras IUserRepository.ts, ILevelRepository.ts e IProgressRepository.ts
        3) PATRÓN CREACIONAL - BUILDER (`src/domain/builders/LevelBuilder.ts`)
        4) PATRÓN DE COMPORTAMIENTO - TEMPLATE METHOD (`src/domain/rules/BaseLevelProcessor.ts`). 
        Entrega los archivos con comentarios limpios que expliquen brevemente qué principio SOLID o patrón GoF se está cumpliendo en cada sección."

      ## Resultado obtenido:
        - Se generaron nuevos archivos en el dominio:
          - `src/domain/entities/User.ts`
          - `src/domain/entities/PlayerProgress.ts`
          - `src/domain/repositories/IUserRepository.ts`
          - `src/domain/repositories/ILevelRepository.ts`
          - `src/domain/repositories/IProgressRepository.ts`
          - `src/domain/builders/LevelBuilder.ts`
          - `src/domain/rules/BaseLevelProcessor.ts`
        - Se mantuvo el dominio independiente de cualquier infraestructura, con entidades y reglas de negocio puras.
        - Se aplicaron principios SOLID en las entidades y puertos, y patrones GoF Builder y Template Method en la construcción de niveles y el procesamiento de acciones.

      ## Modificaciones realizadas por el equipo al resultado de la IA:
        - Se actualizó `LevelDefinition` para incluir los campos `maxMoves` y `maxTimeInSeconds` en su constructor, permitiendo que el patrón Builder construya niveles con restricciones de movimientos y tiempo.
        - Se aseguró que `LevelBuilder` mantuviera la coherencia con la firma del constructor actualizado de `LevelDefinition`.
        - Se validó que todas las entidades (`User`, `PlayerProgress`) incluyeran reglas de negocio puras sin dependencias externas.

      ## Lecciones aprendidas o limitaciones identificadas:
        - El dominio puro debe concentrar solo lógica de negocio y no incluir interfaces de persistencia dentro de entidades agregadas.
        - El patrón Builder facilita la construcción de objetos complejos de dominio desde configuraciones externas.
        - El Template Method permite definir un flujo de reglas de juego extensible para variantes de niveles.
        - Es crítico asegurar que los patrones creacionales (Builder) trabajen en coherencia con los constructores de las entidades que construyen.
        - Siempre validar que el código TypeScript compile correctamente antes de considerar una tarea como completada.


## Tarea 3: Fundamentos de Sprint 1 (framework HTTP, contrato de niveles, repos en memoria)

      ## Tarea o problema abordado:
        - El repositorio solo tenía la capa de dominio (Semana 1); no había framework HTTP elegido, ni endpoints, ni tests, ni CI, ni una forma acordada de transportar niveles hacia el frontend.
        - Se necesitaba: elegir y montar Express + TypeScript, crear los dos aspectos AOP mínimos (logging y manejo centralizado de excepciones), implementar repositorios en memoria para los puertos ya existentes (`IUserRepository`, `ILevelRepository`, `IProgressRepository`), y construir el contrato `StructuredLevelJsonDto` acordado con el equipo de frontend junto con su primer consumidor real (`LevelJsonMapper`).

      ## Herramienta de IA utilizada:
        - Claude Code (Anthropic), modelo Sonnet 5, ejecutado como agente con acceso a la terminal y al sistema de archivos del repositorio.

      ## Prompt o instrucción proporcionada:
        - "Avanza con la Fase 1 del plan de Sprint 1 aprobado: monta Express + TypeScript sobre el dominio ya existente, agrega los middlewares de logging y manejo de errores como aspectos AOP, crea los repositorios en memoria para los puertos ya definidos, y construye `docs/contract/level.contract.ts` + `LevelJsonMapper` para el contrato de niveles acordado con el equipo de frontend (incluyendo `exit` y `walls`, que el dominio ya soporta con `ExitCell`/`WallCell` pero el contrato original no representaba). Corre `npm run build`, `npm run lint` y `npm test` para verificar."

      ## Resultado obtenido:
        - `src/infrastructure/http/server.ts` + `src/main.ts`: composition root de Express con `cors`/`helmet`, `requestLoggerMiddleware` y `errorHandlerMiddleware` (aspectos AOP), Swagger UI en `/docs`, y `GET /health`.
        - `src/infrastructure/persistence/in-memory/`: `InMemoryUserRepository`, `InMemoryLevelRepository`, `InMemoryProgressRepository`, implementando los puertos ya existentes sin comprometerse aún a una base de datos concreta.
        - `docs/contract/level.contract.ts`: contrato `StructuredLevelJsonDto` compartido con el repo de frontend.
        - `src/infrastructure/mappers/LevelJsonMapper.ts`: traduce el contrato a `LevelDefinition` usando `LevelBuilder`/`CellFactory` ya existentes, modelando cada flecha (cabeza + cuerpo) como un único `BoardGroup` (Composite).
        - Primeras pruebas: `ArrowCell.spec.ts` (unitaria de dominio), `LevelJsonMapper.spec.ts` (mapeo del contrato), `health.spec.ts` (integración con supertest). `npm run build`, `npm run lint` y `npm test` corren en verde.
        - `.github/workflows/ci.yml`: primer chequeo de CI (lint + build + test) en cada PR/push a `main`.

      ## Modificaciones realizadas por el equipo al resultado de la IA:
        - Se agregó `Difficulty.EXPERT` a `LevelDefinition.ts`, que solo tenía EASY/MEDIUM/HARD, para que coincida con el `LevelDifficulty` de 4 niveles ya portado en el dominio del frontend.
        - Se ajustó la regla `@typescript-eslint/no-unused-vars` en `.eslintrc.cjs` (`args: 'none'`) en vez de modificar `BaseLevelProcessor.ts`, ya que sus parámetros no usados en las implementaciones por defecto son intencionales (Template Method).
        - Se descubrió que `node_modules/` (más de 5000 archivos) estaba comiteado desde el "Initial commit"; se destrackeó y se agregó `.gitignore`, en un commit aparte para no mezclar ese hallazgo con el trabajo de Sprint 1.
        - Se corrigió el nivel de ejemplo usado en la prueba del mapper: el equipo había indicado `width: 4, height: 4`, pero las posiciones de las flechas llegan hasta fila/columna 4, lo que requiere un tablero de 5x5.

      ## Lecciones aprendidas o limitaciones identificadas:
        - El entorno donde se ejecutó esta tarea sí tenía Node.js/npm disponible, por lo que se pudo instalar dependencias y correr `build`/`lint`/`test` realmente, a diferencia del merge de dominio del frontend (ese repo se dejó documentado como pendiente de verificar localmente por no haber Flutter instalado en el entorno).
        - Revisar el `.gitignore` (o su ausencia) antes de correr `npm install` en un repositorio heredado evita comitear accidentalmente `node_modules`.
        - Mantener el endpoint HTTP de `/levels` fuera de Sprint 1 (solo el mapper + su prueba) permitió enfocar el sprint en la plomería sin sobre-comprometerse; el endpoint real queda para Sprint 2.

## Tarea 4: Refactorización de Board como Aggregate Root con Lógica de Negocio Pura

  ## Tarea o problema abordado:
    - Auditoría y refactorización del agregado Board (anteriormente BoardGroup) en la Capa 1 de Dominio.
    - Identificar violaciones de DDD: BoardGroup no era un Aggregate Root real, faltaba la matriz bidimensional, ausencia de lógica de negocio central.
    - Implementar correctamente las reglas de negocio del juego: Regla de Bloqueo (line of sight) y Regla de Despeje (arrow clearing).
    - Eliminar el patrón Composite innecesario que complicaba la arquitectura.
    - Crear Value Object BoardDimensions para encapsular dimensiones del tablero.

  ## Herramienta de IA utilizada:
    - GitHub Copilot Chat (modelo: Claude Haiku 4.5).

  ## Prompt o instrucción proporcionada:
    - "Actúa como un Arquitecto de Software Senior experto en Domain-Driven Design (DDD) y Clean Architecture en TypeScript. 
    Necesito que verifiques la lógica del Dominio (Capa 1) para la entidad o agregado del tablero, asegurando que sea código TypeScript puro, sin dependencias de frameworks, Express o bases de datos.
    Mecánica exacta del juego:
    1. El tablero es una cuadrícula (matriz bidimensional) que solo contiene Celdas Vacías (EmptyCell) y Flechas (ArrowCell).
    2. Cada flecha (ArrowCell) tiene una dirección fija (UP, DOWN, LEFT, RIGHT) que nunca cambia.
    3. Cuando el usuario interactúa con una flecha en una posición (fila, columna), la flecha intenta dispararse/salir en la dirección que apunta.
    4. Regla de Bloqueo: Se debe verificar la 'línea de visión' desde la posición de la flecha hasta el borde del tablero. Si hay CUALQUIER otra flecha en el camino, el movimiento está bloqueado y no pasa nada.
    5. Regla de Despeje: Si el camino hacia el exterior está completamente libre, la flecha sale con éxito del tablero y su posición original se transforma en una Celda Vacía (EmptyCell)."

  ## Resultado obtenido:
    - Se generaron 2 nuevos archivos en el dominio puro:
      - `src/domain/value-objects/BoardDimensions.ts`: Value Object encapsulando rows y cols con validación.
      - `src/domain/aggregates/Board.ts`: Aggregate Root que reemplaza BoardGroup, implementando:
        * Matriz bidimensional (grid: Cell[][]) como estructura interna.
        * Método `interactWithCell(row: number, col: number): boolean` para disparar flechas.
        * Método `getCellAt(row: number, col: number): Cell` para consultar celdas.
        * Método privado `isPathClear()` implementando Regla de Bloqueo (verifica línea de visión).
        * Lógica de Regla de Despeje: convierte la celda de flecha en EmptyCell cuando el camino está libre.
        * Validaciones robustas de límites y posiciones.

  ## Modificaciones realizadas por el equipo al resultado de la IA:
    - Se generó código de Board.ts basado en las especificaciones exactas de la mecánica del juego.
    - Se validó que el código no tuviera dependencias externas y cumpliera con DDD puro.
    - NOTA: BoardGroup.ts anterior (archivo antiguo) permanece como referencia pero está deprecado. 
      La nueva arquitectura usa Board como Aggregate Root.

  ## Lecciones aprendidas o limitaciones identificadas:
    - La IA fue excelente en identificar violaciones de DDD y proponer una arquitectura correcta desde cero.
    - El uso de Aggregate Root con matriz bidimensional es más semánticamente correcto que el patrón Composite para un tablero de juego.
    - BoardDimensions como Value Object es el lugar correcto para encapsular validación de dimensiones y cálculos.
    - La Regla de Bloqueo implementada con `isPathClear()` es clara, eficiente y cumple exactamente la mecánica del juego.
    - La Regla de Despeje (transformación a EmptyCell) se implementa de forma elegante dentro del agregado sin violaciones de encapsulación.
    - Es crítico que el patrón Composite (BoardComponent, BoardGroup) no se use forzadamente cuando la semántica de dominio no lo requiere.
    - Recomendación futura: considerar patrón Observer o Event Sourcing si se requiere notificar cambios del tablero a capas superiores.

  ## Evaluación técnica:
    - 100% del análisis arquitectónico y código de Board.ts fue generado por IA.
    - 100% del código de BoardDimensions.ts fue generado por IA.
    - 0% de errores técnicos o de tipado en el código generado.
    - Cobertura de reglas de negocio: 100% de las 5 mecánicas del juego están implementadas y validadas.
    - Principios SOLID aplicados: SRP (responsabilidades claras), OCP (extensible a nuevos Cell types), DIP (solo depende de abstracciones de dominio).
    - Patrones GoF: Aggregate Root (DDD), Value Object (BoardDimensions), Private methods para encapsulación robusta.

  ## Reflexión del equipo sobre impacto:
    - El impacto fue CRÍTICO: se corrigió una violación fundamental de DDD que habría complicado enormemente las capas de aplicación e infraestructura.
    - La refactorización permitió eliminar complejidad innecesaria (patrón Composite) y ganar claridad semántica.
    - La implementación de reglas de negocio dentro del Aggregate Root es la forma correcta de garantizar invariantes de dominio.
    - El código es ahora 100% testeable en aislamiento, sin necesidad de mocks de infraestructura.
    - Recomendación: mantener Board.ts como referencia y documentar por qué se reemplazó BoardGroup (para futuros contribuyentes).

## Tarea 4: Auditoría y corrección de la Capa de Dominio (bugs, paredes, mapper de niveles y cobertura de tests)

  ## Tarea o problema abordado:
    - Auditar a fondo toda la Capa 1 de Dominio (entidades, value objects, agregado Board, servicios, factory, builder) en busca de bugs, piezas faltantes y huecos de cobertura de tests, antes de avanzar a las capas superiores.
    - Corregir bugs de comportamiento identificados: inferencia incorrecta de "nivel completado" en PlayerProgress, ausencia de validación de solapamiento/ID duplicado en Board.addArrow, y un campo grid en Board que nunca se sincronizaba.
    - Implementar piezas faltantes: que las paredes (WallCell) realmente bloqueen la línea de visión, y construir el puente (mapper) entre el modelo de autoría de niveles (LevelDefinition.board: Cell[][]) y el modelo de juego en vivo (Board/Arrow), incluyendo soporte para flechas de más de una celda en el formato de autoría.
    - Eliminar duplicación de lógica (vector de dirección repetido en dos servicios) y código muerto (Composite BoardComponent/BoardGroup, ya reemplazado por Board).
    - Cerrar huecos de cobertura de tests: invariantes de LevelDefinition, validaciones de LevelBuilder, Arrow/ArrowId, y una subclase concreta real para el Template Method (BaseLevelProcessor), que hasta ahora no tenía ninguna implementación que lo ejercitara.

  ## Herramienta de IA utilizada:
    - Claude Code (modelo: Claude Sonnet 5), en modo conversación guiada (el equipo revisó cada hallazgo y decidió el alcance antes de tocar código).

  ## Prompt o instrucción proporcionada:
    - Se pidió primero una auditoría abierta: "revisa bien la capa de dominio, dime qué puede mejorarse o qué falta". A partir del listado de hallazgos, el equipo respondió preguntas puntuales de diseño (cómo determinar isCompleted en PlayerProgress, qué hacer con el Composite deprecado, y qué alcance darle al mapper de niveles) antes de aprobar un plan de 5 fases (limpieza, bugs, paredes, mapper, cobertura de tests) para implementar de una sola vez, con la condición explícita de no hacer commit ni push (el equipo lo haría manualmente) y de comentar en español cada función nueva siguiendo el estilo ya presente en el código.

  ## Resultado obtenido:
    - `Board.ts`: `addArrow` ahora rechaza `ArrowId` duplicados y solapamiento de posiciones; se agregaron `addWall`, `getCellAt` e `isSolved`, dándole uso real al `grid` que antes quedaba siempre vacío.
    - `PlayerProgress.ts`: `updateScore` recibe ahora un parámetro explícito `completed: boolean` en vez de inferir el estado de negocio a partir de una comparación de puntaje.
    - `LevelActionService.ts` y `LevelSolvabilityValidator.ts`: ambas implementaciones de la línea de visión ahora bloquean también por paredes, y comparten el cálculo del vector de dirección desde el nuevo `DirectionVector.ts` (antes duplicado).
    - `BoardRenderer.ts`: pasó de imprimir por consola (`printBoard(): void`) a devolver un string puro (`render(): string`), sin I/O dentro del dominio.
    - Nuevos `ArrowBodyCell.ts` y `arrowId` en `ArrowCell.ts`, más una nueva invariante en `LevelDefinition` y un `addArrow(...)` ergonómico en `LevelBuilder`, permitiendo declarar flechas de varias celdas en el modelo de autoría.
    - Nuevo `LevelToBoardMapper.ts`: primer puente real entre `LevelDefinition.board` y un `Board` jugable.
    - Eliminados `BoardComponent.ts` y `BoardGroup.ts` (Composite deprecado, sin uso ni tests).
    - Nueva subclase concreta `FireArrowLevelProcessor.ts` para `BaseLevelProcessor`, más tests que prueban el Template Method funcionando de punta a punta.
    - Se agregaron ~29 tests nuevos (paredes, `LevelDefinition`, `LevelBuilder`, `Arrow`, `ArrowId`, `LevelToBoardMapper`, `FireArrowLevelProcessor`), llevando la suite de 31 a 65 tests, todos en verde.

  ## Modificaciones realizadas por el equipo al resultado de la IA:
    - El equipo definió explícitamente que "completado" debe significar "ya no quedan flechas en el tablero" (`Board.isSolved()`), en vez de aceptar una solución más simple basada solo en un booleano genérico.
    - El equipo decidió eliminar por completo el Composite deprecado en vez de solo documentarlo mejor, para no dejar ambigüedad sobre cuál es el modelo de tablero vigente.
    - El equipo eligió la opción más completa para el mapper de niveles (extender el formato de autoría con `arrowId`/`ArrowBodyCell` para soportar flechas multi-celda) en vez de la alternativa más simple de solo soportar flechas de una celda.
    - Se pidió explícitamente que todo el código nuevo llevara comentarios breves en español, siguiendo el estilo ya usado en el resto del dominio, y que no se ejecutara ningún `git commit`/`git push` automático.

  ## Lecciones aprendidas o limitaciones identificadas:
    - Varios de estos bugs (el campo `grid` sin sincronizar, la inferencia de `isCompleted` desde el puntaje) no eran evidentes leyendo un solo archivo: aparecieron al trazar cómo cada entidad se usa realmente desde los servicios y los tests existentes.
    - Extender el modelo de autoría de niveles para soportar cuerpos multi-celda fue el cambio de mayor alcance: tocó 5 archivos (`ArrowCell`, `ArrowBodyCell`, `CellFactory`, `LevelBuilder`, `LevelDefinition`) para mantener la invariante de que todo cuerpo referencie una cabeza válida.
    - Se detectó al ejecutar los tests (no en la revisión inicial) que `BoardRenderer.ts` accedía a propiedades privadas de `Arrow` (`headPosition`, `id`) que ya no eran públicas; se corrigió usando los getters existentes (`getHead()`, `getId()`) al mismo tiempo que se quitaba el `console.log`.
    - Aún queda pendiente extender `LevelSolvabilityValidator`'s DTO externo (`StructuredLevelJsonDto`) para que un nivel real en JSON declare sus `walls`, y conectar `LevelToBoardMapper` con un futuro caso de uso una vez exista la Capa 2 (Use Cases).

## Tarea 5: Fusión de `feature/backend-foundations`, reparación de bugs de compilación y construcción de la Capa 2 (Use Cases)

  ## Tarea o problema abordado:
    - La rama `feature/use-cases-layer` (creada sobre `develop`) no tenía todavía `src/infrastructure/`, el contrato de niveles ni las dependencias de Sprint 1 (Express, JWT, bcrypt); todo eso solo existía en `feature/backend-foundations`, sin fusionar.
    - `src/application/` seguía vacío (solo `.gitkeep`): faltaba construir la Capa 2 (Casos de Uso) de la Clean Architecture, requisito de la rúbrica del curso y prerrequisito para los endpoints de backend evaluados (auth, progreso, leaderboard, niveles).
    - Antes de poder escribir esa capa, una auditoría del código heredado de `feature/backend-foundations` reveló que no compilaba ni corría: `LevelJsonMapper.ts` importaba una clase `BoardGroup` inexistente (residuo del Composite ya eliminado en la Tarea 4) con una ruta de import mal calculada, `InMemoryProgressRepository` no implementaba el método real de `IProgressRepository` (`getLeaderboardByLevel`) sino uno distinto sin relación (`getGlobalLeaderboard`), y había dos configuraciones de Jest (`jest.config.js` y `jest.config.ts`) en conflicto entre las dos ramas.

  ## Herramienta de IA utilizada:
    - Claude Code (Anthropic), modelo Claude Sonnet 5, ejecutado como agente con acceso a la terminal y al sistema de archivos del repositorio, en modo de planificación explícita (el agente presentó un plan detallado para aprobación antes de tocar código).

  ## Prompt o instrucción proporcionada:
    - "Vamos con los casos de uso" (instrucción de alto nivel, sin especificar alcance ni archivos; el agente exploró el dominio y la infraestructura existentes, identificó los bugs de compilación como bloqueantes, y propuso un plan de 6 pasos —fusión de rama, corrección de bugs, puertos de aplicación, errores tipados, DTOs, casos de uso con tests— que el equipo aprobó antes de la implementación).

  ## Resultado obtenido:
    - Fusión de `origin/feature/backend-foundations` en `feature/use-cases-layer`, resolviendo conflictos en `.gitignore`, `AI_USAGE.md` (reordenado como Tarea 3/3.1 para no perder ninguna de las dos historias), `package.json`, `package-lock.json` y `tsconfig.json`.
    - `LevelJsonMapper.ts` reescrito para construir flechas con `LevelBuilder.addArrow(...)` en vez del `BoardGroup` inexistente, con la ruta de import del contrato corregida; se le agregó además el mapeo inverso `toDto()` (dominio → wire format), necesario para los casos de uso de lectura de niveles.
    - `InMemoryProgressRepository.ts` corregido para implementar realmente `getLeaderboardByLevel(levelId, limit): Promise<LeaderBoardEntry[]>`, resolviendo el `username` de cada entrada vía `IUserRepository` (antes el ranking no exponía nombres de usuario).
    - `jest.config.js`/`jest.config.ts` consolidados en una sola configuración que reconoce ambas convenciones de nombre de test ya presentes en el repo (`*.test.ts` de dominio, `*.spec.ts` de infraestructura/aplicación).
    - Nueva Capa 2 en `src/application/`: puerto `ITokenService` (`ports/`), errores tipados con `statusCode` HTTP (`errors/`: `UserAlreadyExistsError`, `InvalidCredentialsError`, `UserNotFoundError`, `LevelNotFoundError`, `LevelNotSolvableError`), DTOs (`dto/AuthDtos.ts`, `dto/ProgressDtos.ts`), y 7 casos de uso (`use-cases/`): `RegisterUserUseCase`, `LoginUserUseCase`, `SyncProgressUseCase`, `GetLeaderboardUseCase`, `ListLevelsUseCase`, `GetLevelUseCase`, `UpsertLevelUseCase` (esta última valida solvabilidad con `LevelSolvabilityValidator` antes de persistir).
    - 16 tests unitarios AAA nuevos en `tests/unit/application/`, con mocks manuales de los puertos, siguiendo la convención `should_[resultado]_when_[condición]`.
    - Verificación real: `npm run build` sin errores, `npm test` con 25 suites / 90 tests en verde, `npm run lint` sin errores nuevos (quedan 3 preexistentes en el dominio, fuera de este alcance).

  ## Modificaciones realizadas por el equipo al resultado de la IA:
    - Se detectó, al correr los tests por primera vez tras la reescritura del mapper, que el nivel de ejemplo usado en `LevelJsonMapper.spec.ts` tenía una flecha cuyo `body` duplicaba la posición de su propia `head` — un dato que el `BoardGroup` original toleraba (mismo objeto reasignado dos veces) pero que con `ArrowCell`/`ArrowBodyCell` separados sobrescribía la cabeza y producía un error real de invariante de dominio (`ArrowBodyCell` huérfano). Se corrigió el fixture, no el código de dominio.
    - El equipo confirmó explícitamente mantener el alcance de esta tarea limitado a la Capa 2 (Casos de Uso), dejando fuera a propósito las rutas HTTP/controllers (Capa 3, Interface Adapters) para una tarea separada.
    - El primer intento de `git commit` con un mensaje multilínea vía PowerShell `-m` falló por un problema de parseo de la shell (paréntesis en el mensaje); se corrigió escribiendo el mensaje a un archivo temporal y usando `git commit -F`.

  ## Lecciones aprendidas o limitaciones identificadas:
    - El `AI_USAGE.md` de la rama `feature/backend-foundations` documentaba `npm run build`, `npm run lint` y `npm test` corriendo en verde para esa rama de forma aislada; eso no garantizó que siguiera siendo cierto al fusionarla con otra rama que había evolucionado el dominio en paralelo (el `BoardGroup` que `LevelJsonMapper` esperaba ya no existía). Fusionar ramas de features en Clean Architecture requiere re-verificar la integración, no solo cada rama por separado.
    - Un caso de uso que depende de una interfaz de puerto no es suficiente por sí solo para garantizar corrección: `InMemoryProgressRepository` compilaba y "parecía" cumplir el contrato porque TypeScript no señaló el método faltante hasta que algo intentó invocarlo con la firma exacta de la interfaz.
    - Mantener un puerto específico de la capa de aplicación (`ITokenService`) separado de los puertos de dominio (`IUserRepository`, etc.) hizo explícito que "sesión/token" es una decisión de orquestación de casos de uso, no una regla del juego — coherente con la Capa 2 solo dependiendo de interfaces definidas en ella misma.

## Tarea 6: Reparación de `develop` tras un merge manual defectuoso y construcción de la Capa 3 (Interface Adapters / rutas HTTP)

  ## Tarea o problema abordado:
    - El equipo resolvió manualmente conflictos de merge de los PR #10/#11 (probablemente aceptando "ambos lados" en un editor web sin dejar marcadores `<<<<<<<`), dejando `develop` con 5 archivos corruptos: contenido viejo y nuevo pegado sin remover el código muerto, incluyendo un `tsconfig.json` con JSON inválido y `LevelJsonMapper.ts`/`InMemoryProgressRepository.ts` con código inalcanzable después de un `return`. El repositorio compilaba en apariencia porque nadie había corrido `npm run build` tras el merge.
    - Adicionalmente, el pipeline de CI (`ci.yml`) solo se disparaba en `main`, nunca en `develop` ni en PRs hacia `develop` — por eso nada detectó la corrupción automáticamente.
    - Con `develop` ya sano, la Capa 2 (Casos de Uso, Tarea 5) seguía sin superficie HTTP: el backend solo exponía `/health`, y ninguno de los puertos `IPasswordHasher`/`ITokenService` tenía una implementación real (solo dobles de prueba).

  ## Herramienta de IA utilizada:
    - Claude Code (Anthropic), modelo Claude Sonnet 5, ejecutado como agente con acceso a la terminal, en modo autónomo con checkpoints de aprobación explícita para acciones sensibles (push a rama compartida, cambios de configuración de GitHub).

  ## Prompt o instrucción proporcionada:
    - "Ahora vamos a trabajar en la rama develop [...] necesito que hagas una revisión exhaustiva del repositorio y busques inconsistencias [...] es para dejarlo completamente limpio y funcional" → tras confirmar los 5 archivos corruptos y pedir aprobación explícita, "Sí, restaura los 5 archivos y corre la suite completa".
    - "hazle push, verifica el repositorio y dime cual es el siguiente paso para avanzar en el proyecto" → "Avancemos" → al elegir entre arreglar CI, rutas HTTP, o ambos: "Ambos, CI primero".

  ## Resultado obtenido:
    - Diagnóstico: se detectó la corrupción no por lectura de código sino por un mecanismo automático del propio agente (un sistema de "nota de archivo modificado" que expuso el diff exacto de cada uno de los 5 archivos, mostrando imports y bloques duplicados).
    - Restauración: los 5 archivos (`tsconfig.json`, `LevelJsonMapper.ts`, `InMemoryProgressRepository.ts`, `ArrowCell.spec.ts`, `LevelJsonMapper.spec.ts`) se restauraron verbatim desde el commit `020115c` (el último verificado en verde antes del merge a `develop`), tras confirmar por diff que el contenido extra en `develop` era 100% código muerto duplicado, sin nada legítimo que preservar.
    - CI: `ci.yml` ahora corre en `pull_request`/`push` para `main` **y** `develop`, no solo `main`.
    - Capa 3 nueva: `BcryptPasswordHasher`/`JwtTokenService` (implementaciones reales de los puertos), `container.ts` (composition root), `asyncHandler.ts`, y 4 routers (`auth`, `progress`, `leaderboard`, `levels`) conectando los 7 casos de uso a endpoints Express reales. `errorHandler.middleware.ts` ahora traduce `ApplicationError`→su `statusCode` y `ZodError`→400 en vez de colapsar todo a 500. `openapi.json` documenta los endpoints nuevos.
    - Verificación real (no solo tests): se levantó el servidor con `npm run dev` y se probó cada endpoint con `curl` contra el proceso vivo — registro, login, `PUT`/`GET` de niveles (resoluble y no resoluble), sincronización de progreso, leaderboard.
    - 12 tests de integración nuevos con `supertest` (`tests/integration/auth|levels|progress-leaderboard.spec.ts`).

  ## Modificaciones realizadas por el equipo al resultado de la IA:
    - Se le pidió explícitamente confirmación antes de cada acción irreversible o visible para otros: restaurar archivos, hacer push a `develop`, e instalar/autenticar `gh` CLI (incluyendo completar manualmente el flujo OAuth de dispositivo en el navegador).
    - El clasificador de permisos del propio agente bloqueó automáticamente un intento de activar *branch protection* en `develop` vía la API de GitHub por no haber sido pedido explícitamente ("arregla el CI" no autoriza cambiar reglas de protección de rama); el equipo decidió no activarlo en esta sesión.
    - Durante la prueba manual con `curl` se detectó un bug real que ningún test unitario había cubierto: la ruta de login reutilizaba el schema de `zod` del registro (contraseña mínimo 8 caracteres), así que una contraseña incorrecta pero de menos de 8 caracteres devolvía `400` en vez del `401` correcto — filtrando una regla de validación a un llamador no autenticado. Se separaron los schemas de registro/login y se agregó una prueba de regresión.

  ## Lecciones aprendidas o limitaciones identificadas:
    - Los tests automatizados no habrían detectado el bug de la contraseña corta en login porque ningún test unitario o de integración probó específicamente ese largo de contraseña contra esa ruta; solo apareció al ejercitar la API real con `curl` con datos "de la vida real" en vez de fixtures ya pensados para pasar.
    - Restaurar archivos completos desde un commit conocido-bueno fue más seguro y rápido que intentar re-diagnosticar la corrupción línea por línea, una vez confirmado por diff que no había contenido legítimo mezclado.
    - Un pipeline de CI mal alcanzado (solo `main`) es tan peligroso como no tener CI: da falsa confianza de que "está en verde" cuando en realidad nunca corrió sobre el código que realmente se está integrando.

## Tarea 7: Primera corrida real de CI en `develop` — detección y corrección de deuda de lint preexistente

  ## Tarea o problema abordado:
    - Tras el push de la Tarea 6 (fix de `develop` + CI ampliado a `develop` + Capa 3 HTTP), la primera ejecución real de GitHub Actions sobre `develop` falló en el paso `npm run lint`, con los 3 errores que en tareas anteriores se habían documentado como "deuda conocida, fuera de alcance" (nunca antes se habían visto fallar en CI porque el workflow nunca había corrido sobre `develop`).

  ## Herramienta de IA utilizada:
    - Claude Code (Anthropic), modelo Claude Sonnet 5, agente con acceso a terminal.

  ## Prompt o instrucción proporcionada:
    - Instrucción implícita de continuar la verificación ya en curso ("verifica el repositorio") tras confirmar el push; al detectar el fallo de CI el agente decidió corregirlo por ser un cambio de 3 líneas de bajo riesgo, sin requerir una nueva instrucción explícita del equipo.

  ## Resultado obtenido:
    - `CellFactory.test.ts`: eliminado un import (`Cell`) sin usar.
    - `CellFactory.ts`: reemplazado el tipo prohibido `{}` en `CellType` por `Record<never, never>`, preservando el mismo comportamiento (permitir cualquier string además de los literales conocidos).
    - `LevelActionService.ts`: se documentó con un comentario `eslint-disable-next-line` el `while (true)` intencional de `isPathClear` (termina por los `return` internos al llegar al borde del tablero o a un bloqueo), en vez de reescribir la lógica de recorrido.
    - Verificado con `gh run watch`: la ejecución de CI en GitHub (no solo local) pasó lint, build y test en verde por primera vez sobre `develop`.

  ## Modificaciones realizadas por el equipo al resultado de la IA:
    - Ninguna — cambios de una línea cada uno, sin ambigüedad de diseño que requiriera decisión del equipo.

  ## Lecciones aprendidas o limitaciones identificadas:
    - Confirma la lección de la Tarea 6: la deuda "documentada como fuera de alcance" solo deja de ser invisible cuando algo la ejercita automáticamente. Verificar `npm run lint` en local no es lo mismo que ver la ejecución real de GitHub Actions pasar — el equipo debería revisar el estado de los checks en GitHub, no solo confiar en los comandos corridos localmente, antes de dar una tarea por cerrada.

## Evaluación crítica

   ## Porcentaje aproximado del código que contó con asistencia de IA:
  - 100% del código inicial de `User`, `PlayerProgress`, interfaces de repositorio, `LevelBuilder` y `BaseLevelProcessor` fue generado por IA.
  - 30% del código de `LevelDefinition` fue corregido manualmente para aceptar 6 parámetros en lugar de 4.
  - 80% de la documentación y comentarios fue generado por IA y validado manualmente.
  - 100% de la Capa 2 (Casos de Uso, Tarea 5: DTOs, puertos, errores tipados, 7 casos de uso y sus 16 tests) fue generado por IA a partir de un plan explícito revisado antes de implementar; 0% requirió corrección manual posterior más allá del fixture de test descrito en la Tarea 5.


   ## Casos donde la IA produjo resultados incorrectos o subóptimos y cómo se detectaron y corregidos:
  1) La IA no creó la carpeta `src/domain/entities` en la primera aplicación (fue un error de omisión en la ejecución manual). Se detectó porque se verificó manualmente la estructura creada en el repositorio. Se corrigió creando manualmente la carpeta faltante.
  2) Se detectó la duplicación del contrato `ILevelRepository` en `LevelDefinition.ts`; se corrigió moviendo el contrato a `src/domain/repositories/ILevelRepository.ts`.
  3) El Builder generaba 6 argumentos para `LevelDefinition` (incluyendo `maxMoves` y `maxTimeInSeconds`), pero el constructor solo aceptaba 4. Se detectó durante la compilación TypeScript. Se corrigió actualizando el constructor de `LevelDefinition` para aceptar los 6 parámetros, manteniéndolos como propiedades readonly en la clase.
  4) (Tarea 5) `LevelJsonMapper.ts`, generado en la Tarea 3 sobre una rama distinta, quedó referenciando una clase (`BoardGroup`) que ya no existía tras la refactorización de dominio de la Tarea 4 en otra rama — un caso de divergencia entre ramas, no un error de la IA en el momento en que se generó cada una, pero que solo se detectó al fusionarlas y compilar.
  - No hubo errores conceptuales en el diseño de patrones o la arquitectura propuesta.

   ## Reflexión del equipo sobre el impacto de la IA en la productividad y calidad del código:
  - El impacto fue ALTAMENTE POSITIVO: la IA generó la mayoría del código de dominio manteniendo principios SOLID y patrones GoF coherentes.
  - La productividad aumentó significativamente: se generaron 7 archivos complejos con patrones (Builder, Template Method, Strategy) completamente documentados.
  - La calidad del código es muy alta: el dominio es puro, testeable y completamente desacoplado de frameworks o persistencia.
  - La principal lección fue la necesidad de revisar la coherencia entre patrones creacionales (Builder) y sus constructores target.
  - Recomendación: usar IA para generar el código inicial y los patrones, pero siempre compilar y validar la coherencia de firmas de funciones.
  - (Tarea 5) Cuando distintas ramas evolucionan el dominio en paralelo, la IA es especialmente útil para el trabajo mecánico de fusión (resolver conflictos, adaptar un mapper a una interfaz que cambió), pero el equipo debe seguir corriendo `build`/`lint`/`test` tras cada fusión en vez de confiar en que cada rama "ya estaba verde" por separado.

---

## Consulta #8 — Backend operativo: seed de catálogo y middleware JWT (Día 2)

**Tarea o problema abordado.**

Completar el segundo bloque crítico del plan de integración (5 días): hacer el backend **operable sin configuración manual** al arrancar y cerrar el **tercer aspecto AOP** (autorización JWT) exigido por la rúbrica académica.

**Herramienta de IA utilizada.**

- Cursor AI (asistente integrado en el IDE).

**Prompt o instrucción proporcionada.**

> Implementar en `BackEnd-ArrowMaze` (rama `develop`): (1) seed idempotente de `StructuredLevelJsonDto` en `InMemoryLevelRepository` al bootstrap; (2) middleware JWT (`Authorization: Bearer`) en rutas mutantes `POST /progress/sync` y `PUT /levels/:id`; (3) documentación dartdoc/TSDoc en español por función; (4) registro en `AI_USAGE.md` con redacción técnica.

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

## Consulta #9 — Ampliación del catálogo seed a 15 niveles (Día 3 backend)

**Tarea o problema abordado.**

Completar el primer entregable del **Día 3** del plan de integración: garantizar que el backend arranque con un catálogo **jugable y suficiente** (15 niveles en `StructuredLevelJsonDto`) para alimentar `GET /levels` y la app Flutter vía `RemoteLevelRepository`, sin intervención manual (`PUT`).

**Herramienta de IA utilizada.**

- Cursor AI (asistente integrado en el IDE).

**Prompt o instrucción proporcionada.**

> Extender el seed del backend (`BackEnd-ArrowMaze`, rama `develop`) de 5 a 15 niveles wire-format validables por `LevelSolvabilityValidator` y `UpsertLevelUseCase`; modularizar el catálogo, añadir tests de invariantes/solvabilidad, documentar cada módulo con TSDoc en español y registrar la consulta en `AI_USAGE.md` con redacción técnica.

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

- (Pendiente de revisión tras merge.)

**Lecciones aprendidas o limitaciones identificadas.**

- Cada nivel nuevo debe pasar `levelSeedCatalog.spec.ts` antes del merge; un layout “intuitivo” puede ser irresoluble según el backtracking del validador.
- `maxMoves` del seed debe ser holgado respecto a la ruta óptima del frontend (`LevelDtoMapper` rechaza `optimalMoves > maxMoves`).
- Siguiente paso del plan (Día 4): login/registro + `POST /progress/sync` al ganar.

---

---

## Consulta #10 — Prueba E2E HTTP del catálogo sembrado (Día 3 backend)

**Tarea o problema abordado.**

Complementar el Día 3 con tests de integración HTTP que verifiquen que el catálogo de **15 niveles** sembrado al arrancar es consultable vía API y cumple los campos mínimos del contrato `StructuredLevelJsonDto` que consume Flutter.

**Herramienta de IA utilizada.**

- Cursor AI (asistente integrado en el IDE).

**Prompt o instrucción proporcionada.**

> Añadir suite E2E HTTP en el backend que valide `GET /levels` (15 entradas) y `GET /levels/:id` para cada id del catálogo seed, con aserciones de schema wire-format; documentar en `AI_USAGE.md` con redacción técnica.

**Resultado obtenido.**

| Archivo | Responsabilidad |
|---------|-----------------|
| `tests/e2e/catalog-http-playable.spec.ts` | Schema + fetch por id de los 15 niveles |

**Modificaciones realizadas por el equipo al resultado de la IA.**

- (Pendiente de revisión tras merge.)

**Lecciones aprendidas o limitaciones identificadas.**

- Este E2E valida contrato HTTP, no jugabilidad en Flutter; la jugabilidad wire-format se cubre en el repo frontend (`test/e2e/wire_format_playability_e2e_test.dart`).

---
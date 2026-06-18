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


## Tarea 3: Refactorización de Board como Aggregate Root con Lógica de Negocio Pura

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

## Evaluación crítica

   ## Porcentaje aproximado del código que contó con asistencia de IA:
  - 100% del código inicial de `User`, `PlayerProgress`, interfaces de repositorio, `LevelBuilder` y `BaseLevelProcessor` fue generado por IA.
  - 30% del código de `LevelDefinition` fue corregido manualmente para aceptar 6 parámetros en lugar de 4.
  - 80% de la documentación y comentarios fue generado por IA y validado manualmente.


   ## Casos donde la IA produjo resultados incorrectos o subóptimos y cómo se detectaron y corregidos:
  1) La IA no creó la carpeta `src/domain/entities` en la primera aplicación (fue un error de omisión en la ejecución manual). Se detectó porque se verificó manualmente la estructura creada en el repositorio. Se corrigió creando manualmente la carpeta faltante.
  2) Se detectó la duplicación del contrato `ILevelRepository` en `LevelDefinition.ts`; se corrigió moviendo el contrato a `src/domain/repositories/ILevelRepository.ts`.
  3) El Builder generaba 6 argumentos para `LevelDefinition` (incluyendo `maxMoves` y `maxTimeInSeconds`), pero el constructor solo aceptaba 4. Se detectó durante la compilación TypeScript. Se corrigió actualizando el constructor de `LevelDefinition` para aceptar los 6 parámetros, manteniéndolos como propiedades readonly en la clase.
  - No hubo errores conceptuales en el diseño de patrones o la arquitectura propuesta.

   ## Reflexión del equipo sobre el impacto de la IA en la productividad y calidad del código:
  - El impacto fue ALTAMENTE POSITIVO: la IA generó la mayoría del código de dominio manteniendo principios SOLID y patrones GoF coherentes.
  - La productividad aumentó significativamente: se generaron 7 archivos complejos con patrones (Builder, Template Method, Strategy) completamente documentados.
  - La calidad del código es muy alta: el dominio es puro, testeable y completamente desacoplado de frameworks o persistencia.
  - La principal lección fue la necesidad de revisar la coherencia entre patrones creacionales (Builder) y sus constructores target.
  - Recomendación: usar IA para generar el código inicial y los patrones, pero siempre compilar y validar la coherencia de firmas de funciones.
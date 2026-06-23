import { BoardTestBuilder } from '../tests/builders/BoardTestBuilder';
import { BoardTestingAPI } from '../tests/api/BoardTestingApi';
import { Direction } from '../value-objects/Direction';
import { Position } from '../value-objects/Position';

describe('Board - Arrow Maze Mechanics', () => {

  // =========================================================================
  // 1. MECÁNICAS BÁSICAS DE INTERACCIÓN (CABEZA Y CUERPO)
  // =========================================================================

  test('should_exit_arrow_successfully_when_clicking_its_head_if_path_is_clear', () => {
    // REGLA: Una flecha libre debe salir limpiamente si haces click en su cabeza
    // Configuración: Cabeza en (2,2) apuntando a UP. Cuerpo abajo en (3,2)
    const board = new BoardTestBuilder()
      .withDimensions(5, 5)
      .withArrowAt(2, 2, Direction.UP, [new Position(3, 2)])
      .build();

    const api = new BoardTestingAPI(board);

    // Act: Click en la cabeza
    api.interactAt(2, 2);

    // Assert
    api.expectActionToSucceed();
    api.expectEmptyBoard();
  });

  test('should_exit_arrow_successfully_when_clicking_its_body_if_path_is_clear', () => {
    // REGLA: Si el camino está despejado, hacer click en el cuerpo también activa la salida completa
    // Configuración: Cabeza en (2,2) apuntando a UP. Cuerpo abajo en (3,2)
    const board = new BoardTestBuilder().withDimensions(5, 5).withArrowAt(2, 2, Direction.UP, [new Position(3, 2)])
      .build();
    const api = new BoardTestingAPI(board);
    // Act: Click en el cuerpo
    api.interactAt(3, 2);
    // Assert
    api.expectActionToSucceed();
    api.expectEmptyBoard();
  });

  // =========================================================================
  // 2. LOGICA DE BLOQUEOS Y RESOLUCIÓN SECUENCIAL
  // =========================================================================

  test('should_not_allow_arrow_to_exit_if_blocked_by_another_arrow_occupying_its_path', () => {
    // REGLA: Una flecha no puede salir si otra interrumpe su trayectoria en curso
    // - Flecha A: Cabeza en (2,2) hacia UP. Intenta salir atravesando la fila 1.
    // - Flecha B: Cabeza en (1,2) hacia RIGHT. Obstruye directamente la salida de la Flecha A.
    const board = new BoardTestBuilder().withDimensions(5, 5)
      .withArrowAt(2, 2, Direction.UP, [new Position(3, 2)])    // Flecha A
      .withArrowAt(1, 2, Direction.RIGHT, [new Position(1, 1)]) // Flecha B (Obstáculo)
      .build();
    const api = new BoardTestingAPI(board);
    // Act: Intentamos disparar la Flecha A que está bloqueada
    api.interactAt(2, 2);
    // Assert
    api.expectActionToFail();
    api.expectArrowCountToBe(2); // Ambas flechas se quedan inmóviles
  });

  test('should_allow_blocked_arrow_to_exit_after_the_obstacle_arrow_has_cleared', () => {
    // REGLA: El núcleo del puzzle. Si removemos primero la flecha que estorba, la bloqueada ahora puede salir.
    // Mismo escenario que el test anterior: Flecha B bloquea a Flecha A.
    const board = new BoardTestBuilder().withDimensions(5, 5)
      .withArrowAt(2, 2, Direction.UP, [new Position(3, 2)])    // Flecha A
      .withArrowAt(1, 2, Direction.RIGHT, [new Position(1, 1)]) // Flecha B (Obstáculo)
      .build();

    const api = new BoardTestingAPI(board);

    // 1. Intentar sacar la Flecha A primero falla por el bloqueo
    api.interactAt(2, 2);
    api.expectActionToFail();

    // 2. Sacamos la Flecha B (obstáculo) hacia la derecha. Debería salir sin problemas.
    api.interactAt(1, 2);
    api.expectActionToSucceed();

    // 3. Ahora que la casilla (1,2) quedó vacía, la Flecha A tiene vía libre para salir
    api.interactAt(2, 2);
    api.expectActionToSucceed();
    api.expectEmptyBoard(); // Nivel resuelto con éxito
  });

  // =========================================================================
  // 3. COMPORTAMIENTOS COMPLEJOS Y ROBUSTEZ DEL TABLERO
  // =========================================================================

  test('should_completely_vacate_all_matrix_cells_of_a_complex_L_shaped_arrow', () => {
    // REGLA: Los cuerpos pueden tener cualquier forma. Al salir, deben limpiar todas sus celdas de la matriz.
    // Configuración: Cabeza en (2,2) apuntando a la RIGHT. Cuerpo en L ocupando (2,1) y (3,1).
    const board = new BoardTestBuilder()
      .withDimensions(5, 5)
      .withArrowAt(2, 2, Direction.RIGHT, [new Position(2, 1), new Position(3, 1)])
      .build();

    const api = new BoardTestingAPI(board);

    // Act: Hacemos click en el extremo final de la cola de la L
    api.interactAt(3, 1);

    // Assert: Toda la estructura se desvanece correctamente sin dejar residuos en el tablero
    api.expectActionToSucceed();
    api.expectEmptyBoard();
  });

  test('should_do_nothing_and_fail_action_when_clicking_an_empty_cell', () => {
    // REGLA: Hacer click en la nada no debe alterar el estado del juego ni mover flechas reales
    const board = new BoardTestBuilder()
      .withDimensions(5, 5)
      .withArrowAt(2, 2, Direction.UP, [new Position(3, 2)])
      .build();

    const api = new BoardTestingAPI(board);

    // Act: Click en una coordenada vacía (0,0)
    api.interactAt(0, 0);

    // Assert: El juego reporta acción inválida y la flecha sigue intacta
    api.expectActionToFail();
    api.expectArrowCountToBe(1);
  });
});
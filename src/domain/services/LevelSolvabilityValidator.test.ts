import { LevelSolvabilityValidator, StructuredLevelJsonDto } from './LevelSolvabilityValidator';
import { Direction } from '../value-objects/Direction';

describe('LevelSolvabilityValidator - E2E Solvability Tests', () => {
  let validator: LevelSolvabilityValidator;

  beforeEach(() => {
    validator = new LevelSolvabilityValidator();
  });

  // ==========================================
  // CASO 1: EL ESCENARIO FELIZ (FORMA SIMPLE)
  // ==========================================
  test('should_approve_level_when_arrows_can_exit_without_obstruction', () => {
    const simpleLevel: StructuredLevelJsonDto = {
      id: 'simple-1',
      levelNumber: 1,
      difficulty: 'EASY',
      maxMoves: 5,
      maxTimeInSeconds: 60,
      width: 4,
      height: 4,
      arrows: [
        {
          id: 'arrow-top',
          direction: Direction.UP,
          head: { row: 1, col: 1 },
          body: [{ row: 2, col: 1 }] // Cuerpo vertical de 1 celda
        },
        {
          id: 'arrow-bottom',
          direction: Direction.DOWN,
          head: { row: 2, col: 2 },
          body: [{ row: 1, col: 2 }]
        }
      ]
    };

    // Ambas apuntan hacia los bordes exteriores opuestos. Ninguna bloquea la trayectoria de la otra.
    expect(validator.isPlayable(simpleLevel)).toBe(true);
  });

  // ==========================================
  // CASO 2: BLOQUEO DIRECTO (DOS FLECHAS MIRÁNDOSE)
  // ==========================================
  test('should_reject_level_when_two_arrows_point_directly_at_each_other', () => {
    const faceToFaceLevel: StructuredLevelJsonDto = {
      id: 'blocked-face-to-face',
      levelNumber: 2,
      difficulty: 'EASY',
      maxMoves: 5,
      maxTimeInSeconds: 30,
      width: 5,
      height: 5,
      arrows: [
        {
          id: 'arrow-left',
          direction: Direction.RIGHT, // Apunta a la derecha hacia la col 3
          head: { row: 2, col: 1 },
          body: [{ row: 2, col: 0 }]
        },
        {
          id: 'arrow-right',
          direction: Direction.LEFT,  // Apunta a la izquierda hacia la col 1
          head: { row: 2, col: 3 },
          body: [{ row: 2, col: 4 }]
        }
      ]
    };

    // Al mirarse de frente, ninguna puede iniciar el movimiento. Bloqueo inmediato.
    expect(validator.isPlayable(faceToFaceLevel)).toBe(false);
  });

  // ==========================================
  // CASO 3: EL DESBLOQUEO EN CADENA (CON CUERPOS COMPUESTOS)
  // ==========================================
  test('should_approve_complex_level_where_one_arrow_clears_the_path_for_the_rest', () => {
    const chainLevel: StructuredLevelJsonDto = {
      id: 'complex-chain-solvable',
      levelNumber: 3,
      difficulty: 'MEDIUM',
      maxMoves: 10,
      maxTimeInSeconds: 90,
      width: 6,
      height: 6,
      arrows: [
        {
          id: 'arrow-trapped-A',
          direction: Direction.DOWN,
          head: { row: 1, col: 2 }, // Quiere bajar, pero la fila 3 está ocupada por el cuerpo de B
          body: [{ row: 0, col: 2 }]
        },
        {
          id: 'arrow-free-B',
          direction: Direction.RIGHT,
          head: { row: 3, col: 4 }, // Su cabeza apunta al borde derecho libre (col 5 está libre)
          body: [
            { row: 3, col: 3 },
            { row: 3, col: 2 }, // Este es el trozo de cuerpo que bloqueaba el paso de la flecha A
            { row: 3, col: 1 }
          ]
        }
      ]
    };

    // El algoritmo simulará que dispara primero la flecha B (hacia la derecha). 
    // Al remover a B, la coordenada (3,2) queda libre, permitiendo que en la siguiente iteración A pueda bajar con éxito.
    expect(validator.isPlayable(chainLevel)).toBe(true);
  });

  // ==========================================
  // CASO 4: EL BLOQUEO COMPLEJO EN "L" (ESCENARIO 3)
  // ==========================================
  test('should_reject_level_with_an_unsolvable_interlocking_L_shape', () => {
    const LBlockedLevel: StructuredLevelJsonDto = {
      id: 'blocked-l-shape',
      levelNumber: 4,
      difficulty: 'HARD',
      maxMoves: 5,
      maxTimeInSeconds: 45,
      width: 4,
      height: 4,
      arrows: [
        {
          id: 'U-arrow-left',
          direction: Direction.LEFT,
          head: { row: 1, col: 1 }, // Intenta salir por la izquierda, pero choca con la cabeza/cuerpo de la vertical en col 0
          body: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 },{ row: 1, col: 2 }] // Forma una "U acostada" que bloquea la trayectoria de la flecha vertical,
        },
        {
          id: 'arrow-vert',
          direction: Direction.UP,
          head: { row: 1, col: 0 }, // Intenta salir hacia arriba, pero choca con la trayectoria o cuerpo de la horizontal
          body: [{ row: 2, col: 0 }]
        }
      ]
    };

    // Ninguna de las dos piezas puede moverse inicialmente. El árbol de backtracking se quedará sin opciones.
    expect(validator.isPlayable(LBlockedLevel)).toBe(false);
  });
});
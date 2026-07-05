import { LevelSolvabilityValidator } from './LevelSolvabilityValidator';
import { ArrowDefinition } from '../entities/ArrowDefinition';
import { Direction } from '../value-objects/Direction';
import { Position } from '../value-objects/Position';

describe('LevelSolvabilityValidator - E2E Solvability Tests', () => {
  let validator: LevelSolvabilityValidator;

  const position = (row: number, col: number): Position => new Position(row, col);

  type LevelFixture = {
    width: number;
    height: number;
    arrows: ArrowDefinition[];
  };

  beforeEach(() => {
    validator = new LevelSolvabilityValidator();
  });

  // ==========================================
  // CASO 1: EL ESCENARIO FELIZ (FORMA SIMPLE)
  // ==========================================
  test('should_approve_level_when_arrows_can_exit_without_obstruction', () => {
    const simpleLevel: LevelFixture = {
      width: 4,
      height: 4,
      arrows: [
        { id: 'f1', direction: Direction.LEFT, head: position(0, 0), body: [position(0, 1)] },
        { id: 'f2', direction: Direction.RIGHT, head: position(1, 1), body: [position(1, 0)] },
        { id: 'f3', direction: Direction.DOWN, head: position(1, 2), body: [position(0, 2)] },
        { id: 'f4', direction: Direction.RIGHT, head: position(0, 3), body: [position(0, 3)] },
        { id: 'f5', direction: Direction.UP, head: position(1, 3), body: [position(2, 3), position(2, 2)] },
        { id: 'f6', direction: Direction.UP, head: position(2, 1), body: [position(3, 1), position(4, 1), position(4, 0), position(3, 0), position(2, 0)] },
        { id: 'f7', direction: Direction.DOWN, head: position(4, 2), body: [position(3, 2), position(3, 3), position(3, 4), position(2, 4), position(1, 4)] },
        { id: 'f8', direction: Direction.LEFT, head: position(4, 4), body: [position(4, 3)] }
      ]
    };

    expect(validator.isPlayable(simpleLevel.width, simpleLevel.height, simpleLevel.arrows)).toBe(true);
  });

  // ==========================================
  // CASO 2: BLOQUEO DIRECTO (DOS FLECHAS MIRÁNDOSE)
  // ==========================================
  test('should_reject_level_when_two_arrows_point_directly_at_each_other', () => {
    const faceToFaceLevel: LevelFixture = {
      width: 5,
      height: 5,
      arrows: [
        {
          id: 'arrow-left',
          direction: Direction.RIGHT,
          head: position(2, 1),
          body: [position(2, 0)]
        },
        {
          id: 'arrow-right',
          direction: Direction.LEFT,
          head: position(2, 3),
          body: [position(2, 4)]
        }
      ]
    };

    expect(validator.isPlayable(faceToFaceLevel.width, faceToFaceLevel.height, faceToFaceLevel.arrows)).toBe(false);
  });

  // ==========================================
  // CASO 3: EL DESBLOQUEO EN CADENA (CON CUERPOS COMPUESTOS)
  // ==========================================
  test('should_approve_complex_level_where_one_arrow_clears_the_path_for_the_rest', () => {
    const chainLevel: LevelFixture = {
      width: 6,
      height: 6,
      arrows: [
        {
          id: 'arrow-trapped-A',
          direction: Direction.DOWN,
          head: position(1, 2),
          body: [position(0, 2)]
        },
        {
          id: 'arrow-free-B',
          direction: Direction.RIGHT,
          head: position(3, 4),
          body: [
            position(3, 3),
            position(3, 2),
            position(3, 1)
          ]
        }
      ]
    };

    expect(validator.isPlayable(chainLevel.width, chainLevel.height, chainLevel.arrows)).toBe(true);
  });

  // ==========================================
  // CASO 4: EL BLOQUEO COMPLEJO EN "U" (ESCENARIO 3)
  // ==========================================
  test('should_reject_level_with_an_unsolvable_interlocking_L_shape', () => {
    const LBlockedLevel: LevelFixture = {
      width: 4,
      height: 4,
      arrows: [
        {
          id: 'U-arrow-left',
          direction: Direction.LEFT,
          head: position(1, 1),
          body: [position(0, 0), position(0, 1), position(0, 2), position(1, 2)]
        },
        {
          id: 'arrow-vert',
          direction: Direction.UP,
          head: position(1, 0),
          body: [position(2, 0)]
        }
      ]
    };

    expect(validator.isPlayable(LBlockedLevel.width, LBlockedLevel.height, LBlockedLevel.arrows)).toBe(false);
  });
});
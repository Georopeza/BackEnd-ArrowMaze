import {
  validateArrowBodyLengths,
  validateSingleArrowBody,
  MIN_ARROW_BODY_SEGMENTS,
} from '../../../src/domain/validators/arrowPlacementValidator';
import { StructuredLevelJsonDto } from '../../../docs/contract/level.contract';

describe('arrowPlacementValidator', () => {
  const baseDto: StructuredLevelJsonDto = {
    id: 'test-level',
    levelNumber: 1,
    difficulty: 'EASY',
    maxMoves: 10,
    maxTimeInSeconds: 120,
    width: 3,
    height: 3,
    exit: { row: 0, col: 2 },
    arrows: [
      {
        id: 'a1',
        direction: 'RIGHT',
        head: { row: 0, col: 0 },
        body: [{ row: 0, col: 1 }],
      },
    ],
  };

  test('should_accept_arrow_with_one_body_segment', () => {
    expect(() =>
      validateSingleArrowBody({
        id: 'a1',
        direction: 'RIGHT',
        head: { row: 0, col: 0 },
        body: [{ row: 0, col: 1 }],
      }),
    ).not.toThrow();
  });

  test('should_accept_arrow_with_many_body_segments', () => {
    expect(() =>
      validateSingleArrowBody({
        id: 'long',
        direction: 'RIGHT',
        head: { row: 0, col: 0 },
        body: [
          { row: 0, col: 1 },
          { row: 0, col: 2 },
          { row: 0, col: 3 },
          { row: 0, col: 4 },
          { row: 0, col: 5 },
        ],
      }),
    ).not.toThrow();
  });

  test('should_reject_arrow_with_no_body_segments', () => {
    expect(() =>
      validateSingleArrowBody({
        id: 'headless',
        direction: 'RIGHT',
        head: { row: 0, col: 0 },
        body: [],
      }),
    ).toThrow(/at least 1 body cell/);
  });

  test('should_validate_all_arrows_in_level_dto', () => {
    const dto: StructuredLevelJsonDto = {
      ...baseDto,
      arrows: [
        {
          id: 'ok',
          direction: 'DOWN',
          head: { row: 0, col: 0 },
          body: [{ row: 1, col: 0 }],
        },
        {
          id: 'bad',
          direction: 'DOWN',
          head: { row: 2, col: 0 },
          body: [],
        },
      ],
    };

    expect(() => validateArrowBodyLengths(dto)).toThrow(/Arrow "bad"/);
  });

  test('should_expose_min_body_segments_constant_as_one', () => {
    expect(MIN_ARROW_BODY_SEGMENTS).toBe(1);
  });
});

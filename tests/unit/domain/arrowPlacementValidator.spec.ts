import {
  validateArrowBodyLengths,
  validateSingleArrowBody,
  MAX_ARROW_BODY_SEGMENTS,
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
        body: [],
      },
    ],
  };

  test('should_accept_arrow_with_up_to_two_body_segments', () => {
    expect(() =>
      validateSingleArrowBody({
        id: 'a1',
        direction: 'RIGHT',
        head: { row: 0, col: 0 },
        body: [{ row: 0, col: 1 }, { row: 0, col: 2 }],
      }),
    ).not.toThrow();
  });

  test('should_reject_arrow_with_more_than_max_body_segments', () => {
    expect(() =>
      validateSingleArrowBody({
        id: 'long',
        direction: 'RIGHT',
        head: { row: 0, col: 0 },
        body: [
          { row: 0, col: 1 },
          { row: 0, col: 2 },
          { row: 0, col: 3 },
        ],
      }),
    ).toThrow(/maximum allowed is 2/);
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
          body: [
            { row: 3, col: 0 },
            { row: 4, col: 0 },
            { row: 5, col: 0 },
          ],
        },
      ],
    };

    expect(() => validateArrowBodyLengths(dto)).toThrow(/Arrow "bad"/);
  });

  test('should_expose_max_body_segments_constant_as_two', () => {
    expect(MAX_ARROW_BODY_SEGMENTS).toBe(2);
  });
});

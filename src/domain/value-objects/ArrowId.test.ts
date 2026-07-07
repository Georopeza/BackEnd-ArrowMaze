import { ArrowId } from './ArrowId';

describe('ArrowId Value Object', () => {
  test('should_create_an_ArrowId_when_the_value_has_more_than_one_character', () => {
    const id = new ArrowId('arrow-1');

    expect(id.value).toBe('arrow-1');
  });

  test('should_throw_an_error_when_the_value_has_one_character_or_less', () => {
    expect(() => new ArrowId('a')).toThrow('Arrow id is too short');
    expect(() => new ArrowId('')).toThrow('Arrow id is too short');
  });
});

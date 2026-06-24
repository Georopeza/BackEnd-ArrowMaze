import { User } from './User';

describe('User Entity', () => {
  const validId = 'user-123';
  const validHash = '$2b$10$somethinghashed';
  const validDate = new Date();

  test('should_create_a_valid_user_when_username_respects_length_boundaries', () => {
    // Caso feliz: 10 caracteres (entre 3 y 20)
    const user = new User(validId, 'G_Oropeza', validHash, validDate);

    expect(user.id).toBe(validId);
    expect(user.username).toBe('G_Oropeza');
  });

  test('should_throw_an_error_if_username_is_too_short', () => {
    // Caso inválido: menos de 3 caracteres
    expect(() => {
      new User(validId, 'go', validHash, validDate);
    }).toThrow('Username must be between 3 and 20 characters');
  });

  test('should_throw_an_error_if_username_is_too_long', () => {
    // Caso inválido: más de 20 caracteres
    const longUsername = 'a'.repeat(21);
    expect(() => {
      new User(validId, longUsername, validHash, validDate);
    }).toThrow('Username must be between 3 and 20 characters');
  });
});
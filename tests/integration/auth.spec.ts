import request from 'supertest';
import { createServer } from '../../src/infrastructure/http/server';

describe('Auth routes', () => {
  it('should_return_201_when_registering_a_new_user', async () => {
    // Arrange
    const app = createServer('test-secret');

    // Act
    const response = await request(app)
      .post('/auth/register')
      .send({ username: 'player_one', password: 'super-secret' });

    // Assert
    expect(response.status).toBe(201);
    expect(response.body.username).toBe('player_one');
  });

  it('should_return_409_when_username_is_already_taken', async () => {
    // Arrange
    const app = createServer('test-secret');
    await request(app).post('/auth/register').send({ username: 'player_one', password: 'super-secret' });

    // Act
    const response = await request(app)
      .post('/auth/register')
      .send({ username: 'player_one', password: 'another-secret' });

    // Assert
    expect(response.status).toBe(409);
  });

  it('should_return_400_when_register_body_is_invalid', async () => {
    // Arrange
    const app = createServer('test-secret');

    // Act
    const response = await request(app).post('/auth/register').send({ username: 'ab', password: 'short' });

    // Assert
    expect(response.status).toBe(400);
  });

  it('should_return_a_token_when_login_credentials_are_valid', async () => {
    // Arrange
    const app = createServer('test-secret');
    await request(app).post('/auth/register').send({ username: 'player_one', password: 'super-secret' });

    // Act
    const response = await request(app).post('/auth/login').send({ username: 'player_one', password: 'super-secret' });

    // Assert
    expect(response.status).toBe(200);
    expect(typeof response.body.token).toBe('string');
  });

  it('should_return_401_when_login_credentials_are_invalid', async () => {
    // Arrange
    const app = createServer('test-secret');

    // Act
    const response = await request(app).post('/auth/login').send({ username: 'ghost', password: 'whatever' });

    // Assert
    expect(response.status).toBe(401);
  });

  it('should_return_401_not_400_when_login_password_is_shorter_than_the_registration_minimum', async () => {
    // Arrange: login must not reuse the register schema's password strength
    // rule (min 8 chars) - a wrong-but-short password should still fail as
    // "invalid credentials", not as "bad request", or it leaks validation
    // rules to an unauthenticated caller.
    const app = createServer('test-secret');
    await request(app).post('/auth/register').send({ username: 'player_one', password: 'super-secret' });

    // Act
    const response = await request(app).post('/auth/login').send({ username: 'player_one', password: 'short' });

    // Assert
    expect(response.status).toBe(401);
  });
});

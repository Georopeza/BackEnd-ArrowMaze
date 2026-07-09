import { Express } from 'express';
import request from 'supertest';

/**
 * Registra un usuario y devuelve un JWT válido para pruebas de integración.
 *
 * @param app Instancia Express del test.
 * @param username Nombre de usuario único en el escenario.
 * @param password Contraseña que cumple la política de registro (mín. 8 caracteres).
 */
export async function obtainAuthToken(
  app: Express,
  username = 'integration_player',
  password = 'super-secret',
): Promise<string> {
  await request(app).post('/auth/register').send({ username, password });
  const login = await request(app).post('/auth/login').send({ username, password });
  return login.body.token as string;
}

/**
 * Header listo para supertest en rutas protegidas por JWT.
 */
export function bearerHeader(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` };
}

import { Router } from 'express';
import { z } from 'zod';
import { AppContainer } from '../container';
import { asyncHandler } from '../asyncHandler';

const registerSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(8),
});

// El login no debe validar la fortaleza de la contraseña (eso es una regla
// de registro, no de autenticación): solo exige que ambos campos vengan.
// Si se validara con las mismas reglas que el registro, una contraseña con
// formato inválido devolvería 400 en vez del 401 correcto de "credenciales
// incorrectas", filtrando información sobre reglas de validación en el
// intento de login.
const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

/**
 * Rutas de autenticación: registro e inicio de sesión.
 *
 * Cada handler solo traduce HTTP <-> DTO y delega toda la lógica a los
 * casos de uso (`RegisterUserUseCase`/`LoginUserUseCase`); errores de
 * negocio (usuario duplicado, credenciales inválidas) se lanzan como
 * `ApplicationError` y los resuelve `errorHandlerMiddleware`.
 */
export function createAuthRouter(container: AppContainer): Router {
  const router = Router();

  router.post(
    '/auth/register',
    asyncHandler(async (req, res) => {
      const dto = registerSchema.parse(req.body);
      const user = await container.registerUser.execute(dto);
      res.status(201).json({ userId: user.id, username: user.username });
    }),
  );

  router.post(
    '/auth/login',
    asyncHandler(async (req, res) => {
      const dto = loginSchema.parse(req.body);
      const result = await container.loginUser.execute(dto);
      res.status(200).json(result);
    }),
  );

  return router;
}

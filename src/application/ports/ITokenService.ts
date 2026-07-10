/** Datos mínimos que identifican al usuario dentro de un token de sesión. */
export interface TokenPayload {
  userId: string;
  username: string;
}

/**
 * Puerto de la Capa 2 (Casos de Uso) para emitir y verificar tokens de sesión.
 *
 * A diferencia de `IUserRepository`/`ILevelRepository`/`IProgressRepository`
 * (puertos de dominio, en `src/domain/repositories`), este puerto es propio
 * de la capa de aplicación: la noción de "token de sesión" pertenece a cómo
 * se orquesta el caso de uso de autenticación, no a una regla del juego.
 * La implementación concreta (p. ej. con `jsonwebtoken`) vive en infraestructura.
 */
export interface ITokenService {
  /**
   * Emite un token de sesión firmado a partir del payload del usuario.
   *
   * @param payload Identificador y nombre público del usuario autenticado.
   * @returns Token serializado listo para enviar al cliente.
   */
  generate(payload: TokenPayload): string;

  /**
   * Valida un token previamente emitido y extrae su payload.
   *
   * @param token Cadena recibida en el header `Authorization: Bearer`.
   * @returns Payload si la firma y expiración son válidas; `null` en caso contrario.
   */
  verify(token: string): TokenPayload | null;
}

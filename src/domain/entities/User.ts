// Entidad de dominio pura para representar un usuario del sistema.
// Aplica el principio de entidad de DDD: identidad propia, reglas de negocio y atributos inmutables.
export class User {
  public readonly id: string;
  public readonly username: string;
  public readonly passwordHash: string;
  public readonly createdAt: Date;

  /**
   * Construye un usuario con la invariante de username valida.
   * @param id identificador único del usuario.
   * @param username nombre de usuario.
   * @param passwordHash hash de la contraseña.
   * @param createdAt fecha de creación del usuario.
   */
  constructor(id: string, username: string, passwordHash: string, createdAt: Date) {
    if (username.length < 3 || username.length > 20) {
      throw new Error('Username must be between 3 and 20 characters');
    }

    this.id = id;
    this.username = username;
    this.passwordHash = passwordHash;
    this.createdAt = createdAt;
  }
}


/** Puerto de dominio para hashear y comparar contraseñas. */
export interface IPasswordHasher {
  /** Genera el hash de una contraseña en texto plano. */
  hash(password: string): Promise<string>;

  /** Compara una contraseña con su hash almacenado. */
  compare(password: string, hash: string): Promise<boolean>;
}

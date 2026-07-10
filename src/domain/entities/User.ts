import { IPasswordHasher } from '../services/IPasswordHasher';

/** Entidad de usuario con credenciales y datos de registro. */
export class User {
  public readonly id: string;
  public readonly username: string;
  // Cambiamos a private para que el hash no se filtre fuera de la entidad
  private readonly passwordHash: string; 
  public readonly createdAt: Date;

  /** Crea un usuario validando la longitud del nombre de usuario. */
  constructor(id: string, username: string, passwordHash: string, createdAt: Date) {
    if (username.length < 3 || username.length > 20) {
      throw new Error('Username must be between 3 and 20 characters');
    }

    this.id = id;
    this.username = username;
    this.passwordHash = passwordHash;
    this.createdAt = createdAt;
  }

  /** Verifica si la contraseña coincide con el hash almacenado. */
  public async verifyPassword(password: string, hasher: IPasswordHasher): Promise<boolean> {
    return await hasher.compare(password, this.passwordHash);
  }

  /** Expone los datos necesarios para persistir y reconstruir la entidad. */
  public toPersistenceRecord(): {
    id: string;
    username: string;
    passwordHash: string;
    createdAt: Date;
  } {
    return {
      id: this.id,
      username: this.username,
      passwordHash: this.passwordHash,
      createdAt: this.createdAt,
    };
  }
}

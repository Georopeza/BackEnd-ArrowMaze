import { IPasswordHasher } from '../services/IPasswordHasher';

export class User {
  public readonly id: string;
  public readonly username: string;
  // Cambiamos a private para que el hash no se filtre fuera de la entidad
  private readonly passwordHash: string; 
  public readonly createdAt: Date;

  constructor(id: string, username: string, passwordHash: string, createdAt: Date) {
    if (username.length < 3 || username.length > 20) {
      throw new Error('Username must be between 3 and 20 characters');
    }

    this.id = id;
    this.username = username;
    this.passwordHash = passwordHash;
    this.createdAt = createdAt;
  }

  // Método de dominio para validar identidad sin exponer el hash
  public async verifyPassword(password: string, hasher: IPasswordHasher): Promise<boolean> {
    return await hasher.compare(password, this.passwordHash);
  }

  // Accesor explícito para que la capa de infraestructura pueda persistir y
  // reconstruir la entidad (p. ej. una fila SQLite). Distinto de exponer el
  // hash para comparación: aquí no se compara nada, solo se serializa.
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
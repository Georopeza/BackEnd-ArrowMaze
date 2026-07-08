import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';

/**
 * Implementación en memoria de `IUserRepository`.
 *
 * Sirve para desarrollar y probar los casos de uso sin depender todavía
 * de una base de datos real (esa decisión queda para un sprint
 * posterior); basta con que cumpla el contrato del puerto de dominio.
 */
export class InMemoryUserRepository implements IUserRepository {
  private readonly usersById = new Map<string, User>();

  /** Busca un usuario por su identificador. */
  public async findById(id: string): Promise<User | null> {
    return this.usersById.get(id) ?? null;
  }

  /** Busca un usuario por su nombre de usuario. */
  public async findByUsername(username: string): Promise<User | null> {
    for (const user of this.usersById.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  /** Guarda (o sobrescribe) un usuario. */
  public async save(user: User): Promise<void> {
    this.usersById.set(user.id, user);
  }
}

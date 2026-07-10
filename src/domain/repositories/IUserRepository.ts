import { User } from '../entities/User';

/** Puerto de persistencia para la entidad User (DIP). */
export interface IUserRepository {
  /** Busca un usuario por su identificador. */
  findById(id: string): Promise<User | null>;

  /** Busca un usuario por nombre de usuario. */
  findByUsername(username: string): Promise<User | null>;

  /** Persiste un usuario nuevo o actualizado. */
  save(user: User): Promise<void>;
}

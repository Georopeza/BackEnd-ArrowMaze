import { User } from '../entities/User';

// Puerto de repositorio puro para la entidad User.
// Aplica Principio de Inversión de Dependencias (DIP).
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

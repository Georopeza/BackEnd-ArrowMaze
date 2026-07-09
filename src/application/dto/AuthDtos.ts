/** Entrada del caso de uso de registro. */
export interface RegisterUserDto {
  username: string;
  password: string;
}

/** Entrada del caso de uso de inicio de sesión. */
export interface LoginUserDto {
  username: string;
  password: string;
}

/** Resultado devuelto por registro/login: el token de sesión y datos públicos del usuario. */
export interface AuthResultDto {
  token: string;
  userId: string;
  username: string;
}

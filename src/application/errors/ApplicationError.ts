/**
 * Base de los errores propios de la Capa 2 (Casos de Uso).
 *
 * Cada error carga un `statusCode` HTTP sugerido para que, cuando la capa
 * de infraestructura conecte el `errorHandler.middleware.ts` centralizado
 * a esta capa, pueda mapear el error al código correcto sin que el caso de
 * uso conozca nada de HTTP (los casos de uso solo lanzan estos errores, no
 * construyen respuestas).
 */
export abstract class ApplicationError extends Error {
  public abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

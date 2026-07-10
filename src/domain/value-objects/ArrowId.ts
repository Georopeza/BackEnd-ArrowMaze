/** Identificador único e inmutable de una flecha. */
export class ArrowId {
  /** Crea un ArrowId validando longitud mínima. */
  constructor(public readonly value: string) {
    if (value.length <= 1) throw new Error('Arrow id is too short');
  }
}

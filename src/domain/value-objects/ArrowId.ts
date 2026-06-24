
export class ArrowId {
  constructor(public readonly value: string) {
    if (value.length <= 1) throw new Error("ID de flecha demasiado corto");
  }
}
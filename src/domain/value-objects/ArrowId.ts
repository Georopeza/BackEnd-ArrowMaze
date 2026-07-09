// Value Object: identificador único e inmutable de una flecha (Arrow).
export class ArrowId {
  constructor(public readonly value: string) {
    if (value.length <= 1) throw new Error('Arrow id is too short');
  }
}
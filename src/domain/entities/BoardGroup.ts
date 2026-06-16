import { BoardComponent } from './BoardComponent';
import { Cell } from './Cell';

// Componente Composite que agrupa celdas y subgrupos del tablero.
export class BoardGroup extends BoardComponent {
  public readonly type = 'BoardGroup';
  private readonly components: Cell[] = [];

  /**
   * Construye un grupo de tablero con componentes opcionales.
   * @param components lista inicial de componentes hijos.
   */
  constructor(components: Cell[] = []) {
    super();
    this.components = components;
  }

  /**
   * Agrega un componente hijo al grupo.
   * @param component celda o subgrupo a agregar.
   */
  public add(component: Cell): void {
    this.components.push(component);
  }

  /**
   * Elimina un componente hijo del grupo.
   * @param component celda o subgrupo a eliminar.
   */
  public remove(component: Cell): void {
    const index = this.components.indexOf(component);
    if (index >= 0) {
      this.components.splice(index, 1);
    }
  }

  /**
   * Obtiene una copia de los componentes hijos del grupo.
   * @returns lista de componentes hijos.
   */
  public getComponents(): Cell[] {
    return [...this.components];
  }

  /**
   * Devuelve una descripción legible del grupo de tablero.
   */
  public getDescription(): string {
    return `BoardGroup containing ${this.components.length} components`;
  }
}

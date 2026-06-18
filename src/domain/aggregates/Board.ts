import { Cell } from '../entities/Cell';
import { ArrowCell } from '../entities/ArrowCell';
import { EmptyCell } from '../entities/EmptyCell';
import { Direction } from '../value-objects/Direction';
import { BoardDimensions } from '../value-objects/BoardDimensions';

/**
 * Board - Aggregate Root que representa el tablero del juego Arrow Maze.
 * 
 * Responsabilidades:
 * - Mantener la integridad de la matriz de celdas (rows × cols).
 * - Implementar reglas de negocio: Regla de Bloqueo (line of sight) y Regla de Despeje.
 * - Orquestar interacciones entre celdas (especialmente disparos de flechas).
 * 
 * Principios SOLID aplicados:
 * - SRP (Single Responsibility): Responsable únicamente de la lógica del tablero y sus reglas.
 * - DIP (Dependency Inversion): Solo depende de abstracciones de Dominio (Cell, Direction, BoardDimensions).
 * - OCP (Open/Closed): Extensible a través de nuevos tipos de Cell sin modificar la lógica existente.
 */
export class Board {
  public readonly type = 'Board'; // Identificador de tipo para el agregado
  private readonly dimensions: BoardDimensions;
  private grid: Cell[][]=[]; // Matriz de celdas: grid[row][col]

  /**
   * Construye un nuevo agregado Board con dimensiones específicas.
   * 
   * @param dimensions objeto BoardDimensions con rows y cols validadas
   * @param initialGrid matriz inicial de celdas (opcional). Si no se proporciona, se inicializa con EmptyCell.
   * @throws Error si initialGrid tiene dimensiones incorrectas
   */
  constructor(dimensions: BoardDimensions, initialGrid?: Cell[][]) {
    this.dimensions = dimensions;

    if (initialGrid) {
      this.validateGrid(initialGrid);
      this.grid = initialGrid;
    } else {
      this.initializeEmptyGrid();
    }
  }

  /**
   * Obtiene una celda en la posición especificada del tablero.
   * 
   * @param row fila de la celda (0-indexed)
   * @param col columna de la celda (0-indexed)
   * @returns la celda en la posición
   * @throws Error si row o col están fuera de límites
   */
  public getCellAt(row: number, col: number): Cell {
    this.validatePosition(row, col);
    return this.grid[row][col];
  }

  /**
   * Intenta interactuar con una celda (disparar una flecha).
   * 
   * Flujo de negocio:
   * 1. Valida que la celda sea una ArrowCell.
   * 2. Verifica la Regla de Bloqueo: ¿hay otra flecha bloqueando el camino?
   * 3. Si está bloqueada, retorna false (sin cambios en el tablero).
   * 4. Si está libre, aplica la Regla de Despeje: transforma la celda en EmptyCell.
   * 5. Retorna true indicando éxito.
   * 
   * @param row fila de la flecha a disparar
   * @param col columna de la flecha a disparar
   * @returns true si la flecha se disparó exitosamente, false si fue bloqueada
   * @throws Error si la posición está fuera de límites o la celda no es ArrowCell
   */
  public interactWithCell(row: number, col: number): boolean {
    const cell = this.getCellAt(row, col);

    // Solo ArrowCell puede ser disparada
    if (!(cell instanceof ArrowCell)) {
      throw new Error(
        `Cannot interact with ${cell.type} at position (${row}, ${col}). Only ArrowCell can be fired.`
      );
    }

    const arrow = cell as ArrowCell;

    // Regla de Bloqueo: verificar si el camino está libre
    if (!this.isPathClear(row, col, arrow.direction)) {
      return false; // La flecha está bloqueada, no se dispara
    }

    // Regla de Despeje: el camino está libre, transformar celda a EmptyCell
    this.setCellAt(row, col, new EmptyCell());
    return true;
  }

  /**
   * Obtiene las dimensiones del tablero.
   * 
   * @returns objeto BoardDimensions con rows y cols
   */
  public getDimensions(): BoardDimensions {
    return this.dimensions;
  }

  /**
   * Obtiene una copia profunda de la matriz actual del tablero.
   * 
   * @returns matriz de celdas (copia para evitar mutaciones externas)
   */
  public getGrid(): Cell[][] {
    return this.grid.map((row) => [...row]);
  }

  // ====== MÉTODOS PRIVADOS ======

  /**
   * Establece una celda en una posición específica (uso interno).
   * 
   * @param row fila de la celda
   * @param col columna de la celda
   * @param cell nueva celda a asignar
   */
  private setCellAt(row: number, col: number, cell: Cell): void {
    this.validatePosition(row, col);
    this.grid[row][col] = cell;
  }

  /**
   * Verifica si hay una línea de visión clara desde una posición hacia el borde del tablero.
   * 
   * Implementa la "Regla de Bloqueo": recorre todas las posiciones en la dirección dada.
   * Si encuentra una ArrowCell en el camino, retorna false (bloqueado).
   * Si alcanza el borde del tablero sin encontrar obstáculos, retorna true (libre).
   * 
   * Nota: La flecha original en (row, col) no se considera un obstáculo.
   * 
   * @param row fila de inicio
   * @param col columna de inicio
   * @param direction dirección a verificar (UP, DOWN, LEFT, RIGHT)
   * @returns true si el camino está completamente libre, false si hay obstáculo
   */
  private isPathClear(row: number, col: number, direction: Direction): boolean {
    let currentRow = row;
    let currentCol = col;

    while (true) {
      // Calcular la siguiente posición en la dirección
      const { nextRow, nextCol } = this.getNextPosition(
        currentRow,
        currentCol,
        direction
      );

      // Si la siguiente posición está fuera de límites, el camino está libre (exterior del tablero)
      if (!this.dimensions.isValidPosition(nextRow, nextCol)) {
        return true;
      }

      // Si hay una flecha en el camino, está bloqueado
      const cellInPath = this.grid[nextRow][nextCol];
      if (cellInPath instanceof ArrowCell) {
        return false;
      }

      // Continuar verificando en la dirección
      currentRow = nextRow;
      currentCol = nextCol;
    }
  }

  /**
   * Calcula la siguiente posición en una dirección específica.
   * 
   * @param row fila actual
   * @param col columna actual
   * @param direction dirección (UP, DOWN, LEFT, RIGHT)
   * @returns objeto con nextRow y nextCol (puede estar fuera de límites)
   */
  private getNextPosition(
    row: number,
    col: number,
    direction: Direction
  ): { nextRow: number; nextCol: number } {
    switch (direction) {
      case Direction.UP:
        return { nextRow: row - 1, nextCol: col };
      case Direction.DOWN:
        return { nextRow: row + 1, nextCol: col };
      case Direction.LEFT:
        return { nextRow: row, nextCol: col - 1 };
      case Direction.RIGHT:
        return { nextRow: row, nextCol: col + 1 };
      default:
        throw new Error(`Unknown direction: ${direction}`);
    }
  }

  /**
   * Inicializa una matriz vacía llena de EmptyCell (uso interno).
   */
  private initializeEmptyGrid(): void {
    this.grid = [];
    for (let i = 0; i < this.dimensions.rows; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.dimensions.cols; j++) {
        this.grid[i][j] = new EmptyCell();
      }
    }
  }

  /**
   * Valida que una matriz tiene las dimensiones correctas (uso interno).
   * 
   * @param grid matriz a validar
   * @throws Error si la matriz no coincide con this.dimensions
   */
  private validateGrid(grid: Cell[][]): void {
    if (grid.length !== this.dimensions.rows) {
      throw new Error(
        `Grid must have ${this.dimensions.rows} rows, got ${grid.length}`
      );
    }

    for (let i = 0; i < grid.length; i++) {
      if (grid[i].length !== this.dimensions.cols) {
        throw new Error(
          `Grid row ${i} must have ${this.dimensions.cols} columns, got ${grid[i].length}`
        );
      }
    }
  }

  /**
   * Valida que una posición está dentro de los límites del tablero (uso interno).
   * 
   * @param row fila a validar
   * @param col columna a validar
   * @throws Error si row o col están fuera de límites
   */
  private validatePosition(row: number, col: number): void {
    if (!this.dimensions.isValidPosition(row, col)) {
      throw new Error(
        `Position (${row}, ${col}) is out of bounds for board ${this.dimensions.rows}x${this.dimensions.cols}`
      );
    }
  }
}

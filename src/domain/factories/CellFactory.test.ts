import { CellFactory } from './CellFactory';
import { ArrowCell } from '../entities/ArrowCell';
import { ArrowBodyCell } from '../entities/ArrowBodyCell';
import { WallCell } from '../entities/WallCell';
import { Direction } from '../value-objects/Direction';
import { Cell } from '../entities/Cell';

describe('CellFactory - Domain Service', () => {
  let factory: CellFactory;

  beforeEach(() => {
    // Inicializamos la factoría del dominio antes de cada test
    factory = new CellFactory();
  });

  // =========================================================================
  // 1. VERIFICACIÓN DE CELDAS ESTÁNDAR DEL JUEGO
  // =========================================================================

  test('should_create_an_EmptyCell_correctly', () => {
    const cell = factory.createCell('EmptyCell');
    expect(cell.constructor.name).toBe('EmptyCell');
  });

  test('should_create_a_WallCell_correctly', () => {
    const cell = factory.createCell('WallCell');
    expect(cell instanceof WallCell).toBe(true);
  });

  test('should_create_an_ArrowCell_with_the_provided_domain_direction', () => {
    const cell = factory.createCell('ArrowCell', { direction: Direction.UP, arrowId: 'arrow-1' }) as ArrowCell;

    expect(cell instanceof ArrowCell).toBe(true);
    // Verificamos que el Value Object de la dirección se haya asignado correctamente
    expect(cell.getDirection()).toBe(Direction.UP);
    expect(cell.arrowId).toBe('arrow-1');
  });

  test('should_create_an_ArrowBodyCell_referencing_its_head_arrowId', () => {
    const cell = factory.createCell('ArrowBodyCell', { arrowId: 'arrow-1' }) as ArrowBodyCell;

    expect(cell instanceof ArrowBodyCell).toBe(true);
    expect(cell.arrowId).toBe('arrow-1');
  });

  // =========================================================================
  // 2. CONTROL DE ERRORES DE LOGICA DE NEGOCIO
  // =========================================================================

  test('should_throw_an_error_if_ArrowCell_is_missing_its_direction_data', () => {
    expect(() => {
      factory.createCell('ArrowCell'); // Intento de creación inválido sin dirección
    }).toThrow('ArrowCell requires a direction');
  });

  test('should_throw_an_error_if_ArrowCell_is_missing_its_arrowId', () => {
    expect(() => {
      factory.createCell('ArrowCell', { direction: Direction.UP }); // Falta el arrowId
    }).toThrow('ArrowCell requires an arrowId');
  });

  test('should_throw_an_error_if_ArrowBodyCell_is_missing_its_arrowId', () => {
    expect(() => {
      factory.createCell('ArrowBodyCell');
    }).toThrow('ArrowBodyCell requires an arrowId');
  });

  test('should_throw_an_error_when_domain_requests_an_unregistered_cell_type', () => {
    expect(() => {
      factory.createCell('UnknownCell');
    }).toThrow('Unknown cell type: UnknownCell');
  });
});
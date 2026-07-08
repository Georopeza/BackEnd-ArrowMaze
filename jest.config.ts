import type { Config } from 'jest';

// Configuración de Jest: usa ts-jest para correr las pruebas TypeScript
// directamente, sin necesidad de compilar a JS primero.
//
// Dos convenciones de nombrado coexisten en este repo: los tests de dominio
// (Capa 1, heredados de Semana 1) usan `*.test.ts` colocados junto al código
// que prueban; los tests de infraestructura/aplicación (desde Sprint 1) usan
// `*.spec.ts` bajo `tests/`. Ambos patrones se incluyen aquí.
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/tests/**/*.spec.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/main.ts'],
};

export default config;

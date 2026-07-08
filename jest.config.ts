import type { Config } from 'jest';

// Configuración de Jest: usa ts-jest para correr las pruebas TypeScript
// directamente, sin necesidad de compilar a JS primero.
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/tests/**/*.spec.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/main.ts'],
};

export default config;

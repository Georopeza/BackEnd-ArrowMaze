module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'], // Para que Jest busque cualquier archivo que termine en .test.ts dentro de src
  verbose : true, // Para obtener más detalles en la salida de las pruebas
};
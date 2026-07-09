// Configuración base de ESLint para TypeScript.
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    node: true,
    es2020: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    // Los métodos de Template Method (p. ej. BaseLevelProcessor) declaran
    // parámetros que las subclases pueden necesitar aunque la
    // implementación por defecto no los use.
    '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
  },
};

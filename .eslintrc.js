module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier',
    ],
    rules: {
      'no-console': 1, // Means warning
      'prettier/prettier': 2, // Means error
      '@typescript-eslint/no-explicit-any': 'off'
    },
    env: {
      node: true,
      browser: true
    }
  };
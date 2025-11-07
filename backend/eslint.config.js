import js from '@eslint/js';
import pluginImport from 'eslint-plugin-import';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node, fetch: 'readonly', FormData: 'readonly', Blob: 'readonly', console: 'readonly' },
    },
    plugins: { import: pluginImport },
    rules: {
      'import/no-unresolved': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-misleading-character-class': 'off',
    },
  },
  { ignores: ['dist'] },
];

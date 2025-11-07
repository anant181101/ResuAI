import js from '@eslint/js';
import react from 'eslint-plugin-react';
import globals from 'globals';
import babelParser from '@babel/eslint-parser';

export default [
  js.configs.recommended,
  react.configs?.flat?.recommended || {},
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, console: 'readonly' },
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        ecmaFeatures: { jsx: true },
        babelOptions: { presets: ['@babel/preset-react'] },
      },
    },
    plugins: { react },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
    settings: { react: { version: 'detect' } },
  },
  { ignores: ['dist', 'build'] },
];

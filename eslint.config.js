import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      import: importPlugin,
      'jsx-a11y': jsxA11yPlugin,
      prettier: prettierPlugin
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    settings: {
      react: {
        version: 'detect'
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      }
    },
    rules: {
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
      'import/extensions': [
        'error',
        'always',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never'
        }
      ],
      'no-console': 0,
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      'no-use-before-define': 'off',
      'no-unused-vars': 'warn',
      'import/prefer-default-export': 0,
      'no-shadow': 1,
      'prefer-const': 1,
      'prefer-spread': 1,
      'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
      'no-undef': 0,
      'arrow-body-style': 0,
      'react/jsx-fragments': 0,
      'react/prop-types': 0,
      'react/require-default-props': 0,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    }
  }
];

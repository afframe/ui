import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores([
    'dist/',
    'storybook-static/',
    'coverage/',
    '.vitest/',
    '_junk/',
    '.context/',
    '.claude/',
    'examples/nextjs/.next/',
    'examples/nextjs/next-env.d.ts',
  ]),
  js.configs.recommended,
  tseslint.configs.strict,
  {
    languageOptions: {
      globals: globals.node,
    },
  }
);

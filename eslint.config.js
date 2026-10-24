import { globSync, readFileSync } from 'node:fs';
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

// Copied IBM files (Apache-2.0 header) sit beside own files in the same folders, so the
// React hooks rules are scoped by file content: only own code is held to them.
const ownFiles = globSync(['src/**/*.{ts,tsx}', '.storybook/**/*.{ts,tsx}'], {
  exclude: ['**/__screenshots__/**'],
}).filter(
  (file) => !readFileSync(file, 'utf8').slice(0, 2000).includes('Apache-2.0')
);

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
  { files: ownFiles, ...reactHooks.configs.flat.recommended },
  {
    languageOptions: {
      globals: globals.node,
    },
  }
);

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

// Every project runs in its own headless Chromium with the same viewport, so
// screenshots stay comparable.
const browser = () => ({
  enabled: true,
  headless: true,
  provider: playwright(),
  instances: [
    {
      browser: 'chromium' as const,
      viewport: { width: 1024, height: 768 },
    },
  ],
});

// Stories files import their MDX docs; visual tests only need the stories.
const stubMdx: Plugin = {
  name: 'stub-mdx',
  enforce: 'pre',
  load(id) {
    return id.endsWith('.mdx') ? 'export default () => null;' : null;
  },
};

// Baselines are rendered on the CI runner (ubuntu-24.04); font rendering
// differs on other machines, so visual tests run only in CI.
const visual = {
  extends: true,
  plugins: [stubMdx],
  test: {
    name: 'visual',
    include: ['src/**/*.visual.test.tsx'],
    setupFiles: ['vitest.setup.ts', '.storybook/vitest.setup.ts'],
    browser: browser(),
  },
};

export default defineConfig({
  // Found late, these would make Vite reload the browser mid-run and fail
  // whole test files.
  optimizeDeps: {
    include: [
      'react-dom',
      'react-dom/server',
      'storybook/actions',
      '@carbon/utilities-react',
      '@tanstack/react-table',
      '@tanstack/react-virtual',
      'echarts/core',
      'echarts/charts',
      'echarts/components',
      'echarts/renderers',
      '@carbon/charts-react',
      '@carbon/ai-chat',
      '@carbon/ai-chat/server',
      '@carbon/echarts-theme',
    ],
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: ['src/**/*.visual.test.tsx'],
          setupFiles: ['vitest.setup.ts'],
          browser: browser(),
        },
      },
      // Formatting runs on the server too, where Node's ICU differs from
      // Chromium's; the same tests run in both.
      {
        extends: true,
        test: {
          name: 'node',
          include: ['src/format/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        extends: true,
        plugins: [storybookTest({ configDir: '.storybook' })],
        test: {
          name: 'storybook',
          browser: browser(),
        },
      },
      ...(process.env.CI ? [visual] : []),
    ],
  },
});

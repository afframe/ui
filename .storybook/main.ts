import type { StorybookConfig } from '@storybook/react-vite';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import remarkGfm from 'remark-gfm';
import { mergeConfig } from 'vite';

// es-toolkit comes in through @carbon/react and pnpm does not hoist it, so
// the Licences page reads its NOTICE through an alias.
const fromCarbonReact = createRequire(
  createRequire(import.meta.url).resolve('@carbon/react/package.json')
);
const esToolkitNotice = join(
  dirname(fromCarbonReact.resolve('es-toolkit/package.json')),
  'NOTICE'
);

const config: StorybookConfig = {
  stories: [
    './Welcome.mdx',
    './Licences.mdx',
    '../src/**/*.mdx',
    '../src/**/*.stories.tsx',
  ],
  addons: [
    {
      // GitHub-flavoured Markdown: tables in the MDX pages.
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } },
      },
    },
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: '@storybook/react-vite',
  // Story assets, served from the root (the What's new example image), and
  // the licence texts the Licences page links to.
  staticDirs: ['./public', { from: '../LICENSES', to: '/LICENSES' }],
  docs: { defaultName: 'Overview' },
  core: { disableTelemetry: true, disableWhatsNewNotifications: true },
  features: {
    // Reads props through the TypeScript checker, so API tables of Carbon
    // re-exports fill in (react-docgen sees only local sources).
    experimentalDocgenServer: true,
    sidebarOnboardingChecklist: false,
    menuOnboardingChecklist: false,
  },
  // Vite's dev watcher skips its outDir (dist) while emptyOutDir is on, so a
  // rebuilt dist/styles.css never reached an open Storybook. The static build
  // writes the licences of the bundled packages beside the licence texts.
  viteFinal: (viteConfig, { configType }) =>
    mergeConfig(viteConfig, {
      resolve: {
        alias: [
          { find: /^es-toolkit-notice(?=\?|$)/, replacement: esToolkitNotice },
        ],
      },
      build:
        configType === 'DEVELOPMENT'
          ? { emptyOutDir: false }
          : { license: { fileName: 'LICENSES/third-party.txt' } },
    }),
};

export default config;

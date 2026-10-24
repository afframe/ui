import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';

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
  // rebuilt dist/styles.css never reached an open Storybook.
  viteFinal: (viteConfig, { configType }) =>
    configType === 'DEVELOPMENT'
      ? { ...viteConfig, build: { ...viteConfig.build, emptyOutDir: false } }
      : viteConfig,
};

export default config;

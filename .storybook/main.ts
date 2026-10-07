import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: '@storybook/react-vite',
  // Story assets, served from the root (the What's new example image).
  staticDirs: ['./public'],
  docs: { defaultName: 'Overview' },
  core: { disableTelemetry: true },
  // Reads props through the TypeScript checker, so API tables of Carbon
  // re-exports fill in (react-docgen sees only local sources).
  features: { experimentalDocgenServer: true },
  typescript: { reactDocgen: 'react-docgen' },
};

export default config;

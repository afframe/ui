import type { Preview } from '@storybook/react-vite';
import { AfframeProvider } from '../src/index.js';
import type { AfframeTheme } from '../src/index.js';
import '../dist/styles.css';
import '../dist/charts.css';
import './preview.css';

const preview: Preview = {
  // Every component gets a docs page, listed first (ADR 0008).
  tags: ['autodocs'],
  globalTypes: {
    theme: {
      description: 'Theme',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: ['light', 'dark', 'system'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  // Accessibility violations fail the Vitest run.
  parameters: { a11y: { test: 'error' } },
  // Stories tagged `afframe` must turn target-size on (afframeA11y.ts).
  beforeEach: ({ id, tags, parameters }) => {
    const rules: unknown = parameters.a11y?.config?.rules;
    const targetSizeOn =
      Array.isArray(rules) &&
      rules.some(
        (rule: { id?: unknown; enabled?: unknown }) =>
          rule.id === 'target-size' && rule.enabled === true
      );
    if (tags.includes('afframe') && !targetSizeOn) {
      throw new Error(
        `${id}: stories tagged 'afframe' must turn target-size on: spread afframeA11y from .storybook/afframeA11y into parameters`
      );
    }
  },
  decorators: [
    (Story, { globals }) => {
      document.documentElement.dataset.afframeTheme =
        globals.theme as AfframeTheme;
      return (
        <AfframeProvider>
          <Story />
        </AfframeProvider>
      );
    },
  ],
};

export default preview;

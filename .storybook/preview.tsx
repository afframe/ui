import type { Preview } from '@storybook/react-vite';
import { AfframeProvider } from '../src/index.js';
import type { AfframeTheme } from '../src/index.js';
import '../dist/styles.css';
import '../dist/charts.css';
import './preview.css';
import { ThemedDocsContainer } from './DocsContainer.js';

const preview: Preview = {
  // Every component gets a docs page, listed first (ADR 0008).
  tags: ['autodocs'],
  // A story's own controls.exclude replaces the one below; argTypes merge, so
  // this holds everywhere. Only `ref` sits here: the docgen server merges
  // global argTypes into every props table, so other names show as ghost
  // rows. A story with its own controls.exclude, whose component has a ref
  // prop other than `ref`, sets that prop to `control: false` in its meta.
  argTypes: {
    ref: { control: false },
  },
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
  parameters: {
    // Accessibility violations fail the Vitest run.
    a11y: { test: 'error' },
    // A ref holds a DOM node: the Controls object editor JSON-serialises it and the panel crashes.
    controls: { exclude: /^ref$|Ref$/ },
    // Docs pages follow the theme toolbar (DocsContainer.tsx).
    docs: { container: ThemedDocsContainer },
    options: {
      // Sections in a fixed order, Getting Started pages in reading order,
      // everything else A to Z by path. Stories of one component keep their
      // file order. Storybook evaluates this source as plain JavaScript on the
      // server: no outside references, no type annotations.
      storySort: (a, b) => {
        const sections = [
          'Getting Started',
          'Components',
          'Elements',
          'Layout',
          'Hooks',
          'Utilities',
          'Preview',
        ];
        const start = [
          'Welcome',
          'Theming',
          'AfframeProvider',
          'Formatting',
          'Feature Flags',
          'Licences',
        ];
        // Unlisted names sort after the listed ones.
        const rank = (list = [''], name = '') => {
          const i = list.indexOf(name);
          return i < 0 ? list.length : i;
        };
        const key = (title = '') => {
          const [section, ...rest] = title.split('/');
          const index = rank(sections, section);
          // A folder's Overview page sorts before its siblings: a space sorts
          // before any letter.
          if (rest[rest.length - 1] === 'Overview') rest[rest.length - 1] = ' ';
          return {
            index,
            page: section === 'Getting Started' ? rank(start, rest[0]) : 0,
            // An unlisted section keeps its name, so two of them do not mix.
            path: index === sections.length ? title : rest.join('/'),
          };
        };
        const ka = key(a.title);
        const kb = key(b.title);
        return (
          ka.index - kb.index ||
          ka.page - kb.page ||
          ka.path.localeCompare(kb.path, 'en', { sensitivity: 'base' })
        );
      },
    },
  },
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

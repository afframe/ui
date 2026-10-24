import { composeStories } from '@storybook/react-vite';
import { test } from 'vitest';
import { userEvent } from 'vitest/browser';
import * as stories from './DataGrid.stories.js';
import { snapshot } from '../../testUtils.js';

const { Default, Dark, WithFilterPanel, FilteredEmpty } =
  composeStories(stories);

test.each([
  ['data-grid-light', Default],
  ['data-grid-dark', Dark],
  ['data-grid-filter-panel-open', WithFilterPanel],
  ['data-grid-filtered-empty', FilteredEmpty],
] as const)('%s', async (name, story) => {
  await story.run();
  await snapshot(name);
});

test('data-grid-focus', async () => {
  await Default.run();
  // The first tab stop is the first sortable header.
  await userEvent.tab();
  await snapshot('data-grid-focus');
});

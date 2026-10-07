import { composeStories } from '@storybook/react-vite';
import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import * as stories from './DataGrid.stories.js';

const { Sorting, Dark } = composeStories(stories);

async function snap(name: string) {
  await document.fonts.load('400 14px "IBM Plex Sans"');
  await document.fonts.ready;
  await expect
    .element(page.elementLocator(document.body))
    .toMatchScreenshot(name);
}

test.each([
  ['data-grid-light', Sorting],
  ['data-grid-dark', Dark],
] as const)('%s', async (name, story) => {
  await story.run();
  await snap(name);
});

test('data-grid-focus', async () => {
  await Sorting.run();
  // The first tab stop is the first sortable header.
  await userEvent.tab();
  await snap('data-grid-focus');
});

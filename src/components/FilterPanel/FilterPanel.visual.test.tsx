import { composeStories } from '@storybook/react-vite';
import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import * as stories from './FilterPanel.stories.js';

const {
  Default,
  Dark,
  Batch,
  BatchDark,
  Summary,
  SummaryDark,
  FlyoutOpen,
  FlyoutOpenDark,
} = composeStories(stories);

async function snapshot(name: string) {
  await document.fonts.load('400 14px "IBM Plex Sans"');
  await document.fonts.ready;
  await expect
    .element(page.elementLocator(document.body))
    .toMatchScreenshot(name);
}

test.each([
  ['filter-panel-light', Default],
  ['filter-panel-dark', Dark],
  ['filter-panel-batch', Batch],
  ['filter-panel-batch-dark', BatchDark],
  ['filter-summary', Summary],
  ['filter-summary-dark', SummaryDark],
  ['filter-flyout-open', FlyoutOpen],
  ['filter-flyout-open-dark', FlyoutOpenDark],
] as const)('%s', async (name, story) => {
  await story.run();
  await snapshot(name);
});

// Focus ring on the first group heading; the title only takes focus after
// Apply or Cancel.
test('filter-panel-focus', async () => {
  await Default.run();
  await userEvent.tab();
  expect(document.activeElement?.textContent).toBe('Status (2)');
  await snapshot('filter-panel-focus');
});

// Focus ring on Clear filters. How many tags fit depends on measured width,
// so Tab until it is reached. A focused tag opens a tooltip after a delay, so
// a tag would not be deterministic.
test('filter-summary-focus', async () => {
  await Summary.run();
  for (let step = 0; step < 12; step += 1) {
    if (document.activeElement?.textContent === 'Clear filters') break;
    await userEvent.tab();
  }
  expect(document.activeElement?.textContent).toBe('Clear filters');
  await snapshot('filter-summary-focus');
});

import { composeStories } from '@storybook/react-vite';
import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import * as stories from './FilterPanel.stories.js';

const {
  Default,
  Dark,
  Accordion,
  FlyoutOpen,
  FlyoutOpenDark,
  FlyoutText,
  Summary,
  SummaryDark,
  SummaryOverflowOpen,
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
  ['filter-panel-accordion', Accordion],
  ['filter-flyout-open', FlyoutOpen],
  ['filter-flyout-open-dark', FlyoutOpenDark],
  ['filter-summary', Summary],
  ['filter-summary-dark', SummaryDark],
  ['filter-summary-overflow-open', SummaryOverflowOpen],
] as const)('%s', async (name, story) => {
  await story.run();
  await snapshot(name);
});

test('filter-flyout-text-open', async () => {
  await FlyoutText.run();
  await userEvent.click(page.getByRole('button', { name: 'Filter (3)' }));
  await snapshot('filter-flyout-text-open');
});

// Focus ring on the first checkbox; the title only takes focus after Apply
// or Clear.
test('filter-panel-focus', async () => {
  await Default.run();
  await userEvent.tab();
  expect(
    (document.activeElement as HTMLInputElement).labels?.[0]?.textContent
  ).toBe('Draft');
  await snapshot('filter-panel-focus');
});

// Focus ring on Clear filters. How many tags fit depends on measured width,
// so Tab until it is reached. A focused tag opens a tooltip after a delay, so
// a tag would not be deterministic.
test('filter-summary-focus', async () => {
  await Summary.run();
  for (let step = 0; step < 14; step += 1) {
    if (document.activeElement?.textContent === 'Clear filters') break;
    await userEvent.tab();
  }
  expect(document.activeElement?.textContent).toBe('Clear filters');
  await snapshot('filter-summary-focus');
});

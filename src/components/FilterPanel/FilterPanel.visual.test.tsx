import { composeStories } from '@storybook/react-vite';
import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import * as stories from './FilterPanel.stories.js';

const { Default, Dark, FlyoutOpen, FlyoutOpenDark } = composeStories(stories);

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
  ['filter-flyout-open', FlyoutOpen],
  ['filter-flyout-open-dark', FlyoutOpenDark],
] as const)('%s', async (name, story) => {
  await story.run();
  await snapshot(name);
});

// Focus ring on Clear all (after the two tags; a focused tag opens a
// tooltip after a delay, so it would not be deterministic).
test('filter-panel-focus', async () => {
  await Default.run();
  await userEvent.tab();
  await userEvent.tab();
  await userEvent.tab();
  expect(document.activeElement?.textContent).toBe('Clear all');
  await snapshot('filter-panel-focus');
});

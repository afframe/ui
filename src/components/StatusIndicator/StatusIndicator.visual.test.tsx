import { composeStories } from '@storybook/react-vite';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import * as stories from './StatusIndicator.stories.js';

const { Icon, Dark, Compact } = composeStories(stories);

async function snapshot(name: string) {
  await document.fonts.load('400 14px "IBM Plex Sans"');
  await document.fonts.ready;
  await expect
    .element(page.elementLocator(document.body))
    .toMatchScreenshot(name);
}

test.each([
  ['status-indicator-light', Icon],
  ['status-indicator-dark', Dark],
] as const)('%s', async (name, story) => {
  await story.run();
  await snapshot(name);
});

// Focus ring on the first compact indicator: the Compact play function
// presses Tab once, then Escape closes the tooltip, so nothing is in motion.
test('status-indicator-focus', async () => {
  await Compact.run();
  const failed = page.getByRole('button', { name: 'Failed' }).element();
  expect(document.activeElement).toBe(failed);
  await snapshot('status-indicator-focus');
});

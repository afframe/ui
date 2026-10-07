import { composeStories } from '@storybook/react-vite';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import * as stories from './AccentTag.stories.js';

const { Accents, Dark, Default } = composeStories(stories);

async function snapshot(name: string) {
  await document.fonts.load('400 14px "IBM Plex Sans"');
  await document.fonts.ready;
  await expect
    .element(page.elementLocator(document.body))
    .toMatchScreenshot(name);
}

test.each([
  ['accent-tag-light', Accents],
  ['accent-tag-dark', Dark],
] as const)('%s', async (name, story) => {
  await story.run();
  await snapshot(name);
});

// The Default play function presses Tab once to the tag and waits for its
// tooltip; wait for the tooltip's animation before the screenshot.
test('accent-tag-focus', async () => {
  await Default.run();
  const tag = page.getByRole('button', { name: 'Acme Trading' }).element();
  expect(document.activeElement).toBe(tag);
  await expect.element(page.getByRole('tooltip')).toBeVisible();
  await Promise.all(
    document.getAnimations().map((animation) => animation.finished)
  );
  await snapshot('accent-tag-focus');
});

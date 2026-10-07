import { composeStories } from '@storybook/react-vite';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import * as stories from './Amount.stories.js';

const { Signs, Dark } = composeStories(stories);

// Amount has nothing focusable, so it has no focus screenshot.
test.each([
  ['amount-light', Signs],
  ['amount-dark', Dark],
] as const)('%s', async (name, story) => {
  await story.run();
  await document.fonts.load('400 14px "IBM Plex Sans"');
  await document.fonts.ready;
  await expect
    .element(page.elementLocator(document.body))
    .toMatchScreenshot(name);
});

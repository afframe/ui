import { composeStories } from '@storybook/react-vite';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import * as stories from './AmountInput.stories.js';

const { Default, Dark, Focus } = composeStories(stories);

test.each([
  ['amount-input-light', Default],
  ['amount-input-dark', Dark],
  ['amount-input-focus', Focus],
] as const)('%s', async (name, story) => {
  await story.run();
  await document.fonts.load('400 14px "IBM Plex Sans"');
  await document.fonts.ready;
  await expect
    .element(page.elementLocator(document.body))
    .toMatchScreenshot(name);
});

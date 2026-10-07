import { composeStories } from '@storybook/react-vite';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import * as stories from './AfframeProvider.stories.js';

const { Default, Dark } = composeStories(stories);

test.each([
  ['provider-default', Default],
  ['provider-dark', Dark],
] as const)('%s', async (name, story) => {
  await story.run();
  await document.fonts.load('400 14px "IBM Plex Sans"');
  await document.fonts.ready;
  await expect
    .element(page.elementLocator(document.body))
    .toMatchScreenshot(name);
});

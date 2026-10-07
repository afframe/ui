import { composeStories } from '@storybook/react-vite';
import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import * as stories from './LogoutBanner.stories.js';

const { Default, Dark } = composeStories(stories);

async function snapshot(name: string) {
  await document.fonts.load('400 14px "IBM Plex Sans"');
  await document.fonts.ready;
  await expect
    .element(page.elementLocator(document.body))
    .toMatchScreenshot(name);
}

test.each([
  ['logout-banner-light', Default],
  ['logout-banner-dark', Dark],
] as const)('%s', async (name, story) => {
  await story.run();
  await snapshot(name);
});

// Focus: two Tabs (the header name link, then the banner's action button).
test('logout-banner-focus', async () => {
  await Default.run();
  await userEvent.tab();
  await userEvent.tab();
  await expect
    .element(page.getByRole('button', { name: 'Stay signed in' }))
    .toHaveFocus();
  await snapshot('logout-banner-focus');
});

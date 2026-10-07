import { composeStories } from '@storybook/react-vite';
import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import * as stories from './LogoutTile.stories.js';

const { Default, Dark } = composeStories(stories);

async function snapshot(name: string) {
  await Promise.all(
    document.getAnimations().map((animation) => animation.finished)
  );
  await document.fonts.load('400 14px "IBM Plex Sans"');
  await document.fonts.ready;
  await expect
    .element(page.elementLocator(document.body))
    .toMatchScreenshot(name);
}

test.each([
  ['logout-tile-light', Default],
  ['logout-tile-dark', Dark],
] as const)('%s', async (name, story) => {
  await story.run();
  await snapshot(name);
});

// Focus: three Tabs (header name link, profile action, the log-out button).
test('logout-tile-focus', async () => {
  await Default.run();
  await userEvent.tab();
  await userEvent.tab();
  await userEvent.tab();
  await expect
    .element(page.getByRole('button', { name: 'Log out' }))
    .toHaveFocus();
  await snapshot('logout-tile-focus');
});

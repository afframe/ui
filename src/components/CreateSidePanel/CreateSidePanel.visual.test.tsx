import { composeStories } from '@storybook/react-vite';
import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import * as stories from './CreateSidePanel.stories.js';

const { Default, Dark } = composeStories(stories);

async function snapshot(name: string) {
  await expect.element(page.getByRole('form')).toBeVisible();
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
  ['create-side-panel-light', Default],
  ['create-side-panel-dark', Dark],
] as const)('%s', async (name, story) => {
  await story.run();
  await snapshot(name);
});

// Open puts focus on the Name field; one Tab moves it to Email.
test('create-side-panel-focus', async () => {
  await Default.run();
  await expect
    .poll(() => document.activeElement?.id)
    .toBe('create-side-panel-name');
  await Promise.all(
    document.getAnimations().map((animation) => animation.finished)
  );
  // IBM SidePanel refocuses its primary target once its slide-in ends.
  await new Promise((resolve) => setTimeout(resolve, 100));
  await userEvent.tab();
  expect(document.activeElement?.id).toBe('create-side-panel-email');
  await snapshot('create-side-panel-focus');
});

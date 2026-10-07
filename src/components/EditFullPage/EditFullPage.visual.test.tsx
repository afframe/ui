import { composeStories } from '@storybook/react-vite';
import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import * as stories from './EditFullPage.stories.js';

const { Default, Dark } = composeStories(stories);

async function snapshot(name: string) {
  await document.fonts.load('400 14px "IBM Plex Sans"');
  await document.fonts.ready;
  await expect
    .element(page.elementLocator(document.body))
    .toMatchScreenshot(name);
}

test.each([
  ['edit-full-page-light', Default],
  ['edit-full-page-dark', Dark],
] as const)('%s', async (name, story) => {
  await story.run();
  await snapshot(name);
});

// Mount puts focus on the Name field; three Tabs pass Email and Cancel to Save.
test('edit-full-page-focus', async () => {
  await Default.run();
  await expect
    .poll(() => document.activeElement?.id)
    .toBe('edit-full-page-name');
  await userEvent.tab();
  await userEvent.tab();
  await userEvent.tab();
  expect(document.activeElement?.textContent).toBe('Save');
  await snapshot('edit-full-page-focus');
});

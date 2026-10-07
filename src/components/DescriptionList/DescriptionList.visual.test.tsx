import { composeStories } from '@storybook/react-vite';
import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import * as stories from './DescriptionList.stories.js';

const { Default, Dark } = composeStories(stories);

async function snapshot(name: string) {
  await document.fonts.load('400 14px "IBM Plex Sans"');
  await document.fonts.ready;
  await expect
    .element(page.elementLocator(document.body))
    .toMatchScreenshot(name);
}

test.each([
  ['description-list-light', Default],
  ['description-list-dark', Dark],
] as const)('%s', async (name, story) => {
  await story.run();
  await snapshot(name);
});

// The list itself takes no focus; Tab once reaches the link in the
// Document description.
test('description-list-focus', async () => {
  await Default.run();
  await userEvent.tab();
  expect(document.activeElement?.textContent).toBe('FV-2026-0042.pdf');
  await snapshot('description-list-focus');
});

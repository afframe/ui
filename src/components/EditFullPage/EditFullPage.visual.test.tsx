import { composeStories } from '@storybook/react-vite';
import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import * as stories from './EditFullPage.stories.js';
import { snapshot } from '../../testUtils.js';

const { Default, Dark } = composeStories(stories);

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

// Below md the two buttons share the width; Cancel must stay on screen.
test('edit-full-page-narrow', async () => {
  await page.viewport(375, 768);
  try {
    await Default.run();
    await snapshot('edit-full-page-narrow');
  } finally {
    await page.viewport(1024, 768);
  }
});

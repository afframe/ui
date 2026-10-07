import { composeStories } from '@storybook/react-vite';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import * as stories from './RemoveModal.stories.js';

const { Default, Dark } = composeStories(stories);

async function snapshot(name: string) {
  await expect.element(page.getByRole('alertdialog')).toBeVisible();
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
  ['remove-modal-light', Default],
  ['remove-modal-dark', Dark],
] as const)('%s', async (name, story) => {
  await story.run();
  await snapshot(name);
});

// Focus: no Tab needed, the dialog focuses Cancel on open (no typed
// confirmation), as the docs page states.
test('remove-modal-focus', async () => {
  await Default.run();
  await expect
    .element(page.getByRole('button', { name: 'Cancel' }))
    .toHaveFocus();
  await snapshot('remove-modal-focus');
});

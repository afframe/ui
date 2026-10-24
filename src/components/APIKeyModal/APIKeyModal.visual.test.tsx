import { composeStories } from '@storybook/react-vite';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import * as stories from './APIKeyModal.stories.js';
import { snapshot as bodySnapshot } from '../../testUtils.js';

const { Default, Dark } = composeStories(stories);

async function snapshot(name: string) {
  await expect.element(page.getByRole('dialog')).toBeVisible();
  await Promise.all(
    document.getAnimations().map((animation) => animation.finished)
  );
  await bodySnapshot(name);
}

test.each([
  ['api-key-modal-light', Default],
  ['api-key-modal-dark', Dark],
] as const)('%s', async (name, story) => {
  await story.run();
  await snapshot(name);
});

// Focus: no Tab needed, the dialog focuses the name field on open, as the
// docs page states.
test('api-key-modal-focus', async () => {
  await Default.run();
  await expect
    .element(page.getByRole('textbox', { name: 'Name' }))
    .toHaveFocus();
  await snapshot('api-key-modal-focus');
});

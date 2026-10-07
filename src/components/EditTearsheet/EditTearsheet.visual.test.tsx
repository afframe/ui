import { composeStories } from '@storybook/react-vite';
import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import * as stories from './EditTearsheet.stories.js';

const { Default, Dark } = composeStories(stories);

async function settle() {
  await expect.element(page.getByRole('dialog')).toBeVisible();
  await Promise.all(
    document.getAnimations().map((animation) => animation.finished)
  );
}

async function snapshot(name: string) {
  await settle();
  await document.fonts.load('400 14px "IBM Plex Sans"');
  await document.fonts.ready;
  await expect
    .element(page.elementLocator(document.body))
    .toMatchScreenshot(name);
}

test.each([
  ['edit-tearsheet-light', Default],
  ['edit-tearsheet-dark', Dark],
] as const)('%s', async (name, story) => {
  await story.run();
  await snapshot(name);
});

// Open puts focus on the Name field; Shift+Tab twice moves it back past
// Billing to the first nav item, Contact.
test('edit-tearsheet-focus', async () => {
  await Default.run();
  await expect
    .poll(() => document.activeElement?.id)
    .toBe('edit-tearsheet-name');
  await settle();
  await userEvent.tab({ shift: true });
  await userEvent.tab({ shift: true });
  expect(document.activeElement?.textContent).toBe('Contact');
  await snapshot('edit-tearsheet-focus');
});

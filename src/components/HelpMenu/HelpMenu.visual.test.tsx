import { composeStories } from '@storybook/react-vite';
import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import * as stories from './HelpMenu.stories.js';
import { snapshot as bodySnapshot } from '../../testUtils.js';

const { Default, Dark } = composeStories(stories);

// The panel is open in these stories.
async function snapshot(name: string) {
  await expect
    .element(page.getByRole('list', { name: 'Help links' }))
    .toBeVisible();
  await Promise.all(
    document.getAnimations().map((animation) => animation.finished)
  );
  await bodySnapshot(name);
}

test.each([
  ['help-menu-light', Default],
  ['help-menu-dark', Dark],
] as const)('%s', async (name, story) => {
  await story.run();
  await snapshot(name);
});

// Focus: three Tabs (header name link, the Help action, the first item).
test('help-menu-focus', async () => {
  await Default.run();
  await userEvent.tab();
  await userEvent.tab();
  await userEvent.tab();
  await expect
    .element(page.getByRole('link', { name: 'Documentation' }))
    .toHaveFocus();
  await snapshot('help-menu-focus');
});

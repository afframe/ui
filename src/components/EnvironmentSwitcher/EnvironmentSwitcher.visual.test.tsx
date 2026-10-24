import { composeStories } from '@storybook/react-vite';
import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import * as stories from './EnvironmentSwitcher.stories.js';
import { snapshot as bodySnapshot } from '../../testUtils.js';

const { Default, Dark } = composeStories(stories);

// The panel is open in these stories.
async function snapshot(name: string) {
  await expect
    .element(page.getByRole('group', { name: 'Environments' }))
    .toBeVisible();
  await Promise.all(
    document.getAnimations().map((animation) => animation.finished)
  );
  await bodySnapshot(name);
}

test.each([
  ['environment-switcher-light', Default],
  ['environment-switcher-dark', Dark],
] as const)('%s', async (name, story) => {
  await story.run();
  await snapshot(name);
});

// Focus: three Tabs (header name link, the action, the checked radio).
test('environment-switcher-focus', async () => {
  await Default.run();
  await userEvent.tab();
  await userEvent.tab();
  await userEvent.tab();
  await expect
    .element(page.getByRole('radio', { name: /Staging/ }))
    .toHaveFocus();
  await snapshot('environment-switcher-focus');
});

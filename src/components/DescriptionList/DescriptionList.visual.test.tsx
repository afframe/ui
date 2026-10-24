import { composeStories } from '@storybook/react-vite';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import * as stories from './DescriptionList.stories.js';
import { snapshot } from '../../testUtils.js';

const { Default, Dark } = composeStories(stories);

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
  expect(document.activeElement?.textContent).toBe('INV-2026-0042.pdf');
  await snapshot('description-list-focus');
});

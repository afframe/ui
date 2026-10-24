import { composeStories } from '@storybook/react-vite';
import { test } from 'vitest';
import * as stories from './Amount.stories.js';
import { snapshot } from '../../testUtils.js';

const { Signs, Dark } = composeStories(stories);

// Amount has nothing focusable, so it has no focus screenshot.
test.each([
  ['amount-light', Signs],
  ['amount-dark', Dark],
] as const)('%s', async (name, story) => {
  await story.run();
  await snapshot(name);
});

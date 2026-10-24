import { composeStories } from '@storybook/react-vite';
import { test } from 'vitest';
import * as stories from './AmountInput.stories.js';
import { snapshot } from '../../testUtils.js';

const { Default, Dark, Focus } = composeStories(stories);

test.each([
  ['amount-input-light', Default],
  ['amount-input-dark', Dark],
  ['amount-input-focus', Focus],
] as const)('%s', async (name, story) => {
  await story.run();
  await snapshot(name);
});

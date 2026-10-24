import { composeStories } from '@storybook/react-vite';
import { test } from 'vitest';
import * as stories from './AfframeProvider.stories.js';
import { snapshot } from '../testUtils.js';

const { Default, Dark } = composeStories(stories);

test.each([
  ['provider-default', Default],
  ['provider-dark', Dark],
] as const)('%s', async (name, story) => {
  await story.run();
  await snapshot(name);
});

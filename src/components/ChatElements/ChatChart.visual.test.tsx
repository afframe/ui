import { composeStories } from '@storybook/react-vite';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import * as stories from './ChatChart.stories.js';
import { snapshot as bodySnapshot } from '../../testUtils.js';

const { Default, Dark, Echarts } = composeStories(stories);

async function snapshot(name: string) {
  await Promise.all(
    document.getAnimations().map((animation) => animation.finished)
  );
  await bodySnapshot(name);
}

// Stories turn chart animations off; the play functions wait for the chart.
test.each([
  ['chat-chart-light', Default],
  ['chat-chart-dark', Dark],
  ['chat-chart-echarts', Echarts],
] as const)('%s', async (name, story) => {
  await story.run();
  await snapshot(name);
});

// The chart holds no tab stop (no toolbar, a legend that does not filter):
// one Tab leaves the story, so focus stays on the page body.
test('chat-chart-focus', async () => {
  await Default.run();
  await userEvent.tab();
  expect(document.activeElement).toBe(document.body);
  await snapshot('chat-chart-focus');
});

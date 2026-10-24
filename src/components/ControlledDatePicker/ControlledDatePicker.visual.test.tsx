import { composeStories } from '@storybook/react-vite';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import * as stories from './ControlledDatePicker.stories.js';
import { snapshot as bodySnapshot } from '../../testUtils.js';

const { Default, Dark, Open } = composeStories(stories);

// flatpickr marks today in the calendar: fix it for the screenshots through
// the instance flatpickr keeps on its input.
interface Flatpickr {
  now: Date;
  redraw: () => void;
}

function fixToday() {
  for (const input of document.querySelectorAll('.flatpickr-input')) {
    const calendar = (input as { _flatpickr?: Flatpickr })._flatpickr;
    if (!calendar) continue;
    calendar.now = new Date(2026, 9, 7, 12);
    calendar.redraw();
  }
}

async function snapshot(name: string) {
  fixToday();
  await Promise.all(
    document.getAnimations().map((animation) => animation.finished)
  );
  // flatpickr appends the calendar to <body>.
  await bodySnapshot(name);
}

test.each([
  ['controlled-date-picker-light', Open],
  ['controlled-date-picker-dark', Dark],
] as const)('%s', async (name, story) => {
  await story.run();
  await snapshot(name);
});

// The Default play function opens the calendar from the button, closes it
// with Escape and presses Shift+Tab back to the button.
test('controlled-date-picker-focus', async () => {
  await Default.run();
  await expect
    .element(page.getByRole('button', { name: 'Choose due date' }))
    .toHaveFocus();
  await snapshot('controlled-date-picker-focus');
});

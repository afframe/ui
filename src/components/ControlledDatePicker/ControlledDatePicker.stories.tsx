import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { Button, DatePickerInput } from '../../index.js';
import { ControlledDatePicker } from './ControlledDatePicker.js';
import mdx from './ControlledDatePicker.mdx';

const meta = {
  title: 'Components/Controlled Date Picker',
  component: ControlledDatePicker,
  tags: ['afframe'],
  args: {
    datePickerType: 'single',
    value: '10/15/2026',
    onOpenChange: action('onOpenChange'),
    children: null,
  },
  parameters: {
    ...afframeA11y,
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof ControlledDatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

// The open calendar covers the space under the input.
const frame = { minBlockSize: '24rem' } as const;

function isCalendarOpen() {
  return [...document.querySelectorAll('.flatpickr-calendar')].some(
    (calendar) => calendar.classList.contains('open')
  );
}

// The caller owns the state. The button opens the calendar and moves focus
// to the input, so Escape and the calendar keys work from there.
export const Controlled: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <div style={frame}>
        <Button
          kind="tertiary"
          onClick={() => {
            setOpen(true);
            document.getElementById('due-date')?.focus();
          }}>
          Choose due date
        </Button>
        <ControlledDatePicker
          {...args}
          open={open}
          onOpenChange={(next) => {
            args.onOpenChange?.(next);
            setOpen(next);
          }}>
          <DatePickerInput
            id="due-date"
            labelText="Due date"
            placeholder="mm/dd/yyyy"
          />
        </ControlledDatePicker>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Choose due date' });
    const input = canvas.getByLabelText('Due date');
    await userEvent.click(button);
    await waitFor(() => expect(isCalendarOpen()).toBe(true));
    await expect(document.activeElement).toBe(input);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(isCalendarOpen()).toBe(false));
    await expect(document.activeElement).toBe(input);
    // Tab back to the button for the focus state.
    await userEvent.tab({ shift: true });
    await expect(document.activeElement).toBe(button);
  },
};

// Open from the first render: the caller keeps it open.
export const Open: Story = {
  args: { open: true },
  render: (args) => (
    <div style={frame}>
      <ControlledDatePicker {...args}>
        <DatePickerInput
          id="open-date"
          labelText="Invoice date"
          placeholder="mm/dd/yyyy"
        />
      </ControlledDatePicker>
    </div>
  ),
  play: async () => {
    await waitFor(() => expect(isCalendarOpen()).toBe(true));
  },
};

// Without `open` the picker opens and closes itself and reports it.
export const Uncontrolled: Story = {
  render: (args) => (
    <div style={frame}>
      <ControlledDatePicker {...args}>
        <DatePickerInput
          id="uncontrolled-date"
          labelText="Payment date"
          placeholder="mm/dd/yyyy"
        />
      </ControlledDatePicker>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByLabelText('Payment date'));
    await waitFor(() => expect(isCalendarOpen()).toBe(true));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(isCalendarOpen()).toBe(false));
  },
};

// A range opens one calendar for both inputs.
export const Range: Story = {
  args: { datePickerType: 'range', value: ['10/01/2026', '10/31/2026'] },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <div style={frame}>
        <Button
          kind="tertiary"
          onClick={() => {
            setOpen(true);
            document.getElementById('period-from')?.focus();
          }}>
          Choose period
        </Button>
        <ControlledDatePicker {...args} open={open} onOpenChange={setOpen}>
          <DatePickerInput
            id="period-from"
            labelText="From"
            placeholder="mm/dd/yyyy"
          />
          <DatePickerInput
            id="period-to"
            labelText="To"
            placeholder="mm/dd/yyyy"
          />
        </ControlledDatePicker>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Choose period' })
    );
    await waitFor(() => expect(isCalendarOpen()).toBe(true));
    await expect(document.activeElement).toBe(canvas.getByLabelText('From'));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(isCalendarOpen()).toBe(false));
  },
};

export const Dark: Story = {
  ...Open,
  globals: { theme: 'dark' },
};

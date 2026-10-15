/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag, story names unified, business example data, named selects, Disabled (color-contrast off), ReadOnly, Invalid, Warning and TwentyFourHour stories; hourCycle h12 beside the AM/PM select, TwentyFourHour without its own placeholder and pattern, Afframe story for typing a time. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ComponentProps } from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { WithLayer as WithLayerTemplate } from '../../../.storybook/templates/WithLayer/index.js';
import {
  SelectItem,
  Stack,
  TimePicker,
  TimePickerSelect,
} from '../../index.js';
import mdx from './TimePicker.mdx';

// The story passes its own id; disabled always comes from the story args.
type TimePickerStoryArgs = Omit<
  ComponentProps<typeof TimePicker>,
  'id' | 'disabled'
> & {
  disabled: boolean;
};

const timeZones = [
  <SelectItem key="utc" value="UTC" text="UTC" />,
  <SelectItem key="cet" value="CET" text="Central European Time (CET)" />,
  <SelectItem key="eet" value="EET" text="Eastern European Time (EET)" />,
];

export default {
  title: 'Components/TimePicker',
  component: TimePicker,
  tags: ['carbon'],
  subcomponents: {
    TimePickerSelect,
    SelectItem,
  },
  parameters: {
    docs: {
      page: mdx,
    },
    controls: {
      exclude: ['inputClassName', 'pickerClassName', 'id', 'light', 'pattern'],
    },
  },
} satisfies Meta<typeof TimePicker>;

export const Default: StoryFn<TimePickerStoryArgs> = (args) => {
  return (
    <TimePicker id="time-picker" {...args}>
      <TimePickerSelect
        id="time-picker-select-1"
        aria-label="AM or PM"
        disabled={args.disabled}>
        <SelectItem value="AM" text="AM" />
        <SelectItem value="PM" text="PM" />
      </TimePickerSelect>
      <TimePickerSelect
        id="time-picker-select-2"
        aria-label="Time zone"
        disabled={args.disabled}>
        {timeZones}
      </TimePickerSelect>
    </TimePicker>
  );
};

// The AM/PM select needs the 12-hour mask; the default is 24-hour.
Default.args = {
  hourCycle: 'h12',
  disabled: false,
  hideLabel: false,
  invalid: false,
  invalidText: 'Enter a time as hh:mm.',
  labelText: 'Start time',
  warning: false,
  warningText: 'This time is outside business hours.',
};

Default.argTypes = {
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  hideLabel: {
    control: {
      type: 'boolean',
    },
  },
  invalid: {
    control: {
      type: 'boolean',
    },
  },
  invalidText: {
    control: { type: 'text' },
  },
  warning: {
    control: {
      type: 'boolean',
    },
  },
  warningText: {
    control: { type: 'text' },
  },
  labelText: {
    control: { type: 'text' },
  },
  size: {
    options: ['sm', 'md', 'lg'],
    control: { type: 'select' },
  },
  hourCycle: {
    options: ['h23', 'h12'],
    control: { type: 'radio' },
  },
  seconds: {
    control: { type: 'boolean' },
  },
  inputMask: {
    control: { type: 'boolean' },
  },
};

export const Disabled: StoryFn<TimePickerStoryArgs> = Default.bind({});
Disabled.args = { ...Default.args, disabled: true };
// Carbon greys out disabled text below 4.5:1. WCAG 1.4.3 exempts inactive
// components, but axe checks it anyway.
Disabled.parameters = {
  a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
};

export const ReadOnly: StoryFn<TimePickerStoryArgs> = Default.bind({});
ReadOnly.args = { ...Default.args, readOnly: true, defaultValue: '9:30' };

export const Invalid: StoryFn<TimePickerStoryArgs> = Default.bind({});
Invalid.args = { ...Default.args, invalid: true, defaultValue: '9:75' };

export const Warning: StoryFn<TimePickerStoryArgs> = Default.bind({});
Warning.args = { ...Default.args, warning: true, defaultValue: '7:30' };

// Input only: the default 24-hour mask takes 00:00 to 23:59, so no AM/PM
// select.
export const TwentyFourHour: StoryFn<TimePickerStoryArgs> = (args) => (
  <TimePicker id="time-picker-24h" {...args} />
);
TwentyFourHour.args = { ...Default.args, hourCycle: 'h23' };
TwentyFourHour.argTypes = Default.argTypes;

export const WithLayer: StoryFn = () => (
  <WithLayerTemplate>
    {(layer) => (
      <TimePicker
        id={`time-picker-${layer}`}
        labelText="Start time"
        hourCycle="h12">
        <TimePickerSelect
          id={`time-picker-select-${layer}-1`}
          aria-label="AM or PM">
          <SelectItem value="AM" text="AM" />
          <SelectItem value="PM" text="PM" />
        </TimePickerSelect>
        <TimePickerSelect
          id={`time-picker-select-${layer}-2`}
          aria-label="Time zone">
          {timeZones}
        </TimePickerSelect>
      </TimePicker>
    )}
  </WithLayerTemplate>
);

export const TypingATime: StoryObj<typeof TimePicker> = {
  tags: ['afframe'],
  parameters: { ...afframeA11y },
  render: () => (
    <Stack gap={6}>
      <TimePicker id="time-picker-typing" labelText="Start time" />
      <TimePicker
        id="time-picker-typing-seconds"
        labelText="Duration"
        seconds
      />
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const time = canvas.getByLabelText<HTMLInputElement>('Start time');
    await userEvent.type(time, '905');
    await expect(time).toHaveValue('09:05');
    await userEvent.clear(time);
    await userEvent.type(time, '9:');
    await expect(time).toHaveValue('09:');
    await userEvent.clear(time);
    await userEvent.type(time, '24');
    await expect(time).toHaveValue('2');
    const duration = canvas.getByLabelText<HTMLInputElement>('Duration');
    await userEvent.type(duration, '235959');
    await expect(duration).toHaveValue('23:59:59');
  },
};

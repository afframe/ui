/**
 * Copyright IBM Corp. 2022, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, plain CSS story styles; redundant labelText and placeholder removed from second picker (args supply them); skeleton className and isOnlyTwo passed explicitly, Default story first; business example data, Disabled (color-contrast off), ReadOnly, Invalid (error linked by hand), Warning and TwentyFourHour stories; placeholder arg dropped (the time format sets it), hourCycle h12 beside the AM/PM select, TwentyFourHour without its own pattern, Afframe story for typing a time; scrollable-region-focusable off for the fluid select label. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { Information } from '../../icons.js';
import {
  FluidTimePicker,
  FluidTimePickerSelect,
  FluidTimePickerSkeleton,
  SelectItem,
  Toggletip,
  ToggletipButton,
  ToggletipContent,
  type FluidTimePickerProps,
} from '../../index.js';
import styles from './fluid-time-picker-story.css?inline';
import mdx from './FluidTimePicker.mdx';

type FluidTimePickerStoryArgs = Omit<FluidTimePickerProps, 'id'> & {
  defaultWidth?: number;
};

const timeZones = [
  <SelectItem key="utc" value="utc" text="UTC" />,
  <SelectItem key="cet" value="cet" text="Central European Time (CET)" />,
  <SelectItem key="eet" value="eet" text="Eastern European Time (EET)" />,
];

// Carbon's fluid select label is `overflow-x: scroll` without being
// focusable, so axe flags it whenever the label text overflows (timing and
// font dependent). Every story renders that label; story-level rules arrays
// replace this one, so they repeat it.
const fluidLabelRule = {
  id: 'scrollable-region-focusable',
  enabled: false,
} as const;

export default {
  title: 'Components/Fluid Inputs/FluidTimePicker',
  tags: ['carbon'],
  component: FluidTimePicker,
  decorators: [
    (Story) => (
      <>
        <style>{styles}</style>
        <Story />
      </>
    ),
  ],
  parameters: {
    styles,
    a11y: { config: { rules: [fluidLabelRule] } },
    docs: {
      page: mdx,
    },
  },
  subcomponents: {
    FluidTimePickerSelect,
    FluidTimePickerSkeleton,
  },
} satisfies Meta<typeof FluidTimePicker>;

export const Default: StoryFn<FluidTimePickerStoryArgs> = (args) => {
  function ClockToggletip({ className }: { className: string }) {
    return (
      <span className={`fluid-time-picker-story__toggletip ${className}`}>
        <Toggletip align="top-left">
          <ToggletipButton label="Show information">
            <Information />
          </ToggletipButton>
          <ToggletipContent>
            <p>Additional field information here.</p>
          </ToggletipContent>
        </Toggletip>
      </span>
    );
  }
  return (
    <div style={{ width: '350px' }}>
      <div className="fluid-time-picker-story">
        <FluidTimePicker id="time-picker-1" {...args}>
          <FluidTimePickerSelect id="select-1" labelText="AM/PM">
            <SelectItem value="am" text="AM" />
            <SelectItem value="pm" text="PM" />
          </FluidTimePickerSelect>
          <FluidTimePickerSelect id="select-2" labelText="Time zone">
            {timeZones}
          </FluidTimePickerSelect>
        </FluidTimePicker>
        <ClockToggletip className="fluid-time-picker-story__toggletip--three-inputs" />
      </div>
      <br />
      <br />
      <div className="fluid-time-picker-story">
        <FluidTimePicker id="time-picker-2" {...args}>
          <FluidTimePickerSelect id="select-3" labelText="AM/PM">
            <SelectItem value="am" text="AM" />
            <SelectItem value="pm" text="PM" />
          </FluidTimePickerSelect>
        </FluidTimePicker>
        <ClockToggletip className="fluid-time-picker-story__toggletip--two-inputs" />
      </div>
    </div>
  );
};

// The AM/PM select needs the 12-hour mask; the default is 24-hour.
Default.args = {
  hourCycle: 'h12',
  className: 'test-class',
  disabled: false,
  invalid: false,
  labelText: 'Start time',
  invalidText: 'Enter a time as hh:mm.',
  readOnly: false,
  warn: false,
  warnText: 'This time is outside business hours.',
};

Default.argTypes = {
  className: {
    control: { type: 'text' },
  },
  defaultValue: {
    control: { type: 'text' },
  },
  disabled: {
    control: { type: 'boolean' },
  },
  labelText: {
    control: { type: 'text' },
  },
  invalid: {
    control: { type: 'boolean' },
  },
  invalidText: {
    control: { type: 'text' },
  },
  placeholder: {
    control: { type: 'text' },
  },
  onChange: {
    action: 'onChange',
  },
  onClick: {
    action: 'onClick',
  },
  readOnly: {
    control: { type: 'boolean' },
  },
  value: {
    control: { type: 'text' },
  },
  warn: {
    control: { type: 'boolean' },
  },
  warnText: {
    control: { type: 'text' },
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

Default.parameters = {
  controls: {
    include: [...Object.keys(Default.argTypes)],
  },
};

export const Disabled: StoryFn<FluidTimePickerStoryArgs> = Default.bind({});
Disabled.args = { ...Default.args, disabled: true };
// Carbon greys out disabled text below 4.5:1. WCAG 1.4.3 exempts inactive
// components, but axe checks it anyway.
Disabled.parameters = {
  ...Default.parameters,
  a11y: {
    config: {
      rules: [{ id: 'color-contrast', enabled: false }, fluidLabelRule],
    },
  },
};
Disabled.argTypes = Default.argTypes;

export const ReadOnly: StoryFn<FluidTimePickerStoryArgs> = Default.bind({});
ReadOnly.args = { ...Default.args, readOnly: true, defaultValue: '9:30' };
ReadOnly.parameters = Default.parameters;
ReadOnly.argTypes = Default.argTypes;

// Carbon renders the error without an id and sets no aria-invalid (an upstream
// bug), so the story links its own span by hand.
export const Invalid: StoryFn<FluidTimePickerStoryArgs> = (args) => (
  <div style={{ width: '350px' }}>
    <FluidTimePicker
      id="time-picker-invalid"
      {...args}
      invalidText={
        <span id="time-picker-invalid-error">{args.invalidText}</span>
      }
      {...(args.invalid && {
        'aria-invalid': true,
        'aria-describedby': 'time-picker-invalid-error',
      })}>
      <FluidTimePickerSelect id="select-invalid-1" labelText="AM/PM">
        <SelectItem value="am" text="AM" />
        <SelectItem value="pm" text="PM" />
      </FluidTimePickerSelect>
      <FluidTimePickerSelect id="select-invalid-2" labelText="Time zone">
        {timeZones}
      </FluidTimePickerSelect>
    </FluidTimePicker>
  </div>
);
Invalid.args = { ...Default.args, invalid: true, defaultValue: '9:75' };
Invalid.parameters = Default.parameters;
Invalid.argTypes = Default.argTypes;

export const Warning: StoryFn<FluidTimePickerStoryArgs> = Default.bind({});
Warning.args = { ...Default.args, warn: true, defaultValue: '7:30' };
Warning.parameters = Default.parameters;
Warning.argTypes = Default.argTypes;

// The default 24-hour mask takes 00:00 to 23:59, so no AM/PM select. The
// time zone select stays: without a select Carbon sizes the input to half the
// width.
export const TwentyFourHour: StoryFn<FluidTimePickerStoryArgs> = (args) => (
  <div style={{ width: '350px' }}>
    <FluidTimePicker id="time-picker-24h" {...args}>
      <FluidTimePickerSelect id="select-24h" labelText="Time zone">
        {timeZones}
      </FluidTimePickerSelect>
    </FluidTimePicker>
  </div>
);
TwentyFourHour.args = { ...Default.args, hourCycle: 'h23' };
TwentyFourHour.parameters = Default.parameters;
TwentyFourHour.argTypes = Default.argTypes;

export const Skeleton: StoryFn = () => {
  return (
    <div style={{ width: 300 }}>
      <FluidTimePickerSkeleton className="" isOnlyTwo={false} />
      <br />
      <br />
      <FluidTimePickerSkeleton className="" isOnlyTwo />
    </div>
  );
};

export const TypingATime: StoryObj<typeof FluidTimePicker> = {
  tags: ['afframe'],
  parameters: {
    a11y: {
      config: {
        rules: [...afframeA11y.a11y.config.rules, fluidLabelRule],
      },
    },
  },
  render: () => (
    <div style={{ width: '350px' }}>
      <FluidTimePicker id="time-picker-typing" labelText="Start time">
        <FluidTimePickerSelect id="select-typing" labelText="Time zone">
          {timeZones}
        </FluidTimePickerSelect>
      </FluidTimePicker>
      <br />
      <FluidTimePicker
        id="time-picker-typing-seconds"
        labelText="Duration"
        seconds>
        <FluidTimePickerSelect id="select-typing-seconds" labelText="Time zone">
          {timeZones}
        </FluidTimePickerSelect>
      </FluidTimePicker>
    </div>
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

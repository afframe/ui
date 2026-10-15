/**
 * Copyright IBM Corp. 2022, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, plain CSS story styles; redundant labelText and placeholder removed from second picker (args supply them); skeleton className and isOnlyTwo passed explicitly, Default story first; business example data, Disabled (color-contrast off), ReadOnly, Invalid (error linked by hand), Warning and TwentyFourHour stories. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
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

Default.args = {
  className: 'test-class',
  disabled: false,
  invalid: false,
  labelText: 'Start time',
  invalidText: 'Enter a time as hh:mm.',
  placeholder: 'hh:mm',
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
  a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
};
Disabled.argTypes = Default.argTypes;

export const ReadOnly: StoryFn<FluidTimePickerStoryArgs> = Default.bind({});
ReadOnly.args = { ...Default.args, readOnly: true, defaultValue: '9:30' };
ReadOnly.parameters = Default.parameters;
ReadOnly.argTypes = Default.argTypes;

// Carbon renders the error without an id and sets no aria-invalid (upstream
// issue drafted, not filed), so the story links its own span by hand.
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

// The pattern accepts 00:00 to 23:59, so no AM/PM select. The time zone
// select stays: without a select Carbon sizes the input to half the width.
// FluidTimePickerProps omits pattern, but Carbon passes it on to the input.
const twentyFourHourInput = { pattern: '(?:[01]\\d|2[0-3]):[0-5]\\d' };

export const TwentyFourHour: StoryFn<FluidTimePickerStoryArgs> = (args) => (
  <div style={{ width: '350px' }}>
    <FluidTimePicker id="time-picker-24h" {...twentyFourHourInput} {...args}>
      <FluidTimePickerSelect id="select-24h" labelText="Time zone">
        {timeZones}
      </FluidTimePickerSelect>
    </FluidTimePicker>
  </div>
);
TwentyFourHour.args = { ...Default.args };
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

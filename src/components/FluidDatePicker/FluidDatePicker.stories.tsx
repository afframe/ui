/**
 * Copyright IBM Corp. 2022, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, plain CSS story styles; typed args; datePickerType comes from args; unsupported skeleton props removed, story names unified, args split between FluidDatePicker and FluidDatePickerInput, Czech date format and example data, state stories added. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { Information } from '../../icons.js';
import {
  FluidDatePicker,
  FluidDatePickerInput,
  FluidDatePickerSkeleton,
  Toggletip,
  ToggletipButton,
  ToggletipContent,
  type DatePickerInputProps,
  type FluidDatePickerProps,
  type FluidDatePickerSkeletonProps,
} from '../../index.js';
import styles from './fluid-date-picker-story.css?inline';
import mdx from './FluidDatePicker.mdx';

export default {
  title: 'Components/Fluid Inputs/FluidDatePicker',
  tags: ['carbon'],
  component: FluidDatePicker,
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
    FluidDatePickerSkeleton,
  },
} satisfies Meta<typeof FluidDatePicker>;

type FluidDatePickerArgs = FluidDatePickerProps &
  Partial<DatePickerInputProps> & {
    defaultWidth?: number;
    datePickerType?: 'simple' | 'single' | 'range';
    allowInput?: boolean;
    closeOnSelect?: boolean;
    dateFormat?: string;
    maxDate?: string;
    minDate?: string;
    short?: boolean;
    value?: string;
  };

const sharedArgs: FluidDatePickerArgs = {
  allowInput: true,
  closeOnSelect: true,
  dateFormat: 'd.m.Y',
  disabled: false,
  helperText: '',
  invalid: false,
  invalidText: 'Enter the due date as dd.mm.yyyy, for example 15.10.2026.',
  maxDate: '',
  minDate: '',
  placeholder: 'dd.mm.yyyy',
  readOnly: false,
  short: false,
  size: 'md',
  warn: false,
  warnText:
    'The due date is in the past. Check it before you send the invoice.',
};

const sharedArgTypes: ArgTypes = {
  allowInput: {
    control: 'boolean',
  },
  closeOnSelect: {
    control: 'boolean',
  },
  dateFormat: {
    control: 'text',
  },
  onChange: {
    action: 'onChange',
  },
  onClose: {
    action: 'onClose',
  },
  onOpen: {
    action: 'onOpen',
  },
  disabled: {
    control: { type: 'boolean' },
    table: {
      category: 'DatePickerInput',
    },
  },
  readOnly: {
    control: { type: 'boolean' },
  },
  invalid: {
    control: { type: 'boolean' },
  },
  invalidText: {
    control: { type: 'text' },
    table: {
      category: 'DatePickerInput',
    },
  },
  helperText: {
    control: { type: 'text' },
    table: {
      category: 'DatePickerInput',
    },
  },
  maxDate: {
    control: 'text',
  },
  minDate: {
    control: 'text',
  },
  placeholder: {
    control: { type: 'text' },
    table: {
      category: 'DatePickerInput',
    },
  },
  short: {
    control: { type: 'boolean' },
  },
  size: {
    control: 'select',
    options: ['sm', 'md', 'lg'],
    table: {
      category: 'DatePickerInput',
    },
  },
  warn: {
    control: { type: 'boolean' },
  },
  warnText: {
    control: { type: 'text' },
    table: {
      category: 'DatePickerInput',
    },
  },
};

// FluidDatePicker passes unknown props to DatePicker, which spreads them onto
// its div; FluidDatePickerInput spreads its own onto the input. So each gets
// only its own args. The picker sets the fluid invalid, warn and read-only
// classes and clones those three into its inputs.
function splitArgs(args: FluidDatePickerArgs) {
  const picker: Partial<FluidDatePickerArgs> = {};
  const input: Partial<FluidDatePickerArgs> = {};
  for (const [key, value] of Object.entries(args)) {
    const target =
      sharedArgTypes[key]?.table?.category === 'DatePickerInput'
        ? input
        : picker;
    Object.assign(target, { [key]: value });
  }
  return { picker, input };
}

const datePickerTypeArgType: ArgTypes[string] = {
  control: 'select',
  options: ['simple', 'single', 'range'],
  table: { readonly: true },
};

const defaultWidthArgType: ArgTypes[string] = {
  control: { type: 'range', min: 240, max: 640, step: 16 },
};

const sharedParameters = {
  controls: {
    include: [...Object.keys(sharedArgTypes), 'datePickerType', 'defaultWidth'],
  },
};

const LabelToggletip = () => (
  // Keep the toggletip outside `labelText`; interactive content is invalid in labels.
  <span className="fluid-date-picker-story__toggletip">
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

export const Default: StoryFn<FluidDatePickerArgs> = (args) => {
  const { defaultWidth, ...datePickerArgs } = args;
  const { picker, input } = splitArgs(datePickerArgs);
  return (
    <div className="fluid-date-picker-story" style={{ width: defaultWidth }}>
      <LabelToggletip />
      <FluidDatePicker {...picker}>
        <FluidDatePickerInput
          placeholder="dd.mm.yyyy"
          labelText="Due date"
          id="date-picker-simple"
          {...input}
        />
      </FluidDatePicker>
    </div>
  );
};

Default.args = {
  ...sharedArgs,
  datePickerType: 'simple',
  defaultWidth: 288,
};
Default.argTypes = {
  ...sharedArgTypes,
  datePickerType: datePickerTypeArgType,
  defaultWidth: defaultWidthArgType,
};
Default.parameters = sharedParameters;

export const SingleWithCalendar: StoryFn<FluidDatePickerArgs> = (args) => {
  const { defaultWidth, ...datePickerArgs } = args;
  const { picker, input } = splitArgs(datePickerArgs);
  return (
    <div className="fluid-date-picker-story" style={{ width: defaultWidth }}>
      <LabelToggletip />
      <FluidDatePicker {...picker}>
        <FluidDatePickerInput
          style={{ width: defaultWidth }}
          placeholder="dd.mm.yyyy"
          labelText="Due date"
          id="date-picker-single"
          {...input}
        />
      </FluidDatePicker>
    </div>
  );
};

SingleWithCalendar.args = {
  ...sharedArgs,
  datePickerType: 'single',
  defaultWidth: 288,
};
SingleWithCalendar.argTypes = {
  ...sharedArgTypes,
  datePickerType: datePickerTypeArgType,
  defaultWidth: defaultWidthArgType,
};
SingleWithCalendar.parameters = sharedParameters;

export const RangeWithCalendar: StoryFn<FluidDatePickerArgs> = (args) => {
  const { defaultWidth, ...datePickerArgs } = args;
  const { picker, input } = splitArgs(datePickerArgs);
  return (
    <div
      className="fluid-date-picker-story fluid-date-picker-story--range"
      style={{ width: defaultWidth }}>
      <LabelToggletip />
      <FluidDatePicker {...picker}>
        <FluidDatePickerInput
          id="date-picker-input-id-start"
          placeholder="dd.mm.yyyy"
          labelText="Billing period start"
          size="md"
          {...input}
        />
        <FluidDatePickerInput
          id="date-picker-input-id-finish"
          placeholder="dd.mm.yyyy"
          labelText="Billing period end"
          size="md"
          {...input}
        />
      </FluidDatePicker>
    </div>
  );
};

RangeWithCalendar.args = {
  ...sharedArgs,
  datePickerType: 'range',
  defaultWidth: 288,
};
RangeWithCalendar.argTypes = {
  ...sharedArgTypes,
  datePickerType: datePickerTypeArgType,
  defaultWidth: defaultWidthArgType,
};
RangeWithCalendar.parameters = sharedParameters;

type StateStory = StoryObj<FluidDatePickerArgs>;

const stateStory = (args: Partial<FluidDatePickerArgs>): StateStory => ({
  render: SingleWithCalendar,
  args: { ...sharedArgs, datePickerType: 'single', defaultWidth: 288, ...args },
  argTypes: {
    ...sharedArgTypes,
    datePickerType: datePickerTypeArgType,
    defaultWidth: defaultWidthArgType,
  },
  parameters: sharedParameters,
});

export const Disabled = stateStory({ disabled: true });

export const ReadOnly = stateStory({ readOnly: true, value: '15.10.2026' });

export const Invalid = stateStory({ invalid: true });

export const Warning = stateStory({ warn: true });

export const Skeleton: StoryFn<
  FluidDatePickerSkeletonProps & { defaultWidth?: number }
> = (args) => {
  const { className = '', defaultWidth } = args;
  return (
    <div style={{ width: defaultWidth }}>
      <FluidDatePickerSkeleton className={className} datePickerType="simple" />
      <br />
      <br />
      <FluidDatePickerSkeleton className={className} datePickerType="single" />
      <br />
      <br />
      <FluidDatePickerSkeleton className={className} datePickerType="range" />
    </div>
  );
};

Skeleton.args = {
  className: '',
  defaultWidth: 300,
};

Skeleton.argTypes = {
  className: { control: 'text' },
  defaultWidth: defaultWidthArgType,
};

Skeleton.parameters = {
  controls: { include: Object.keys(Skeleton.argTypes) },
};

/**
 * Copyright IBM Corp. 2022, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, plain CSS story styles; typed args; datePickerType comes from args; unsupported skeleton props removed. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
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
  title: 'Components/Fluid Components/FluidDatePicker',
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
  };

const sharedArgs: FluidDatePickerArgs = {
  allowInput: true,
  closeOnSelect: true,
  dateFormat: 'm/d/Y',
  disabled: false,
  helperText: '',
  invalid: false,
  invalidText:
    'Error message that is really long can wrap to more lines but should not be excessively long.',
  maxDate: '',
  minDate: '',
  placeholder: 'mm/dd/yyyy',
  readOnly: false,
  short: false,
  size: 'md',
  warn: false,
  warnText:
    'Warning message that is really long can wrap to more lines but should not be excessively long.',
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
    table: {
      category: 'DatePickerInput',
    },
  },
  invalid: {
    control: { type: 'boolean' },
    table: {
      category: 'DatePickerInput',
    },
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
    table: {
      category: 'DatePickerInput',
    },
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
    table: {
      category: 'DatePickerInput',
    },
  },
  warnText: {
    control: { type: 'text' },
    table: {
      category: 'DatePickerInput',
    },
  },
};

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

export const Simple: StoryFn<FluidDatePickerArgs> = (args) => {
  const { defaultWidth, ...datePickerArgs } = args;
  return (
    <div className="fluid-date-picker-story" style={{ width: defaultWidth }}>
      <LabelToggletip />
      <FluidDatePicker {...datePickerArgs}>
        <FluidDatePickerInput
          placeholder="mm/dd/yyyy"
          labelText="Label"
          id="date-picker-simple"
          {...datePickerArgs}
        />
      </FluidDatePicker>
    </div>
  );
};

Simple.args = {
  ...sharedArgs,
  datePickerType: 'simple',
  defaultWidth: 288,
};
Simple.argTypes = {
  ...sharedArgTypes,
  datePickerType: datePickerTypeArgType,
  defaultWidth: defaultWidthArgType,
};
Simple.parameters = sharedParameters;

export const Single: StoryFn<FluidDatePickerArgs> = (args) => {
  const { defaultWidth, ...datePickerArgs } = args;
  return (
    <div className="fluid-date-picker-story" style={{ width: defaultWidth }}>
      <LabelToggletip />
      <FluidDatePicker {...datePickerArgs}>
        <FluidDatePickerInput
          style={{ width: defaultWidth }}
          placeholder="mm/dd/yyyy"
          labelText="Label"
          id="date-picker-single"
          {...datePickerArgs}
        />
      </FluidDatePicker>
    </div>
  );
};

Single.args = {
  ...sharedArgs,
  datePickerType: 'single',
  defaultWidth: 288,
};
Single.argTypes = {
  ...sharedArgTypes,
  datePickerType: datePickerTypeArgType,
  defaultWidth: defaultWidthArgType,
};
Single.parameters = sharedParameters;

export const RangeWithCalendar: StoryFn<FluidDatePickerArgs> = (args) => {
  const { defaultWidth, ...datePickerArgs } = args;
  return (
    <div className="fluid-date-picker-story" style={{ width: defaultWidth }}>
      <LabelToggletip />
      <FluidDatePicker {...datePickerArgs}>
        <FluidDatePickerInput
          id="date-picker-input-id-start"
          placeholder="mm/dd/yyyy"
          labelText="Label"
          size="md"
          {...datePickerArgs}
        />
        <FluidDatePickerInput
          id="date-picker-input-id-finish"
          placeholder="mm/dd/yyyy"
          labelText="End date"
          size="md"
          {...datePickerArgs}
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

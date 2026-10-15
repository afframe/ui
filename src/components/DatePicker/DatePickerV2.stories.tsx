/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, title Preview/preview__DatePicker, source tag, story names unified, Czech date format and example data, state stories added; date format and placeholders from the system setting. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { WithLayer } from '../../../.storybook/templates/WithLayer/index.js';
import { datePlaceholder, defaultDatePattern } from '../../format/index.js';
import { FolderOpen, Folders, View } from '../../icons.js';
import {
  AILabel,
  AILabelActions,
  AILabelContent,
  Button,
  IconButton,
  preview__DatePicker,
} from '../../index.js';
import mdx from './DatePickerV2.mdx';

const { DatePicker, DatePickerInput, DatePickerSkeleton } = preview__DatePicker;

// Shared args flow into both DatePicker and DatePickerInput.
interface DatePickerStoryArgs {
  datePickerType?: 'simple' | 'single' | 'range';
  readOnly: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  invalid?: boolean;
  invalidText?: string;
  placeholder?: string;
  warn?: boolean;
  warnText?: string;
  helperText?: string;
  onChange?: (...args: unknown[]) => void;
  onClose?: (...args: unknown[]) => void;
  onOpen?: (...args: unknown[]) => void;
}

export default {
  title: 'Preview/preview__DatePicker',
  component: DatePicker,
  tags: ['carbon'],
  subcomponents: {
    DatePickerInput,
  },

  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    light: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta;

const sharedArgTypes = {
  onChange: {
    action: 'onChange',
  },
  onClose: {
    action: 'onClose',
  },
  onOpen: {
    action: 'onOpen',
  },
  readOnly: {
    control: {
      type: 'boolean',
    },
  },
  size: {
    options: ['sm', 'md', 'lg'],
    control: { type: 'select' },
    table: {
      category: 'DatePickerInput',
    },
  },
  disabled: {
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
  placeholder: {
    control: { type: 'text' },
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
  helperText: {
    control: { type: 'text' },
    table: {
      category: 'DatePickerInput',
    },
  },
} satisfies ArgTypes<DatePickerStoryArgs>;

export const Default: StoryFn<DatePickerStoryArgs> = (args) => {
  const { readOnly, ...restArgs } = args;

  return (
    <DatePicker
      datePickerType="single"

      {...restArgs}
      readOnly={readOnly}>
      <DatePickerInput
        labelText="Due date"
        id="date-picker-single"
        {...restArgs}
      />
      {restArgs.datePickerType === 'range' && (
        <DatePickerInput
          labelText="Billing period end"
          size="md"
          id="date-picker-input-2"
          {...restArgs}
        />
      )}
    </DatePicker>
  );
};

Default.argTypes = {
  ...sharedArgTypes,
  datePickerType: {
    options: ['single', 'simple', 'range'],
    control: { type: 'select' },
  },
};

export const RangeWithCalendar: StoryFn<DatePickerStoryArgs> = (args) => {
  return (
    <DatePicker datePickerType="range" {...args}>
      <DatePickerInput
        id="date-picker-input-id-start"
        labelText="Billing period start"
        size="md"
        {...args}
      />
      <DatePickerInput
        id="date-picker-input-id-finish"
        labelText="Billing period end"
        size="md"
        {...args}
      />
    </DatePicker>
  );
};

RangeWithCalendar.argTypes = { ...sharedArgTypes };

export const RangeWithCalendarWithLayer: StoryFn<DatePickerStoryArgs> = (
  args
) => (
  <WithLayer>
    {(layer) => (
      <DatePicker datePickerType="range" {...args}>
        <DatePickerInput
          id={`date-picker-input-id-start-${layer}`}
          labelText="Billing period start"
          size="md"
          {...args}
        />
        <DatePickerInput
          id={`date-picker-input-id-finish-${layer}`}
          labelText="Billing period end"
          size="md"
          {...args}
        />
      </DatePicker>
    )}
  </WithLayer>
);

RangeWithCalendarWithLayer.argTypes = { ...sharedArgTypes };

export const Simple: StoryFn<DatePickerStoryArgs> = (args) => (
  <DatePicker datePickerType="simple" {...args}>
    <DatePickerInput labelText="Due date" id="date-picker-simple" {...args} />
  </DatePicker>
);

Simple.argTypes = { ...sharedArgTypes };

export const SimpleWithLayer: StoryFn<DatePickerStoryArgs> = (args) => (
  <WithLayer>
    {(layer) => (
      <DatePicker datePickerType="simple" {...args}>
        <DatePickerInput
          labelText="Due date"
          id={`date-picker-simple-${layer}`}
          size="md"
          {...args}
        />
      </DatePicker>
    )}
  </WithLayer>
);

SimpleWithLayer.argTypes = { ...sharedArgTypes };

export const SingleWithCalendar: StoryFn<DatePickerStoryArgs> = (args) => (
  <DatePicker datePickerType="single" {...args}>
    <DatePickerInput
      labelText="Due date"
      id="date-picker-single"
      size="md"
      {...args}
    />
  </DatePicker>
);

SingleWithCalendar.argTypes = { ...sharedArgTypes };

export const SingleWithCalendarWithLayer: StoryFn<DatePickerStoryArgs> = (
  args
) => (
  <WithLayer>
    {(layer) => (
      <DatePicker datePickerType="single" {...args}>
        <DatePickerInput
          labelText="Due date"
          id={`date-picker-single-${layer}`}
          size="md"
          {...args}
        />
      </DatePicker>
    )}
  </WithLayer>
);

SingleWithCalendarWithLayer.argTypes = { ...sharedArgTypes };

type StateStory = StoryObj<DatePickerStoryArgs>;

export const Disabled: StateStory = {
  render: SingleWithCalendar,
  args: { disabled: true },
  argTypes: { ...sharedArgTypes },
};

export const ReadOnly: StateStory = {
  render: SingleWithCalendar,
  args: { readOnly: true },
  argTypes: { ...sharedArgTypes },
};

export const Invalid: StateStory = {
  render: SingleWithCalendar,
  args: {
    invalid: true,
    invalidText: `Enter the date as ${datePlaceholder(defaultDatePattern)}.`,
  },
  argTypes: { ...sharedArgTypes },
};

export const Warning: StateStory = {
  render: SingleWithCalendar,
  args: { warn: true, warnText: 'The date is in the past.' },
  argTypes: { ...sharedArgTypes },
};

export const Skeleton: StoryFn = () => <DatePickerSkeleton range />;

Skeleton.parameters = {
  percy: {
    skip: true,
  },
};

export const WithAILabel: StoryFn<DatePickerStoryArgs> = (args) => {
  const aiLabel = (
    <AILabel className="ai-label-container">
      <AILabelContent>
        <div>
          <p className="secondary">AI Explained</p>
          <h2 className="ai-label-heading">84%</h2>
          <p className="secondary bold">Confidence score</p>
          <p className="secondary">
            Lorem ipsum dolor sit amet, di os consectetur adipiscing elit, sed
            do eiusmod tempor incididunt ut fsil labore et dolore magna aliqua.
          </p>
          <hr />
          <p className="secondary">Model type</p>
          <p className="bold">Foundation model</p>
        </div>
        <AILabelActions>
          <IconButton kind="ghost" label="View">
            <View />
          </IconButton>
          <IconButton kind="ghost" label="Open Folder">
            <FolderOpen />
          </IconButton>
          <IconButton kind="ghost" label="Folders">
            <Folders />
          </IconButton>
          <Button>View details</Button>
        </AILabelActions>
      </AILabelContent>
    </AILabel>
  );
  return (
    <div style={{ width: 400 }}>
      <DatePicker datePickerType="single" {...args}>
        <DatePickerInput
          labelText="Due date"
          size="md"
          id="date-picker"
          decorator={aiLabel}
          {...args}
        />
      </DatePicker>
    </div>
  );
};

WithAILabel.argTypes = { ...sharedArgTypes };

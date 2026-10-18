/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, unused imports removed, useDocumentLang from .storybook, source tag, story names unified, args split between DatePicker and DatePickerInput, Czech date format and example data, datePickerType control, state stories and WeekStartsMonday added; date format and placeholders from the system setting, TypingADate story added. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { useDocumentLang } from '../../../.storybook/useDocumentLang.js';
import { WithLayer } from '../../../.storybook/templates/WithLayer/index.js';
import { datePlaceholder, defaultDatePattern } from '../../format/index.js';
import { FolderOpen, Folders, View } from '../../icons.js';
import {
  AILabel,
  AILabelActions,
  AILabelContent,
  Button,
  IconButton,
  DatePicker,
  DatePickerInput,
  DatePickerSkeleton,
} from '../../index.js';
import mdx from './DatePicker.mdx';
import { playTypingADate } from './playTypingADate.js';

interface DatePickerStoryArgs {
  datePickerType?: 'simple' | 'single' | 'range';
  dateFormat?: string;
  value?: string;
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
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['carbon'],
  subcomponents: {
    DatePickerInput,
    DatePickerSkeleton,
  },
  parameters: {
    docs: {
      page: mdx,
    },
    controls: {
      exclude: ['appendTo', 'disable', 'enable', 'inline', 'locale', 'value'],
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

const invalidText = `Enter the date as ${datePlaceholder(defaultDatePattern)}.`;
const warnText = 'The date is in the past.';

const sharedArgs = { invalidText, warnText };

const sharedArgTypes = {
  datePickerType: {
    control: false,
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

// DatePicker spreads unknown props onto its div and DatePickerInput onto its
// input, so each gets only its own args. DatePicker clones readOnly, invalid
// and warn into its inputs. invalidText goes only with a hand-set invalid: an
// input's invalidText replaces the message of a typed invalid date.
function splitArgs(args: DatePickerStoryArgs) {
  const picker: Partial<DatePickerStoryArgs> = {};
  const input: Partial<DatePickerStoryArgs> = {};
  for (const [key, value] of Object.entries(args)) {
    if (key === 'invalidText' && !args.invalid) continue;
    const argType = (sharedArgTypes as ArgTypes)[key];
    const target =
      argType?.table?.category === 'DatePickerInput' ? input : picker;
    Object.assign(target, { [key]: value });
  }
  return { picker, input };
}

export const Default: StoryFn<DatePickerStoryArgs> = (args) => {
  const locale = useDocumentLang().split('-')[0];
  const { picker, input } = splitArgs(args);
  const range = picker.datePickerType === 'range';
  return (
    <DatePicker datePickerType="single" {...picker} locale={locale}>
      <DatePickerInput
        labelText={range ? 'Billing period start' : 'Due date'}
        id="date-picker-single"
        {...input}
      />
      {range && (
        <DatePickerInput
          labelText="Billing period end"
          size="md"
          id="date-picker-input-2"
          {...input}
        />
      )}
    </DatePicker>
  );
};

Default.args = { ...sharedArgs, datePickerType: 'single' };

Default.argTypes = {
  ...sharedArgTypes,
  datePickerType: {
    options: ['single', 'simple', 'range'],
    control: { type: 'select' },
  },
};

export const Simple: StoryFn<DatePickerStoryArgs> = (args) => {
  const { picker, input } = splitArgs(args);
  return (
    <DatePicker datePickerType="simple" {...picker}>
      <DatePickerInput
        labelText="Due date"
        id="date-picker-simple"
        {...input}
      />
    </DatePicker>
  );
};

Simple.args = { ...sharedArgs };
Simple.argTypes = { ...sharedArgTypes };

export const SingleWithCalendar: StoryFn<DatePickerStoryArgs> = (args) => {
  const { picker, input } = splitArgs(args);
  return (
    <DatePicker datePickerType="single" {...picker}>
      <DatePickerInput
        labelText="Due date"
        id="date-picker-single"
        size="md"
        {...input}
      />
    </DatePicker>
  );
};

SingleWithCalendar.args = { ...sharedArgs };
SingleWithCalendar.argTypes = { ...sharedArgTypes };

export const RangeWithCalendar: StoryFn<DatePickerStoryArgs> = (args) => {
  const { picker, input } = splitArgs(args);
  return (
    <DatePicker datePickerType="range" {...picker}>
      <DatePickerInput
        id="date-picker-input-id-start"
        labelText="Billing period start"
        size="md"
        {...input}
      />
      <DatePickerInput
        id="date-picker-input-id-finish"
        labelText="Billing period end"
        size="md"
        {...input}
      />
    </DatePicker>
  );
};

RangeWithCalendar.args = { ...sharedArgs };
RangeWithCalendar.argTypes = { ...sharedArgTypes };

export const SimpleWithLayer: StoryFn<DatePickerStoryArgs> = (args) => {
  const { picker, input } = splitArgs(args);
  return (
    <WithLayer>
      {(layer) => (
        <DatePicker datePickerType="simple" {...picker}>
          <DatePickerInput
            labelText="Due date"
            id={`date-picker-simple-${layer}`}
            size="md"
            warnText={warnText}
            {...input}
          />
        </DatePicker>
      )}
    </WithLayer>
  );
};

SimpleWithLayer.args = { ...sharedArgs };
SimpleWithLayer.argTypes = { ...sharedArgTypes };

export const SingleWithCalendarWithLayer: StoryFn<DatePickerStoryArgs> = (
  args
) => {
  const { picker, input } = splitArgs(args);
  return (
    <WithLayer>
      {(layer) => (
        <DatePicker datePickerType="single" {...picker}>
          <DatePickerInput
            labelText="Due date"
            id={`date-picker-single-${layer}`}
            size="md"
            warnText={warnText}
            {...input}
          />
        </DatePicker>
      )}
    </WithLayer>
  );
};

SingleWithCalendarWithLayer.args = { ...sharedArgs };
SingleWithCalendarWithLayer.argTypes = { ...sharedArgTypes };

export const RangeWithCalendarWithLayer: StoryFn<DatePickerStoryArgs> = (
  args
) => {
  const { picker, input } = splitArgs(args);
  return (
    <WithLayer>
      {(layer) => (
        <DatePicker datePickerType="range" {...picker}>
          <DatePickerInput
            id={`date-picker-input-id-start-${layer}`}
            labelText="Billing period start"
            size="md"
            {...input}
          />
          <DatePickerInput
            id={`date-picker-input-id-finish-${layer}`}
            labelText="Billing period end"
            size="md"
            {...input}
          />
        </DatePicker>
      )}
    </WithLayer>
  );
};

RangeWithCalendarWithLayer.args = { ...sharedArgs };
RangeWithCalendarWithLayer.argTypes = { ...sharedArgTypes };

// Carbon merges an object locale over flatpickr's strings for its `locale`
// key (DatePicker.js:240-247). Module scope: Carbon caches on the object.
const mondayEnglish = { locale: 'en', firstDayOfWeek: 1 };

export const WeekStartsMonday: StoryFn<DatePickerStoryArgs> = (args) => {
  const { picker, input } = splitArgs(args);
  return (
    <DatePicker datePickerType="single" {...picker} locale={mondayEnglish}>
      <DatePickerInput
        labelText="Invoice date"
        id="date-picker-week-starts-monday"
        size="md"
        {...input}
      />
    </DatePicker>
  );
};

WeekStartsMonday.args = { ...sharedArgs };
WeekStartsMonday.argTypes = { ...sharedArgTypes };

type StateStory = StoryObj<DatePickerStoryArgs>;

export const Disabled: StateStory = {
  render: SingleWithCalendar,
  args: { ...sharedArgs, disabled: true },
  argTypes: { ...sharedArgTypes },
};

export const ReadOnly: StateStory = {
  render: SingleWithCalendar,
  args: { ...sharedArgs, readOnly: true, value: '15.10.2026' },
  argTypes: { ...sharedArgTypes },
};

export const Invalid: StateStory = {
  render: SingleWithCalendar,
  args: { ...sharedArgs, invalid: true },
  argTypes: { ...sharedArgTypes },
};

export const Warning: StateStory = {
  render: SingleWithCalendar,
  args: { ...sharedArgs, warn: true },
  argTypes: { ...sharedArgTypes },
};

export const Skeleton: StoryFn = () => {
  return <DatePickerSkeleton range />;
};

export const WithAILabel: StoryFn<DatePickerStoryArgs> = (args) => {
  const { picker, input } = splitArgs(args);
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
      <DatePicker datePickerType="single" {...picker}>
        <DatePickerInput
          labelText="Due date"
          size="md"
          id="date-picker"
          decorator={aiLabel}
          {...input}
        />
      </DatePicker>
    </div>
  );
};

WithAILabel.args = { ...sharedArgs };
WithAILabel.argTypes = { ...sharedArgTypes };

export const TypingADate: StoryObj<DatePickerStoryArgs> = {
  tags: ['afframe'],
  parameters: { ...afframeA11y },
  render: (args) => (
    <DatePicker datePickerType="single" {...splitArgs(args).picker}>
      <DatePickerInput labelText="Due date" id="date-picker-typing" />
    </DatePicker>
  ),
  play: ({ canvasElement }) => playTypingADate(canvasElement),
};

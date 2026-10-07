/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, unused imports removed, Carbon's internal useDocumentLang inlined, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useSyncExternalStore } from 'react';
import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { WithLayer } from '../../../.storybook/templates/WithLayer/index.js';
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

// Carbon's internal useDocumentLang: the <html> lang, or the browser language.
function subscribeDocumentLang(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang'],
  });
  return () => observer.disconnect();
}

function useDocumentLang() {
  return useSyncExternalStore(
    subscribeDocumentLang,
    () => document.documentElement.lang || window.navigator.language || ''
  );
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
      exclude: [
        'appendTo',
        'datePickerType',
        'disable',
        'enable',
        'inline',
        'locale',
        'value',
      ],
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

const sharedArgs = {
  invalidText: 'Error message goes here',
  warnText: 'Warning message goes here',
};

// Add sharedArgs to each story's .args so they flow through {...args} automatically

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

export const Default: StoryFn<DatePickerStoryArgs> = ({
  readOnly,
  ...args
}) => {
  const locale = useDocumentLang().split('-')[0];
  return (
    <DatePicker
      datePickerType="single"
      {...args}
      readOnly={readOnly}
      locale={locale}>
      <DatePickerInput
        placeholder="mm/dd/yyyy"
        labelText="Date Picker label"
        id="date-picker-single"
        {...args}
      />
      {args.datePickerType === 'range' && (
        <DatePickerInput
          placeholder="mm/dd/yyyy"
          labelText="End date"
          size="md"
          id="date-picker-input-2"
          {...args}
        />
      )}
    </DatePicker>
  );
};

Default.args = { ...sharedArgs };

Default.argTypes = {
  ...sharedArgTypes,
  datePickerType: {
    options: ['single', 'simple', 'range'],
    control: { type: 'select' },
  },
};

export const Simple: StoryFn<DatePickerStoryArgs> = (args) => {
  return (
    <DatePicker datePickerType="simple" {...args}>
      <DatePickerInput
        placeholder="mm/dd/yyyy"
        labelText="Date Picker label"
        id="date-picker-simple"
        {...args}
      />
    </DatePicker>
  );
};

Simple.args = { ...sharedArgs };
Simple.argTypes = { ...sharedArgTypes };

export const SingleWithCalendar: StoryFn<DatePickerStoryArgs> = (args) => {
  return (
    <DatePicker datePickerType="single" {...args}>
      <DatePickerInput
        placeholder="mm/dd/yyyy"
        labelText="Date Picker label"
        id="date-picker-single"
        size="md"
        {...args}
      />
    </DatePicker>
  );
};

SingleWithCalendar.args = { ...sharedArgs };
SingleWithCalendar.argTypes = { ...sharedArgTypes };

export const RangeWithCalendar: StoryFn<DatePickerStoryArgs> = (args) => {
  return (
    <DatePicker datePickerType="range" {...args}>
      <DatePickerInput
        id="date-picker-input-id-start"
        placeholder="mm/dd/yyyy"
        labelText="Start date"
        size="md"
        {...args}
      />
      <DatePickerInput
        id="date-picker-input-id-finish"
        placeholder="mm/dd/yyyy"
        labelText="End date"
        size="md"
        {...args}
      />
    </DatePicker>
  );
};

RangeWithCalendar.args = { ...sharedArgs };
RangeWithCalendar.argTypes = { ...sharedArgTypes };

export const SimpleWithLayer: StoryFn<DatePickerStoryArgs> = (args) => {
  return (
    <WithLayer>
      {(layer) => (
        <DatePicker datePickerType="simple" {...args}>
          <DatePickerInput
            placeholder="mm/dd/yyyy"
            labelText="Date Picker label"
            id={`date-picker-simple-${layer}`}
            size="md"
            invalidText="Error message goes here"
            warnText="Warning message goes here"
            {...args}
          />
        </DatePicker>
      )}
    </WithLayer>
  );
};

SimpleWithLayer.argTypes = { ...sharedArgTypes };

export const SingleWithCalendarWithLayer: StoryFn<DatePickerStoryArgs> = (
  args
) => {
  return (
    <WithLayer>
      {(layer) => (
        <DatePicker datePickerType="single" {...args}>
          <DatePickerInput
            placeholder="mm/dd/yyyy"
            labelText="Date Picker label"
            id={`date-picker-single-${layer}`}
            size="md"
            invalidText="Error message goes here"
            warnText="Warning message goes here"
            {...args}
          />
        </DatePicker>
      )}
    </WithLayer>
  );
};

SingleWithCalendarWithLayer.argTypes = { ...sharedArgTypes };

export const RangeWithCalendarWithLayer: StoryFn<DatePickerStoryArgs> = (
  args
) => (
  <WithLayer>
    {(layer) => (
      <DatePicker datePickerType="range" {...args}>
        <DatePickerInput
          id={`date-picker-input-id-start-${layer}`}
          placeholder="mm/dd/yyyy"
          labelText="Start date"
          size="md"
          {...args}
        />
        <DatePickerInput
          id={`date-picker-input-id-finish-${layer}`}
          placeholder="mm/dd/yyyy"
          labelText="End date"
          size="md"
          {...args}
        />
      </DatePicker>
    )}
  </WithLayer>
);

RangeWithCalendarWithLayer.args = { ...sharedArgs };
RangeWithCalendarWithLayer.argTypes = { ...sharedArgTypes };

export const Skeleton: StoryFn = () => {
  return <DatePickerSkeleton range />;
};

export const withAILabel: StoryFn<DatePickerStoryArgs> = (args) => {
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
          placeholder="mm/dd/yyyy"
          labelText="Date Picker label"
          size="md"
          id="date-picker"
          decorator={aiLabel}
          {...args}
        />
      </DatePicker>
    </div>
  );
};

withAILabel.args = { ...sharedArgs };
withAILabel.argTypes = { ...sharedArgTypes };

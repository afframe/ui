/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, Carbon's internal useDocumentLang from .storybook/useDocumentLang, id added to the AI label story, source tag, story names unified, Afframe example data, Disabled, ReadOnly, Invalid and Warning stories. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useState } from 'react';
import type { ComponentProps } from 'react';
import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { FolderOpen, Folders, View } from '../../icons.js';
import {
  AILabel,
  AILabelActions,
  AILabelContent,
  Button,
  IconButton,
  NumberInput,
  NumberInputSkeleton,
  validateNumberSeparators,
} from '../../index.js';
import { useDocumentLang } from '../../../.storybook/useDocumentLang.js';
import mdx from './NumberInput.mdx';

// Stories pass their own id.
type NumberInputStoryArgs = Omit<ComponentProps<typeof NumberInput>, 'id'> & {
  id?: string;
};

export default {
  title: 'Components/NumberInput',
  component: NumberInput,
  tags: ['carbon'],
  parameters: {
    subcomponents: {
      NumberInputSkeleton,
    },
    docs: {
      page: mdx,
    },
    controls: {
      exclude: ['id', 'defaultValue', 'light', 'translateWithId'],
    },
  },
} satisfies Meta<typeof NumberInput>;

const sharedArgTypes = {
  allowEmpty: { control: { type: 'boolean' } },
  disableWheel: { control: { type: 'boolean' } },
  min: { control: { type: 'number' } },
  max: { control: { type: 'number' } },
  step: { control: { type: 'number' } },
  disabled: { control: { type: 'boolean' } },
  invalid: { control: { type: 'boolean' } },
  invalidText: { control: { type: 'text' } },
  warn: { control: { type: 'boolean' } },
  warnText: { control: { type: 'text' } },
  size: {
    options: ['sm', 'md', 'lg'],
    control: { type: 'select' },
  },
  label: { control: { type: 'text' } },
  helperText: { control: { type: 'text' } },
  hideLabel: { control: { type: 'boolean' } },
  hideSteppers: { control: { type: 'boolean' } },
  inputMode: {
    options: [
      'none',
      'text',
      'tel',
      'url',
      'email',
      'numeric',
      'decimal',
      'search',
    ],
    control: { type: 'select' },
  },
  readOnly: { control: { type: 'boolean' } },
  type: {
    options: ['number', 'text'],
    control: { type: 'select' },
  },
} satisfies ArgTypes<NumberInputStoryArgs>;

const reusableProps = {
  min: -100000000,
  max: 100000000,
};

const sharedArgs = {
  allowEmpty: false,
  disableWheel: false,
  disabled: false,
  helperText: 'Units on the invoice line',
  invalid: false,
  invalidText: 'Enter a valid quantity.',
  label: 'Quantity',
  hideLabel: false,
  hideSteppers: false,
  inputMode: 'decimal',
  readOnly: false,
  size: 'md',
  step: 1,
  type: 'number',
  warn: false,
  warnText: 'This quantity is more than the stock on hand.',
} satisfies NumberInputStoryArgs;

const textArgs = {
  ...sharedArgs,
  formatOptions: {},
  inputMode: 'decimal',
  locale: 'en-US',
  max: reusableProps.max,
  min: reusableProps.min,
  stepStartValue: 0,
  type: 'text',
} satisfies NumberInputStoryArgs;

const sharedControls = Object.keys(sharedArgTypes);
const textControls = [
  ...sharedControls,
  'formatOptions',
  'locale',
  'stepStartValue',
];

// TODO: Potential opportunity to differentiate between controlled and uncontrolled stories
export const Default: StoryFn<NumberInputStoryArgs> = (args) => {
  const [value, setValue] = useState<number | string>(50);

  const handleChange: NumberInputStoryArgs['onChange'] = (event, { value }) => {
    setValue(value);
  };

  return (
    <NumberInput
      id="default-number-input"
      value={value}
      onChange={handleChange}
      {...args}
    />
  );
};

Default.args = {
  ...sharedArgs,
  max: 100,
  min: 0,
  invalidText: 'Enter a quantity from 0 to 100.',
};

Default.argTypes = { ...sharedArgTypes };

Default.parameters = {
  controls: {
    include: sharedControls,
  },
};

export const WithAILabel: StoryFn<NumberInputStoryArgs> = (args) => {
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
      <NumberInput
        id="number-input-ai-label"
        defaultValue={50}
        decorator={aiLabel}
        {...args}
      />
    </div>
  );
};

WithAILabel.argTypes = { ...sharedArgTypes };

WithAILabel.args = {
  ...sharedArgs,
  invalidText: 'Enter a valid quantity.',
  max: reusableProps.max,
  min: reusableProps.min,
};

WithAILabel.parameters = {
  controls: {
    include: sharedControls,
  },
};

export const TextType: StoryFn<NumberInputStoryArgs> = (args) => {
  const locale = useDocumentLang();
  const { locale: localeArg, ...inputArgs } = args;

  return (
    <NumberInput
      id="default-number-input"
      defaultValue={50}
      {...inputArgs}
      locale={localeArg || locale}
    />
  );
};
TextType.args = {
  ...textArgs,
  invalidText: `Enter a quantity from ${reusableProps.min} to ${reusableProps.max}.`,
};
TextType.argTypes = {
  locale: { control: { type: 'text' } },
  stepStartValue: { control: { type: 'number' } },
  formatOptions: { control: { type: 'object' } },
  ...sharedArgTypes,
};
TextType.parameters = {
  controls: {
    include: textControls,
  },
};

export const TextTypeControlled: StoryFn<NumberInputStoryArgs> = (args) => {
  const locale = useDocumentLang();
  const [value, setValue] = useState<number | string>(NaN);
  const { locale: localeArg, ...inputArgs } = args;

  return (
    <>
      <NumberInput
        id="default-number-input"
        {...inputArgs}
        locale={localeArg || locale}
        value={value}
        onChange={(event, state) => {
          setValue(state.value);
        }}
        onBlur={action('onBlur')}
      />
      <button
        type="button"
        onClick={() => {
          setValue(50);
        }}>
        set to 50
      </button>
    </>
  );
};
TextTypeControlled.args = {
  ...textArgs,
  invalidText: `Enter a quantity from ${reusableProps.min} to ${reusableProps.max}.`,
};
TextTypeControlled.argTypes = {
  locale: { control: { type: 'text' } },
  formatOptions: { control: { type: 'object' } },
  ...sharedArgTypes,
};
TextTypeControlled.parameters = {
  controls: {
    include: textControls,
  },
};

export const TextTypeCustomValidation: StoryFn<NumberInputStoryArgs> = (
  args
) => {
  const locale = useDocumentLang();
  const [value, setValue] = useState<number | string>(NaN);
  const { locale: localeArg, ...inputArgs } = args;

  return (
    <>
      <NumberInput
        id="default-number-input"
        validate={validateNumberSeparators}
        {...inputArgs}
        locale={localeArg || locale}
        value={value}
        onChange={(event, state) => {
          setValue(state.value);
        }}
      />
      <button
        type="button"
        onClick={() => {
          setValue(1000);
        }}>
        set to 1000
      </button>
    </>
  );
};
TextTypeCustomValidation.args = {
  ...textArgs,
  allowEmpty: true,
  invalidText: `Enter a quantity from ${reusableProps.min} to ${reusableProps.max}.`,
};
TextTypeCustomValidation.argTypes = {
  locale: { control: { type: 'text' } },
  formatOptions: { control: { type: 'object' } },
  ...sharedArgTypes,
};
TextTypeCustomValidation.parameters = {
  controls: {
    include: textControls,
  },
};

export const Disabled = Default.bind({});
Disabled.args = { ...Default.args, disabled: true };
Disabled.argTypes = Default.argTypes;
// Carbon greys the helper text of a disabled field (1.7:1). WCAG 1.4.3 exempts
// inactive controls, but axe does not tie the text to the disabled input.
Disabled.parameters = {
  ...Default.parameters,
  a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
};

export const ReadOnly = Default.bind({});
ReadOnly.args = { ...Default.args, readOnly: true };
ReadOnly.argTypes = Default.argTypes;
ReadOnly.parameters = Default.parameters;

export const Invalid = Default.bind({});
Invalid.args = { ...Default.args, invalid: true };
Invalid.argTypes = Default.argTypes;
Invalid.parameters = Default.parameters;

export const Warning = Default.bind({});
Warning.args = { ...Default.args, warn: true };
Warning.argTypes = Default.argTypes;
Warning.parameters = Default.parameters;

export const Skeleton: StoryFn<typeof NumberInputSkeleton> = (args) => {
  return <NumberInputSkeleton {...args} />;
};

Skeleton.argTypes = {
  size: {
    table: {
      defaultValue: { summary: '"md"' },
    },
  },
};

Skeleton.args = {
  size: 'md',
};

Skeleton.parameters = {
  controls: {
    include: ['size', 'hideLabel'],
  },
};

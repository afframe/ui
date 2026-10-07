/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, Carbon's internal useDocumentLang inlined, id added to the AI label story, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useState, useSyncExternalStore } from 'react';
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
import mdx from './NumberInput.mdx';

// Stories pass their own id.
type NumberInputStoryArgs = Omit<ComponentProps<typeof NumberInput>, 'id'> & {
  id?: string;
};

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
  helperText: 'Optional helper text.',
  invalid: false,
  invalidText: 'Number is not valid.',
  label: 'NumberInput label',
  hideLabel: false,
  hideSteppers: false,
  inputMode: 'decimal',
  readOnly: false,
  size: 'md',
  step: 1,
  type: 'number',
  warn: false,
  warnText:
    'Warning message that is really long can wrap to more lines but should not be excessively long.',
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
  min: -100,
  invalidText: `Number is not valid. Must be between -100 and 100`,
};

Default.argTypes = { ...sharedArgTypes };

Default.parameters = {
  controls: {
    include: sharedControls,
  },
};

export const withAILabel: StoryFn<NumberInputStoryArgs> = (args) => {
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

withAILabel.argTypes = { ...sharedArgTypes };

withAILabel.args = {
  ...sharedArgs,
  invalidText: 'Number is not valid',
  max: reusableProps.max,
  min: reusableProps.min,
};

withAILabel.parameters = {
  controls: {
    include: sharedControls,
  },
};

export const WithTypeOfText: StoryFn<NumberInputStoryArgs> = (args) => {
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
WithTypeOfText.args = {
  ...textArgs,
  invalidText: `Number is not valid. Must be between ${reusableProps.min} and ${reusableProps.max}`,
};
WithTypeOfText.argTypes = {
  locale: { control: { type: 'text' } },
  stepStartValue: { control: { type: 'number' } },
  formatOptions: { control: { type: 'object' } },
  ...sharedArgTypes,
};
WithTypeOfText.parameters = {
  controls: {
    include: textControls,
  },
};

export const WithTypeOfTextControlled: StoryFn<NumberInputStoryArgs> = (
  args
) => {
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
WithTypeOfTextControlled.args = {
  ...textArgs,
  invalidText: `Number is not valid. Must be between ${reusableProps.min} and ${reusableProps.max}`,
};
WithTypeOfTextControlled.argTypes = {
  locale: { control: { type: 'text' } },
  formatOptions: { control: { type: 'object' } },
  ...sharedArgTypes,
};
WithTypeOfTextControlled.parameters = {
  controls: {
    include: textControls,
  },
};

export const WithTypeOfCustomValidation: StoryFn<NumberInputStoryArgs> = (
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
WithTypeOfCustomValidation.args = {
  ...textArgs,
  allowEmpty: true,
  invalidText: `Number is not valid. Must be between ${reusableProps.min} and ${reusableProps.max}`,
};
WithTypeOfCustomValidation.argTypes = {
  locale: { control: { type: 'text' } },
  formatOptions: { control: { type: 'object' } },
  ...sharedArgTypes,
};
WithTypeOfCustomValidation.parameters = {
  controls: {
    include: textControls,
  },
};

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

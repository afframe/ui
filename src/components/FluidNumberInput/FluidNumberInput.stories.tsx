/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, plain CSS story styles; props type from ComponentProps (FluidNumberInputProps not exported); label arg passed as Carbon's label prop, business example data, Disabled, ReadOnly, Invalid and Warning stories. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ComponentProps } from 'react';
import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { Information } from '../../icons.js';
import {
  FluidNumberInput,
  FluidNumberInputSkeleton,
  Toggletip,
  ToggletipButton,
  ToggletipContent,
} from '../../index.js';
import styles from './fluid-number-input-story.css?inline';
import mdx from './FluidNumberInput.mdx';

export default {
  title: 'Components/Fluid Inputs/FluidNumberInput',
  tags: ['carbon'],
  component: FluidNumberInput,
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
    FluidNumberInputSkeleton,
  },
} satisfies Meta<typeof FluidNumberInput>;

const defaultWidthArgType: ArgTypes[string] = {
  control: { type: 'range', min: 300, max: 800, step: 50 },
};

type FluidNumberInputStoryArgs = ComponentProps<typeof FluidNumberInput> & {
  defaultWidth?: number;
  placeholder?: string;
};

export const Default: StoryFn<FluidNumberInputStoryArgs> = (args) => {
  const { defaultWidth, ...numberInputArgs } = args;
  return (
    <div className="fluid-number-input-story" style={{ width: defaultWidth }}>
      {/* Keep the toggletip outside `label`; interactive content is invalid in labels. */}
      <span className="fluid-number-input-story__toggletip">
        <Toggletip align="top-left">
          <ToggletipButton label="Show information">
            <Information />
          </ToggletipButton>
          <ToggletipContent>
            <p>Additional field information here.</p>
          </ToggletipContent>
        </Toggletip>
      </span>
      <FluidNumberInput {...numberInputArgs} />
    </div>
  );
};

Default.args = {
  allowEmpty: false,
  className: '',
  defaultWidth: 400,
  defaultValue: 10,
  disableWheel: false,
  disabled: false,
  iconDescription: 'Adjust number',
  id: 'input-default',
  inputMode: 'decimal',
  invalid: false,
  invalidText: 'Enter a quantity from 1 to 100.',
  label: 'Quantity',
  locale: 'en-US',
  max: 100,
  min: 1,
  placeholder: '',
  readOnly: false,
  step: 1,
  type: 'number',
  warn: false,
  warnText: 'Only 5 in stock.',
};

Default.argTypes = {
  allowEmpty: {
    control: 'boolean',
  },
  className: {
    control: 'text',
  },
  defaultWidth: defaultWidthArgType,
  defaultValue: {
    control: 'number',
  },
  disableWheel: {
    control: 'boolean',
  },
  invalid: {
    control: {
      type: 'boolean',
    },
  },
  invalidText: {
    control: {
      type: 'text',
    },
  },
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  iconDescription: {
    control: 'text',
  },
  id: {
    control: 'text',
  },
  inputMode: {
    control: 'select',
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
  },
  label: {
    control: 'text',
  },
  locale: {
    control: 'text',
  },
  max: {
    control: 'number',
  },
  min: {
    control: 'number',
  },
  onChange: {
    action: 'onChange',
  },
  onClick: {
    action: 'onClick',
  },
  onKeyUp: {
    action: 'onKeyUp',
  },
  placeholder: {
    control: 'text',
  },
  readOnly: {
    control: 'boolean',
  },
  step: {
    control: 'number',
  },
  type: {
    control: 'select',
    options: ['number', 'text'],
  },
  warn: {
    control: {
      type: 'boolean',
    },
  },
  warnText: {
    control: {
      type: 'text',
    },
  },
};

Default.parameters = {
  controls: { include: Object.keys(Default.argTypes ?? {}) },
};

const stateStory = (id: string, args: Partial<FluidNumberInputStoryArgs>) => {
  const story: StoryFn<FluidNumberInputStoryArgs> = Default.bind({});
  story.args = { ...Default.args, id, ...args };
  story.argTypes = Default.argTypes;
  story.parameters = Default.parameters;
  return story;
};

export const Disabled = stateStory('fluid-number-input-disabled', {
  disabled: true,
});

export const ReadOnly = stateStory('fluid-number-input-read-only', {
  readOnly: true,
});

export const Invalid = stateStory('fluid-number-input-invalid', {
  defaultValue: 120,
  invalid: true,
});

export const Warning = stateStory('fluid-number-input-warning', {
  defaultValue: 8,
  warn: true,
});

export const Skeleton: StoryFn<
  ComponentProps<typeof FluidNumberInputSkeleton> & { defaultWidth?: number }
> = (args) => {
  const { defaultWidth, ...skeletonArgs } = args;
  return (
    <div style={{ width: defaultWidth }}>
      <FluidNumberInputSkeleton {...skeletonArgs} />
    </div>
  );
};

Skeleton.args = {
  className: '',
  defaultWidth: 400,
};

Skeleton.argTypes = {
  className: { control: 'text' },
  defaultWidth: defaultWidthArgType,
};

Skeleton.parameters = {
  controls: { include: Object.keys(Skeleton.argTypes) },
};

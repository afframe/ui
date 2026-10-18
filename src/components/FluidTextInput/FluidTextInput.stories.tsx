/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, plain CSS story styles; distinct id for the toggletip story (a11y); unsupported skeleton props removed; boolean table default summaries as strings; unused upstream test.css import removed, business example data, toggletip story renamed, Disabled, ReadOnly, Invalid and Warning stories, error linked by aria-describedby in Invalid. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { Information } from '../../icons.js';
import {
  FluidTextInput,
  FluidTextInputSkeleton,
  Toggletip,
  ToggletipButton,
  ToggletipContent,
  type FluidTextInputProps,
} from '../../index.js';
import styles from './fluid-text-input-story.css?inline';
import mdx from './FluidTextInput.mdx';

export default {
  title: 'Components/Fluid Inputs/FluidTextInput',
  tags: ['carbon'],
  component: FluidTextInput,
  decorators: [
    (Story) => (
      <>
        <style>{styles}</style>
        <Story />
      </>
    ),
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    styles,
    docs: {
      page: mdx,
    },
    controls: {
      exclude: ['isPassword'],
    },
  },
  subcomponents: {
    FluidTextInputSkeleton,
  },
} satisfies Meta<typeof FluidTextInput>;

export const Default: StoryFn<FluidTextInputProps> = (args) => {
  return <FluidTextInput {...args} />;
};

const sharedArgTypes: ArgTypes = {
  className: {
    control: { type: 'text' },
    description:
      'Specify an optional className to be applied to the outer FluidForm wrapper.',
    table: { defaultValue: { summary: 'undefined' } },
  },
  disabled: {
    control: { type: 'boolean' },
    description: 'Specify whether the `<input>` should be disabled.',
    table: { defaultValue: { summary: 'false' } },
  },
  enableCounter: {
    control: { type: 'boolean' },
    description: 'Specify whether to display the character counter.',
    table: { defaultValue: { summary: 'false' } },
  },
  invalid: {
    control: { type: 'boolean' },
    description: 'Specify whether the control is currently invalid.',
    table: { defaultValue: { summary: 'false' } },
  },
  invalidText: {
    control: { type: 'text' },
    description:
      'Provide the text that is displayed when the control is in an invalid state.',
    table: { defaultValue: { summary: 'undefined' } },
  },
  labelText: {
    control: { type: 'text' },
    description:
      'Provide the text that will be read by a screen reader when visiting this control.',
    table: { defaultValue: { summary: 'required' } },
  },
  maxCount: {
    control: { type: 'number' },
    description:
      'Max character count allowed for the textInput. This is needed in order for enableCounter to display.',
    table: { defaultValue: { summary: 'undefined' } },
  },
  placeholder: {
    control: { type: 'text' },
    description: 'Specify the placeholder attribute for the `<input>`.',
    table: { defaultValue: { summary: 'undefined' } },
  },
  readOnly: {
    control: { type: 'boolean' },
    description: 'Whether or not the component is readonly.',
    table: { defaultValue: { summary: 'false' } },
  },
  warn: {
    control: { type: 'boolean' },
    description: 'Specify whether the control is currently in warning state.',
    table: { defaultValue: { summary: 'false' } },
  },
  warnText: {
    control: { type: 'text' },
    description:
      'Provide the text that is displayed when the control is in warning state.',
    table: { defaultValue: { summary: 'undefined' } },
  },
};

const sharedArgs = {
  className: 'test-class',
  disabled: false,
  enableCounter: false,
  id: 'input-1',
  invalid: false,
  invalidText: 'Enter a company name.',
  labelText: 'Company name',
  maxCount: 500,
  placeholder: '',
  readOnly: false,
  warn: false,
  warnText: 'Another customer already uses this name.',
} satisfies Partial<FluidTextInputProps>;

const sharedControls = Object.keys(sharedArgTypes);

Default.args = {
  ...sharedArgs,
};

Default.argTypes = {
  ...sharedArgTypes,
};

Default.parameters = {
  controls: { include: sharedControls },
};

export const WithToggletip: StoryFn<FluidTextInputProps> = (args) => {
  const labelToggletip = (
    // Keep the toggletip outside `labelText`; interactive content is invalid in labels.
    <span className="fluid-text-input-story__toggletip">
      <Toggletip align="top-left" autoAlign>
        <ToggletipButton label="Show information">
          <Information />
        </ToggletipButton>
        <ToggletipContent>
          <p>Additional field information here.</p>
        </ToggletipContent>
      </Toggletip>
    </span>
  );
  return (
    <div className="fluid-text-input-story">
      {labelToggletip}
      <FluidTextInput {...args} labelText="Company name" />
    </div>
  );
};

WithToggletip.args = {
  ...sharedArgs,
  id: 'text-input-toggletip',
};
WithToggletip.argTypes = {
  ...sharedArgTypes,
};
WithToggletip.parameters = {
  controls: {
    include: sharedControls.filter((control) => control !== 'labelText'),
  },
};

// Carbon's props type omits aria-describedby, which it still forwards.
const stateStory = (
  id: string,
  args: Partial<FluidTextInputProps> & { 'aria-describedby'?: string }
) => {
  const story: StoryFn<FluidTextInputProps> = Default.bind({});
  story.args = { ...sharedArgs, id, ...args };
  story.argTypes = sharedArgTypes;
  story.parameters = { controls: { include: sharedControls } };
  return story;
};

export const Disabled = stateStory('fluid-text-input-disabled', {
  disabled: true,
});

export const ReadOnly = stateStory('fluid-text-input-read-only', {
  defaultValue: 'Lakeside Furniture',
  readOnly: true,
});

// Carbon 1.118 points aria-errormessage at the error but adds no live region
// or aria-describedby, which fails axe's aria-valid-attr-value. FluidTextInput
// passes rest props to TextInput, which spreads them after its own
// aria-describedby, so the error id links it. The gap is an upstream bug.
export const Invalid = stateStory('fluid-text-input-invalid', {
  invalid: true,
  'aria-describedby': 'fluid-text-input-invalid-error-msg',
});

export const Warning = stateStory('fluid-text-input-warning', { warn: true });

export const Skeleton: StoryFn = () => {
  return <FluidTextInputSkeleton />;
};

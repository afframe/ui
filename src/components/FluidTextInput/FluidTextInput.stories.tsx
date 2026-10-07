/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, plain CSS story styles; id added to Default and toggletip stories (a11y); unsupported skeleton props removed. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { Information } from '../../icons.js';
import {
  FluidTextInput,
  FluidTextInputSkeleton,
  Toggletip,
  ToggletipButton,
  ToggletipContent,
  type FluidTextInputProps,
} from '../../index.js';
import './test.css';
import styles from './fluid-text-input-story.css?inline';
import mdx from './FluidTextInput.mdx';

export default {
  title: 'Components/Fluid Components/FluidTextInput',
  tags: ['carbon'],
  component: FluidTextInput,
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
    controls: {
      exclude: ['isPassword'],
    },
  },
  subcomponents: {
    FluidTextInputSkeleton,
  },
} satisfies Meta<typeof FluidTextInput>;

export const Default: StoryFn<
  FluidTextInputProps & { defaultWidth?: number }
> = (args) => {
  const { defaultWidth, ...textInputArgs } = args;
  return (
    <div style={{ width: defaultWidth }}>
      <FluidTextInput {...textInputArgs} />
    </div>
  );
};

Default.args = {
  defaultWidth: 300,
  id: 'text-input-1',
  placeholder: 'Placeholder text',
  invalid: false,
  invalidText:
    'Error message that is really long can wrap to more lines but should not be excessively long.',
  disabled: false,
  labelText: 'Label',
  warn: false,
  warnText:
    'Warning message that is really long can wrap to more lines but should not be excessively long.',
};

Default.argTypes = {
  defaultWidth: {
    control: { type: 'range', min: 300, max: 800, step: 50 },
  },
  className: {
    control: {
      type: 'text',
    },
  },
  defaultValue: {
    control: {
      type: 'text',
    },
  },
  placeholder: {
    control: {
      type: 'text',
    },
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
  labelText: {
    control: {
      type: 'text',
    },
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
  value: {
    control: {
      type: 'text',
    },
  },
};

export const DefaultWithToggletip: StoryFn = () => {
  const labelToggletip = (
    <span className="fluid-text-input-story__toggletip">
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
  return (
    <div className="fluid-text-input-story">
      {labelToggletip}
      <FluidTextInput
        id="text-input-toggletip"
        labelText="Label"
        placeholder="Placeholder text"
      />
    </div>
  );
};

export const Skeleton: StoryFn = () => {
  return (
    <div style={{ width: '300px' }}>
      <FluidTextInputSkeleton />
    </div>
  );
};

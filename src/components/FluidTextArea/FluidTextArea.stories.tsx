/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, plain CSS story styles; typed args; business example data, ids per story, layer and toggletip stories renamed, Disabled, ReadOnly, Invalid and Warning stories. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { Information } from '../../icons.js';
import {
  FluidTextArea,
  FluidTextAreaSkeleton,
  Toggletip,
  ToggletipButton,
  ToggletipContent,
  type FluidTextAreaProps,
} from '../../index.js';
import { WithLayer as WithLayerTemplate } from '../../../.storybook/templates/WithLayer/index.js';
import styles from './fluid-text-area-story.css?inline';
import mdx from './FluidTextArea.mdx';

export default {
  title: 'Components/Fluid Inputs/FluidTextArea',
  tags: ['carbon'],
  component: FluidTextArea,
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
      exclude: ['id', 'value', 'defaultValue'],
    },
  },
  subcomponents: {
    FluidTextAreaSkeleton,
  },
  argTypes: {
    hideLabel: {
      table: {
        disable: true,
      },
    },
    helperText: {
      table: {
        disable: true,
      },
    },
    light: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof FluidTextArea>;

const defaultWidthArgType: ArgTypes[string] = {
  control: { type: 'range', min: 300, max: 800, step: 50 },
};

const sharedArgTypes: ArgTypes = {
  className: {
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
  cols: {
    control: {
      type: 'number',
    },
  },
  defaultWidth: defaultWidthArgType,
  enableCounter: {
    control: {
      type: 'boolean',
    },
  },
  labelText: {
    control: {
      type: 'text',
    },
  },
  maxCount: {
    control: {
      type: 'number',
    },
  },
  onChange: {
    action: 'onChange',
  },
  onClick: {
    action: 'onClick',
  },
  readOnly: {
    control: {
      type: 'boolean',
    },
  },
  rows: {
    control: {
      type: 'number',
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
};

const sharedArgs = {
  className: 'test-class',
  cols: 40,
  defaultWidth: 300,
  disabled: false,
  enableCounter: false,
  invalid: false,
  id: 'fluid-text-area',
  invalidText: 'Enter a note of 500 characters or fewer.',
  labelText: 'Note',
  maxCount: 500,
  placeholder: '',
  readOnly: false,
  rows: 4,
  warn: false,
  warnText: 'Customers see this note on the invoice.',
};

export const Default: StoryFn<
  FluidTextAreaProps & { defaultWidth?: number }
> = (args) => {
  const { defaultWidth, ...textAreaArgs } = args;
  return (
    <div style={{ width: defaultWidth }}>
      <FluidTextArea {...textAreaArgs} />
    </div>
  );
};

Default.args = {
  ...sharedArgs,
};

Default.argTypes = {
  ...sharedArgTypes,
};

export const WithLayer: StoryFn<
  FluidTextAreaProps & { defaultWidth?: number }
> = (args) => {
  const { defaultWidth, ...textAreaArgs } = args;
  return (
    <WithLayerTemplate>
      {(layer) => (
        <div style={{ width: defaultWidth }}>
          <FluidTextArea {...textAreaArgs} id={`text-area-${layer}`} />
        </div>
      )}
    </WithLayerTemplate>
  );
};

WithLayer.args = {
  ...sharedArgs,
};

WithLayer.argTypes = {
  ...sharedArgTypes,
};

export const WithToggletip: StoryFn<
  FluidTextAreaProps & { defaultWidth?: number }
> = (args) => {
  const { defaultWidth, ...textAreaArgs } = args;
  const labelToggletip = (
    <span className="fluid-text-area-story__toggletip">
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
    <div className="fluid-text-area-story" style={{ width: defaultWidth }}>
      {labelToggletip}
      <FluidTextArea {...textAreaArgs} labelText="Note" />
    </div>
  );
};

WithToggletip.args = {
  ...sharedArgs,
  id: 'fluid-text-area-toggletip',
};

WithToggletip.argTypes = {
  ...sharedArgTypes,
};

WithToggletip.parameters = {
  controls: {
    exclude: ['id', 'value', 'defaultValue', 'labelText'],
  },
};

type FluidTextAreaStoryArgs = FluidTextAreaProps & { defaultWidth?: number };

const stateStory = (id: string, args: Partial<FluidTextAreaStoryArgs>) => {
  const story: StoryFn<FluidTextAreaStoryArgs> = Default.bind({});
  story.args = { ...sharedArgs, id, ...args };
  story.argTypes = sharedArgTypes;
  return story;
};

export const Disabled = stateStory('fluid-text-area-disabled', {
  disabled: true,
});

export const ReadOnly = stateStory('fluid-text-area-read-only', {
  defaultValue: 'Delivered to the reception desk.',
  readOnly: true,
});

// Carbon renders the error with role="alert", so it is announced without the
// FluidTextInput aria-describedby recipe (TextArea overwrites that prop anyway).
export const Invalid = stateStory('fluid-text-area-invalid', { invalid: true });

export const Warning = stateStory('fluid-text-area-warning', { warn: true });

export const Skeleton: StoryFn<
  FluidTextAreaProps & { defaultWidth?: number }
> = (args) => {
  const { defaultWidth } = args;
  return (
    <div style={{ width: defaultWidth }}>
      <FluidTextAreaSkeleton />
    </div>
  );
};

Skeleton.args = { defaultWidth: sharedArgs.defaultWidth };
Skeleton.argTypes = { defaultWidth: defaultWidthArgType };
Skeleton.parameters = { controls: { include: ['defaultWidth'] } };

/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, plain CSS story styles; typed args. Apache-2.0 text: LICENSES/Apache-2.0.txt.
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
import { WithLayer } from '../../../.storybook/templates/WithLayer/index.js';
import styles from './fluid-text-area-story.css?inline';
import mdx from './FluidTextArea.mdx';

export default {
  title: 'Components/Fluid Components/FluidTextArea',
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
  invalidText:
    'Error message that is really long can wrap to more lines but should not be excessively long.',
  labelText: 'Text Area label',
  maxCount: 500,
  placeholder: 'Placeholder text',
  readOnly: false,
  rows: 4,
  warn: false,
  warnText: 'This is a warning message.',
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

export const DefaultWithLayers: StoryFn<
  FluidTextAreaProps & { defaultWidth?: number }
> = (args) => {
  const { defaultWidth, ...textAreaArgs } = args;
  return (
    <WithLayer>
      {(layer) => (
        <div style={{ width: defaultWidth }}>
          <FluidTextArea {...textAreaArgs} id={`text-area-${layer}`} />
        </div>
      )}
    </WithLayer>
  );
};

DefaultWithLayers.args = {
  ...sharedArgs,
};

DefaultWithLayers.argTypes = {
  ...sharedArgTypes,
};

export const DefaultWithToggletip: StoryFn<
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
      <FluidTextArea {...textAreaArgs} labelText="Text Area label" />
    </div>
  );
};

DefaultWithToggletip.args = {
  ...sharedArgs,
};

DefaultWithToggletip.argTypes = {
  ...sharedArgTypes,
};

DefaultWithToggletip.parameters = {
  controls: {
    exclude: ['id', 'value', 'defaultValue', 'labelText'],
  },
};

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

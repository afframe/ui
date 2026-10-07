/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, Button and ButtonSet from @afframe/ui, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Button, ButtonSet } from '../../index.js';
import {
  fluidButtonLabels,
  fluidButtonMapping,
  fluidButtonOptions,
} from '../Button/__story__/fluid-button-set-args.js';
import type { FluidButton } from '../Button/__story__/fluid-button-set-args.js';

interface ButtonSetStoryArgs {
  // An option index in args; the control mapping turns it into buttons.
  Buttons?: number | FluidButton[];
  'Container width'?: number;
  'Container visible'?: boolean;
  fluid?: boolean;
  stacked?: boolean;
}

export default {
  title: 'Components/Button/Set Of Buttons',
  component: ButtonSet,
  subcomponents: { Button },
  tags: ['carbon'],

  args: {
    Buttons: 4,
    'Container width': 600,
    'Container visible': false,
  },

  argTypes: {
    Buttons: {
      control: {
        type: 'select',
        labels: fluidButtonLabels,
      },
      options: fluidButtonOptions,
      mapping: fluidButtonMapping,
      description: 'Sets the number and type of buttons in the set',
      table: { category: 'story controls' },
    },

    'Container width': {
      control: {
        type: 'range',
        min: 280,
        max: 1200,
        step: 1,
      },
      description: 'Sets the width of the ButtonSet container',
      if: { arg: 'fluid', truthy: true },
      table: { category: 'story controls' },
    },

    'Container visible': {
      control: {
        type: 'boolean',
      },
      if: { arg: 'fluid', truthy: true },
      description: 'Show the ButtonSet container using Carbon layer styling',
      table: { category: 'story controls' },
    },
  },
} satisfies Meta<ButtonSetStoryArgs>;

export const Default: StoryObj<ButtonSetStoryArgs> = {
  render: (args) => {
    const buttons = args.Buttons as FluidButton[] | undefined;
    const containerStyle: CSSProperties = {
      inlineSize: args['Container width']
        ? `${args['Container width']}px`
        : undefined,
      maxInlineSize: '100%',
    };

    if (args['Container visible']) {
      // 42px is the padding around the story
      containerStyle.boxShadow = '0 0 0 42px var(--cds-layer-01)';
    }

    if (!buttons || buttons.length === 0) {
      return <div>Select one or more buttons.</div>;
    }

    return (
      <div style={containerStyle}>
        <ButtonSet fluid={args.fluid ?? false} stacked={args.stacked ?? false}>
          {buttons.map(({ label, kind, key }) => (
            <Button key={key} kind={kind} onClick={action('onClick')}>
              {label}
            </Button>
          ))}
        </ButtonSet>
      </div>
    );
  },
};

export const Fluid: StoryObj<ButtonSetStoryArgs> = {
  render: (args) => {
    const buttons = args.Buttons as FluidButton[] | undefined;
    const containerStyle: CSSProperties = {
      inlineSize: args['Container width']
        ? `${args['Container width']}px`
        : undefined,
      maxInlineSize: '100%',
    };

    if (args['Container visible']) {
      // 42px is the padding around the story
      containerStyle.boxShadow = '0 0 0 42px var(--cds-layer-01)';
    }

    if (!buttons || buttons.length === 0) {
      return <div>Select one or more buttons.</div>;
    }

    return (
      <div style={containerStyle}>
        <ButtonSet fluid={true} stacked={args.stacked ?? false}>
          {buttons.map(({ label, kind, key }) => (
            <Button key={key} kind={kind} onClick={action('onClick')}>
              {label}
            </Button>
          ))}
        </ButtonSet>
      </div>
    );
  },
};

Fluid.args = {
  fluid: true,
  Buttons: 8,
};

// ButtonSet Fluid hidden stories for Chromatic VRT

export const FluidOneWide: StoryObj<ButtonSetStoryArgs> = {
  ...Fluid,
  args: {
    ...Fluid.args,
    Buttons: 1, // One button
    'Container width': 800,
  },
  tags: ['!dev', '!autodocs'],
};

export const FluidOneWideGhost: StoryObj<ButtonSetStoryArgs> = {
  ...Fluid,
  args: {
    ...Fluid.args,
    Buttons: 3, // A ghost button
    'Container width': 800,
  },
  tags: ['!dev', '!autodocs'],
};

export const FluidOneNarrow: StoryObj<ButtonSetStoryArgs> = {
  ...Fluid,
  args: {
    ...Fluid.args,
    Buttons: 1, // One button
    'Container width': 280,
  },
  tags: ['!dev', '!autodocs'],
};

export const FluidTwoWide: StoryObj<ButtonSetStoryArgs> = {
  ...Fluid,
  args: {
    ...Fluid.args,
    Buttons: 4, // Two buttons
    'Container width': 800,
  },
  tags: ['!dev', '!autodocs'],
};

export const FluidTwoWideGhost: StoryObj<ButtonSetStoryArgs> = {
  ...Fluid,
  args: {
    ...Fluid.args,
    Buttons: 5, // Two buttons with one ghost
    'Container width': 800,
  },
  tags: ['!dev', '!autodocs'],
};

export const FluidTwoNarrow: StoryObj<ButtonSetStoryArgs> = {
  ...Fluid,
  args: {
    ...Fluid.args,
    Buttons: 4, // Two buttons
    'Container width': 320,
  },
  tags: ['!dev', '!autodocs'],
};

export const FluidThreeWide: StoryObj<ButtonSetStoryArgs> = {
  ...Fluid,
  args: {
    ...Fluid.args,
    Buttons: 6, // Three buttons
    'Container width': 800,
  },
  tags: ['!dev', '!autodocs'],
};

export const FluidThreeWideGhost: StoryObj<ButtonSetStoryArgs> = {
  ...Fluid,
  args: {
    ...Fluid.args,
    Buttons: 7, // Three buttons with one ghost
    'Container width': 800,
  },
  tags: ['!dev', '!autodocs'],
};

export const FluidThreeNarrow: StoryObj<ButtonSetStoryArgs> = {
  ...Fluid,
  args: {
    ...Fluid.args,
    Buttons: 6, // Three buttons
    'Container width': 500,
  },
  tags: ['!dev', '!autodocs'],
};

export const FluidFourWide: StoryObj<ButtonSetStoryArgs> = {
  ...Fluid,
  args: {
    ...Fluid.args,
    Buttons: 9, // Four buttons
    'Container width': 1000,
  },
  tags: ['!dev', '!autodocs'],
};

export const FluidFourWideGhost: StoryObj<ButtonSetStoryArgs> = {
  ...Fluid,
  args: {
    ...Fluid.args,
    Buttons: 10, // Four buttons with one ghost
    'Container width': 1000,
  },
  tags: ['!dev', '!autodocs'],
};

export const FluidFourNarrow: StoryObj<ButtonSetStoryArgs> = {
  ...Fluid,
  args: {
    ...Fluid.args,
    Buttons: 9, // Four buttons
    'Container width': 600,
  },
  tags: ['!dev', '!autodocs'],
};

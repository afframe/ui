/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, unused imports removed, labelText literals that args always override removed, source tag, story names unified, business example data, helperText literals that args always override removed, Disabled (color-contrast off), ReadOnly, Invalid and Warning stories, Skeleton passes only skeleton props. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ComponentProps } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { WithLayer as WithLayerTemplate } from '../../../.storybook/templates/WithLayer/index.js';
import { FolderOpen, Folders, View } from '../../icons.js';
import {
  AILabel,
  AILabelActions,
  AILabelContent,
  Button,
  IconButton,
  TextArea,
  TextAreaSkeleton,
} from '../../index.js';
import mdx from './TextArea.mdx';

export default {
  title: 'Components/TextArea',
  component: TextArea,
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
  subcomponents: {
    TextAreaSkeleton,
  },
  argTypes: {
    className: {
      control: false,
    },
    cols: {
      control: {
        type: 'number',
      },
    },
    defaultValue: {
      control: {
        type: 'text',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    enableCounter: {
      control: {
        type: 'boolean',
      },
    },
    helperText: {
      control: {
        type: 'text',
      },
    },
    hideLabel: {
      control: {
        type: 'boolean',
      },
    },
    id: {
      control: false,
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
    placeholder: {
      control: {
        type: 'text',
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
    value: {
      control: {
        type: 'text',
      },
    },
    light: {
      table: {
        disable: true,
      },
    },
    slug: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    enableCounter: false,
    helperText: 'Shown on the invoice',
    labelText: 'Note',
    maxCount: 500,
    disabled: false,
    hideLabel: false,
    invalid: false,
    invalidText: 'Keep the note to 500 characters or fewer.',
    placeholder: '',
    rows: 4,
    warn: false,
    warnText: 'The customer sees this note.',
  },
} satisfies Meta<typeof TextArea>;

export const Default: StoryFn<typeof TextArea> = (args) => {
  return <TextArea {...args} id="text-area-1" />;
};

Default.args = {
  enableCounter: true,
};

export const Disabled: StoryFn<typeof TextArea> = Default.bind({});
Disabled.args = { disabled: true };
// Carbon greys out disabled text below 4.5:1. WCAG 1.4.3 exempts inactive
// components, but axe checks the helper text anyway.
Disabled.parameters = {
  a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
};

export const ReadOnly: StoryFn<typeof TextArea> = Default.bind({});
ReadOnly.args = {
  readOnly: true,
  defaultValue: 'Delivery to the back entrance.',
};

// Carbon puts the error in role="alert", so it is announced; it sets
// aria-describedby after the props, so the TextInput recipe does not apply.
export const Invalid: StoryFn<typeof TextArea> = Default.bind({});
Invalid.args = { invalid: true };

export const Warning: StoryFn<typeof TextArea> = Default.bind({});
Warning.args = { warn: true };

export const WithLayer: StoryFn<typeof TextArea> = (args) => (
  <WithLayerTemplate>
    {(layer) => <TextArea rows={4} id={`text-area-${layer}`} {...args} />}
  </WithLayerTemplate>
);

export const WithAILabel: StoryFn<typeof TextArea> = (args) => {
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

  return <TextArea rows={4} id="text-area-5" decorator={aiLabel} {...args} />;
};

export const Skeleton: StoryFn<
  Required<Pick<ComponentProps<typeof TextAreaSkeleton>, 'hideLabel'>>
> = ({ hideLabel }) => <TextAreaSkeleton hideLabel={hideLabel} />;
Skeleton.parameters = {
  controls: {
    include: ['hideLabel'],
  },
};

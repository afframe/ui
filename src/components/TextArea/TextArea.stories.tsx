/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, unused imports removed, labelText literals that args always override removed, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ComponentProps } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { WithLayer } from '../../../.storybook/templates/WithLayer/index.js';
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
    helperText: 'TextArea helper text',
    labelText: 'TextArea label',
    maxCount: 500,
    disabled: false,
    hideLabel: false,
    invalid: false,
    invalidText:
      'Error message that is really long can wrap to more lines but should not be excessively long.',
    placeholder: '',
    rows: 4,
    warn: false,
    warnText: 'This is a warning message.',
  },
} satisfies Meta<typeof TextArea>;

export const Default: StoryFn<typeof TextArea> = (args) => {
  return <TextArea {...args} id="text-area-1" />;
};

Default.args = {
  enableCounter: true,
};

export const _WithLayer: StoryFn<typeof TextArea> = (args) => (
  <WithLayer>
    {(layer) => (
      <TextArea
        helperText="Optional helper text"
        rows={4}
        id={`text-area-${layer}`}
        {...args}
      />
    )}
  </WithLayer>
);

_WithLayer.args = { helperText: 'Optional helper text' };
export const withAILabel: StoryFn<typeof TextArea> = (args) => {
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
    <TextArea
      helperText="Optional helper text"
      rows={4}
      id="text-area-5"
      decorator={aiLabel}
      {...args}
    />
  );
};

withAILabel.args = { helperText: 'Optional helper text' };

export const Skeleton: StoryFn<ComponentProps<typeof TextAreaSkeleton>> = (
  args
) => {
  return <TextAreaSkeleton {...args} />;
};
Skeleton.parameters = {
  controls: {
    include: ['hideLabel'],
  },
};

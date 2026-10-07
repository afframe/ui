/**
 * Copyright IBM Corp. 2022, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, plain CSS story styles; typed items. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { View, FolderOpen, Folders } from '../../icons.js';
import {
  AILabel,
  AILabelActions,
  AILabelContent,
  Button,
  FluidDropdown,
  FluidDropdownSkeleton,
  IconButton,
  type FluidDropdownProps,
} from '../../index.js';
import mdx from './FluidDropdown.mdx';

export default {
  title: 'Components/Fluid Components/FluidDropdown',
  tags: ['carbon'],
  component: FluidDropdown,
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      page: mdx,
    },
  },
  subcomponents: {
    FluidDropdownSkeleton,
  },
} satisfies Meta<typeof FluidDropdown>;

interface Item {
  id: string;
  text: string;
  disabled?: boolean;
}

const items: Item[] = [
  {
    id: 'option-0',
    text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
  },
  {
    id: 'option-1',
    text: 'Option 1',
  },
  {
    id: 'option-2',
    text: 'Option 2',
  },
  {
    id: 'option-3',
    text: 'Option 3 - a disabled item',
    disabled: true,
  },
  {
    id: 'option-4',
    text: 'Option 4',
  },
  {
    id: 'option-5',
    text: 'Option 5',
  },
];

const sharedArgTypes: ArgTypes = {
  autoAlign: {
    control: {
      type: 'boolean',
    },
  },
  className: {
    control: {
      type: 'text',
    },
  },
  isCondensed: {
    control: {
      type: 'boolean',
    },
  },
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  direction: {
    control: {
      type: 'select',
    },
    options: ['top', 'bottom'],
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
  label: {
    control: {
      type: 'text',
    },
  },
  onChange: {
    action: 'onChange',
  },
  readOnly: {
    control: {
      type: 'boolean',
    },
  },
  titleText: {
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
};

const sharedArgs: Partial<FluidDropdownProps<unknown>> = {
  autoAlign: false,
  className: 'test-class',
  direction: 'bottom',
  disabled: false,
  invalid: false,
  invalidText:
    'Error message that is really long can wrap to more lines but should not be excessively long.',
  isCondensed: false,
  label: 'Choose an option',
  readOnly: false,
  titleText: 'Label',
  warn: false,
  warnText:
    'Warning message that is really long can wrap to more lines but should not be excessively long.',
};

const sharedControls = Object.keys(sharedArgTypes);

export const Default: StoryFn<
  Partial<FluidDropdownProps<unknown>> & { defaultWidth?: number }
> = (args) => {
  return (
    <FluidDropdown
      id="default"
      titleText="Label"
      label="Choose an option"
      items={items}
      itemToString={(item: unknown) => (item ? (item as Item).text : '')}
      {...args}
    />
  );
};

Default.args = {
  ...sharedArgs,
};

Default.argTypes = {
  ...sharedArgTypes,
};

Default.parameters = {
  controls: { include: sharedControls },
};

export const Condensed: StoryFn<
  Partial<FluidDropdownProps<unknown>> & { defaultWidth?: number }
> = (args) => {
  return (
    <FluidDropdown
      id="default"
      titleText="Label"
      label="Choose an option"
      items={items}
      itemToString={(item: unknown) => (item ? (item as Item).text : '')}
      {...args}
    />
  );
};

Condensed.args = {
  ...sharedArgs,
  isCondensed: true,
};

Condensed.argTypes = {
  ...sharedArgTypes,
  isCondensed: {
    ...sharedArgTypes.isCondensed,
    table: { readonly: true },
  },
};

Condensed.parameters = {
  controls: { include: sharedControls },
};

export const withAILabel: StoryFn<
  Partial<FluidDropdownProps<unknown>> & { defaultWidth?: number }
> = (args) => {
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
    <FluidDropdown
      initialSelectedItem={items[2]}
      id="default"
      titleText="Label"
      label="Choose an option"
      items={items}
      itemToString={(item: unknown) => (item ? (item as Item).text : '')}
      decorator={aiLabel}
      {...args}
    />
  );
};

withAILabel.args = {
  ...sharedArgs,
};

withAILabel.argTypes = {
  ...sharedArgTypes,
};

withAILabel.parameters = {
  controls: { include: sharedControls },
};

export const Skeleton: StoryFn = () => <FluidDropdownSkeleton />;

/**
 * Copyright IBM Corp. 2022, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, plain CSS story styles; typed items, story names unified, payment term example data, state stories. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { View, FolderOpen, Folders } from '../../icons.js';
import {
  AILabel,
  AILabelActions,
  AILabelContent,
  Button,
  FluidComboBox,
  FluidComboBoxSkeleton,
  IconButton,
  type FluidComboBoxProps,
} from '../../index.js';
import { paymentTermItems } from '../../../.storybook/exampleData.js';
import mdx from './FluidComboBox.mdx';

export default {
  title: 'Components/Fluid Inputs/FluidComboBox',
  tags: ['carbon'],
  component: FluidComboBox,
  parameters: {
    docs: {
      page: mdx,
    },
  },
  subcomponents: {
    FluidComboBoxSkeleton,
  },
} satisfies Meta<typeof FluidComboBox>;

interface Item {
  id: string;
  text: string;
  disabled?: boolean;
}

const items: Item[] = paymentTermItems;

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
  onInputChange: {
    action: 'onInputChange',
  },
  onToggleClick: {
    action: 'onToggleClick',
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

const sharedArgs = {
  autoAlign: false,
  className: 'test-class',
  direction: 'bottom',
  disabled: false,
  invalid: false,
  invalidText: 'Choose payment terms.',
  isCondensed: false,
  label: 'Choose payment terms',
  readOnly: false,
  titleText: 'Payment terms',
  warn: false,
  warnText: "Longer than this customer's usual terms.",
} satisfies Partial<FluidComboBoxProps<unknown>>;

const sharedControls = Object.keys(sharedArgTypes);

export const Default: StoryFn<Partial<FluidComboBoxProps<unknown>>> = (
  args
) => {
  return (
    <div style={{ width: 400 }}>
      <FluidComboBox
        onChange={() => {}}
        id="default"
        titleText="Payment terms"
        label="Choose payment terms"
        items={items}
        itemToString={(item: unknown) => (item ? (item as Item).text : '')}
        {...args}
      />
    </div>
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

export const Condensed: StoryFn<Partial<FluidComboBoxProps<unknown>>> = (
  args
) => {
  return (
    <div style={{ width: 400 }}>
      <FluidComboBox
        onChange={() => {}}
        id="default"
        titleText="Payment terms"
        label="Choose payment terms"
        items={items}
        itemToString={(item: unknown) => (item ? (item as Item).text : '')}
        {...args}
      />
    </div>
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

export const WithAILabel: StoryFn<Partial<FluidComboBoxProps<unknown>>> = (
  args
) => {
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
      <FluidComboBox
        onChange={() => {}}
        id="default"
        titleText="Payment terms"
        label="Choose payment terms"
        items={items}
        itemToString={(item: unknown) => (item ? (item as Item).text : '')}
        decorator={aiLabel}
        {...args}
      />
    </div>
  );
};

WithAILabel.args = {
  ...sharedArgs,
};

WithAILabel.argTypes = {
  ...sharedArgTypes,
};

WithAILabel.parameters = {
  controls: { include: sharedControls },
};

export const Disabled: StoryFn<Partial<FluidComboBoxProps<unknown>>> =
  Default.bind({});
Disabled.args = { ...sharedArgs, disabled: true };
Disabled.argTypes = Default.argTypes;
// Carbon greys out disabled text below 4.5:1. WCAG 1.4.3 exempts inactive
// components, but axe checks the helper text anyway.
Disabled.parameters = {
  controls: { include: sharedControls },
  a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
};

export const ReadOnly: StoryFn<Partial<FluidComboBoxProps<unknown>>> =
  Default.bind({});
ReadOnly.args = {
  ...sharedArgs,
  readOnly: true,
  initialSelectedItem: items[3],
};
ReadOnly.argTypes = Default.argTypes;
ReadOnly.parameters = Default.parameters;

// Carbon 1.118 links the error text but sets no aria-invalid. ComboBox spreads
// rest props on its input, so the story passes it. Upstream issue drafted, not
// filed.
export const Invalid: StoryFn<Partial<FluidComboBoxProps<unknown>>> =
  Default.bind({});
Invalid.args = { ...sharedArgs, invalid: true, 'aria-invalid': true };
Invalid.argTypes = Default.argTypes;
Invalid.parameters = Default.parameters;

export const Warning: StoryFn<Partial<FluidComboBoxProps<unknown>>> =
  Default.bind({});
Warning.args = { ...sharedArgs, warn: true, initialSelectedItem: items[5] };
Warning.argTypes = Default.argTypes;
Warning.parameters = Default.parameters;

export const Skeleton: StoryFn = () => (
  <div style={{ width: 400 }}>
    <FluidComboBoxSkeleton />
  </div>
);

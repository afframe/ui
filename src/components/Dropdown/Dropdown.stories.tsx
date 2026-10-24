/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript (titleText argType gets a type name), components and icons from @afframe/ui, AI label story styles as plain CSS, source tag, story names unified, payment term example data, stories fit narrow screens, state stories. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { WithLayer as WithLayerTemplate } from '../../../.storybook/templates/WithLayer/index.js';
import { paymentTermItems } from '../../../.storybook/exampleData.js';
import '../AILabel/ailabel-story.css';
import {
  AILabel,
  AILabelActions,
  AILabelContent,
  Button,
  Dropdown,
  DropdownSkeleton,
  IconButton,
} from '../../index.js';
import type { DropdownProps } from '../../index.js';
import { FolderOpen, Folders, View } from '../../icons.js';
import mdx from './Dropdown.mdx';

interface Item {
  text: string;
  disabled?: boolean;
}

type StoryArgs = Partial<DropdownProps<Item>>;

const items: Item[] = paymentTermItems;

const sharedArgs = {
  'aria-label': '',
  direction: 'bottom',
  disabled: false,
  helperText: 'Applies to new invoices for this customer',
  hideLabel: false,
  invalid: false,
  invalidText: 'Choose payment terms.',
  label: 'Choose payment terms',
  readOnly: false,
  size: 'md',
  titleText: 'Payment terms',
  type: 'default',
  warn: false,
  warnText: "Longer than this customer's usual terms.",
} as const;

const sharedArgTypes = {
  'aria-label': {
    control: 'text',
  },
  autoAlign: {
    control: 'boolean',
  },
  direction: {
    control: 'select',
    options: ['top', 'bottom'],
  },
  invalid: {
    control: 'boolean',
  },
  invalidText: {
    control: 'text',
  },
  disabled: {
    control: 'boolean',
  },
  hideLabel: {
    control: 'boolean',
  },
  helperText: {
    control: 'text',
  },
  label: {
    control: 'text',
  },
  onChange: {
    action: 'onChange',
  },
  readOnly: {
    control: 'boolean',
  },
  warn: {
    control: 'boolean',
  },
  warnText: {
    control: 'text',
  },
  titleText: {
    control: 'text',
    type: {
      name: 'string',
      required: true,
    },
  },
  size: {
    options: ['xs', 'sm', 'md', 'lg'],
    control: 'select',
  },
  type: {
    control: 'select',
    options: ['default', 'inline'],
  },
} as const;

const skeletonArgs = {
  hideLabel: false,
  size: 'md',
} as const;

const skeletonArgTypes = {
  hideLabel: { control: 'boolean' },
  size: {
    control: 'select',
    options: ['xs', 'sm', 'md', 'lg'],
  },
} as const;

export default {
  title: 'Components/Dropdown',
  component: Dropdown,
  subcomponents: {
    DropdownSkeleton,
  },
  parameters: {
    docs: {
      page: mdx,
    },
    controls: {
      include: Object.keys(sharedArgTypes),
    },
  },
  tags: ['carbon'],
} satisfies Meta<typeof Dropdown>;

export const Default: StoryFn<StoryArgs> = (args) => {
  return (
    <div style={{ maxInlineSize: 400 }}>
      <Dropdown
        id="default"
        titleText="Payment terms"
        helperText="Applies to new invoices for this customer"
        label="Choose payment terms"
        items={items}
        itemToString={(item) => (item ? item.text : '')}
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

export const AutoAlign: StoryFn<StoryArgs> = (args) => {
  return (
    <div style={{ maxInlineSize: 400 }}>
      <div style={{ height: 300 }}></div>
      <Dropdown
        autoAlign={true}
        id="default"
        titleText="Payment terms"
        helperText="Applies to new invoices for this customer"
        initialSelectedItem={items[1] as Item}
        label="Net 7"
        items={items}
        itemToString={(item) => (item ? item.text : '')}
        direction="top"
        {...args}
      />
      <div style={{ height: 800 }}></div>
    </div>
  );
};

AutoAlign.argTypes = {
  ...sharedArgTypes,
};

AutoAlign.args = {
  ...sharedArgs,
  autoAlign: true,
  direction: 'top',
  label: 'Net 7',
};

export const Inline: StoryFn<StoryArgs> = (args) => {
  return (
    <div style={{ maxInlineSize: 600 }}>
      <Dropdown
        id="inline"
        titleText="Payment terms"
        initialSelectedItem={items[1] as Item}
        label="Net 7"
        type="inline"
        items={items}
        itemToString={(item) => (item ? item.text : '')}
        {...args}
      />
    </div>
  );
};

Inline.argTypes = {
  ...sharedArgTypes,
  type: {
    ...sharedArgTypes.type,
    table: { readonly: true },
  },
};

Inline.args = {
  ...sharedArgs,
  helperText: '',
  label: 'Net 7',
  type: 'inline',
};

export const WithLayer: StoryFn<StoryArgs> = (args) => (
  <WithLayerTemplate>
    {(layer) => (
      <div style={{ maxInlineSize: 400 }}>
        <Dropdown
          id={`default-${layer}`}
          titleText="Payment terms"
          helperText="Applies to new invoices for this customer"
          initialSelectedItem={items[1] as Item}
          label="Net 7"
          items={items}
          itemToString={(item) => (item ? item.text : '')}
          {...args}
        />
      </div>
    )}
  </WithLayerTemplate>
);

WithLayer.argTypes = {
  ...sharedArgTypes,
};

WithLayer.args = {
  ...sharedArgs,
  label: 'Net 7',
};

export const InlineWithLayer: StoryFn<StoryArgs> = (args) => (
  <WithLayerTemplate>
    {(layer) => (
      <div style={{ maxInlineSize: 600 }}>
        <Dropdown
          id={`inline-${layer}`}
          titleText="Payment terms"
          initialSelectedItem={items[1] as Item}
          label="Net 7"
          type="inline"
          items={items}
          itemToString={(item) => (item ? item.text : '')}
          {...args}
        />
      </div>
    )}
  </WithLayerTemplate>
);

InlineWithLayer.argTypes = {
  ...sharedArgTypes,
  type: {
    ...sharedArgTypes.type,
    table: { readonly: true },
  },
};

InlineWithLayer.args = {
  ...sharedArgs,
  helperText: '',
  label: 'Net 7',
  type: 'inline',
};

export const Disabled: StoryFn<StoryArgs> = Default.bind({});
Disabled.args = { ...sharedArgs, disabled: true };
Disabled.argTypes = Default.argTypes;
// Carbon greys out disabled text below 4.5:1. WCAG 1.4.3 exempts inactive
// components, but axe checks the helper text anyway.
Disabled.parameters = {
  a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
};

export const ReadOnly: StoryFn<StoryArgs> = Default.bind({});
ReadOnly.args = {
  ...sharedArgs,
  readOnly: true,
  initialSelectedItem: items[3] as Item,
};
ReadOnly.argTypes = Default.argTypes;

// Carbon 1.119 links the error text but sets no aria-invalid, and passes extra
// props to the wrapper, not the button. This is an upstream bug.
export const Invalid: StoryFn<StoryArgs> = Default.bind({});
Invalid.args = { ...sharedArgs, invalid: true };
Invalid.argTypes = Default.argTypes;

export const Warning: StoryFn<StoryArgs> = Default.bind({});
Warning.args = {
  ...sharedArgs,
  warn: true,
  initialSelectedItem: items[5] as Item,
};
Warning.argTypes = Default.argTypes;

export const Skeleton: StoryFn<typeof DropdownSkeleton> = (args) => {
  return (
    <div style={{ width: 300 }}>
      <DropdownSkeleton {...args} />
    </div>
  );
};

Skeleton.args = { ...skeletonArgs };
Skeleton.argTypes = { ...skeletonArgTypes };
Skeleton.parameters = {
  controls: { include: Object.keys(skeletonArgTypes) },
};

export const WithAILabel: StoryFn<StoryArgs> = (args) => {
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
    <div style={{ maxInlineSize: 400 }}>
      <Dropdown
        id="default"
        titleText="Payment terms"
        helperText="Applies to new invoices for this customer"
        initialSelectedItem={items[1] as Item}
        label="Net 7"
        items={items}
        itemToString={(item) => (item ? item.text : '')}
        decorator={aiLabel}
        {...args}
      />
    </div>
  );
};

WithAILabel.argTypes = {
  ...sharedArgTypes,
};

WithAILabel.args = {
  ...sharedArgs,
  label: 'Net 7',
};

// Hidden Test-Only Story. This story tests for a bug where the invalid-text would overlap with components below it. #19960
export const TestInvalidTextNoOverlap: StoryFn = () => {
  const items: Item[] = [
    {
      text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
    },
  ];

  return (
    <div style={{ width: 400 }}>
      <Dropdown
        id="test-1"
        titleText="Label"
        helperText="Helper text"
        label="Choose an option"
        items={items}
        itemToString={(item) => (item ? item.text : '')}
        invalid
        invalidText="Error message goes here"
      />
      <Dropdown
        titleText="Label"
        label="Choose an option"
        itemToString={(item) => (item ? item.text : '')}
        id="test-2"
        items={items}
      />
    </div>
  );
};
/*
 * This story will:
 * - Be excluded from the docs page
 * - Removed from the sidebar navigation
 * - Still be a tested variant
 */
TestInvalidTextNoOverlap.tags = ['!dev', '!autodocs'];

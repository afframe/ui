/**
 * Copyright IBM Corp. 2022, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, plain CSS story styles; label added to filterable story; typed items, story names unified, payment term example data, state stories. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { View, FolderOpen, Folders } from '../../icons.js';
import {
  AILabel,
  AILabelActions,
  AILabelContent,
  Button,
  FluidMultiSelect,
  FluidMultiSelectSkeleton,
  IconButton,
  type FluidMultiSelectProps,
} from '../../index.js';
import { WithLayer } from '../../../.storybook/templates/WithLayer/index.js';
import { paymentTermItems } from '../../../.storybook/exampleData.js';
import mdx from './FluidMultiSelect.mdx';

export default {
  title: 'Components/Fluid Inputs/FluidMultiSelect',
  tags: ['carbon'],
  component: FluidMultiSelect,
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
    FluidMultiSelectSkeleton,
  },
} satisfies Meta<typeof FluidMultiSelect>;

interface Item {
  id: string;
  text: string;
  disabled?: boolean;
}

const items: Item[] = paymentTermItems;

export const Default: StoryFn<Partial<FluidMultiSelectProps<unknown>>> = (
  args
) => {
  return (
    <FluidMultiSelect
      id="default"
      titleText="Payment terms offered"
      label="Choose payment terms"
      items={items}
      itemToString={(item: unknown) => (item ? (item as Item).text : '')}
      {...args}
    />
  );
};

const sharedArgTypes: ArgTypes = {
  autoAlign: {
    control: { type: 'boolean' },
  },
  className: {
    control: {
      type: 'text',
    },
  },
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  direction: {
    control: { type: 'select' },
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
  locale: {
    control: { type: 'text' },
  },
  onChange: {
    action: 'onChange',
  },
  onMenuChange: {
    action: 'onMenuChange',
  },
  readOnly: {
    control: { type: 'boolean' },
  },
  selectionFeedback: {
    control: { type: 'select' },
    options: ['top', 'fixed', 'top-after-reopen'],
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
  clearSelectionDescription: {
    control: { type: 'text' },
  },
  clearSelectionText: {
    control: { type: 'text' },
  },
  useTitleInItem: {
    control: { type: 'boolean' },
  },
};

const sharedArgs = {
  className: 'test-class',
  clearSelectionDescription: 'Total items selected: ',
  clearSelectionText: 'To clear selection, press Delete or Backspace.',
  direction: 'bottom',
  disabled: false,
  invalid: false,
  invalidText: 'Choose at least one payment term.',
  label: 'Choose payment terms',
  locale: 'en',
  readOnly: false,
  selectionFeedback: 'top-after-reopen',
  titleText: 'Payment terms offered',
  useTitleInItem: false,
  warn: false,
  warnText: 'Customers usually pick the longest term offered.',
} satisfies Partial<FluidMultiSelectProps<unknown>>;

const filterableArgTypes: ArgTypes = {
  ...sharedArgTypes,
  isFilterable: {
    control: { type: 'boolean' },
    table: { readonly: true },
  },
  onInputValueChange: {
    action: 'onInputValueChange',
  },
};
const condensedArgTypes: ArgTypes = {
  ...sharedArgTypes,
  isCondensed: {
    control: { type: 'boolean' },
    table: { readonly: true },
  },
};
Default.args = {
  ...sharedArgs,
};

Default.argTypes = {
  ...sharedArgTypes,
};

export const Filterable: StoryFn<Partial<FluidMultiSelectProps<unknown>>> = (
  args
) => {
  return (
    <FluidMultiSelect
      initialSelectedItems={items.slice(2, 3)}
      id="default"
      titleText="Payment terms offered"
      label="Choose payment terms"
      items={items}
      itemToString={(item: unknown) => (item ? (item as Item).text : '')}
      {...args}
    />
  );
};

Filterable.args = {
  ...sharedArgs,
  isFilterable: true,
};

Filterable.argTypes = {
  ...filterableArgTypes,
};

Filterable.parameters = {
  controls: {
    include: Object.keys(filterableArgTypes),
  },
};

export const FilterableWithLayer: StoryFn<
  Partial<FluidMultiSelectProps<unknown>>
> = (args) => {
  return (
    <WithLayer>
      {(layer) => (
        <FluidMultiSelect
          id={`carbon-multiselect-example-${layer}`}
          titleText="Payment terms offered"
          label="Choose payment terms"
          items={items}
          itemToString={(item: unknown) => (item ? (item as Item).text : '')}
          {...args}
        />
      )}
    </WithLayer>
  );
};

FilterableWithLayer.args = {
  ...sharedArgs,
  isFilterable: true,
  titleText: 'Payment terms offered',
};

FilterableWithLayer.argTypes = Filterable.argTypes;
FilterableWithLayer.parameters = Filterable.parameters;

export const Condensed: StoryFn<Partial<FluidMultiSelectProps<unknown>>> = (
  args
) => {
  return (
    <FluidMultiSelect
      id="default"
      titleText="Payment terms offered"
      label="Choose payment terms"
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
  ...condensedArgTypes,
};

Condensed.parameters = {
  controls: {
    include: Object.keys(condensedArgTypes),
  },
};

export const WithAILabel: StoryFn<Partial<FluidMultiSelectProps<unknown>>> = (
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
    <FluidMultiSelect
      initialSelectedItems={items.slice(2, 3)}
      id="default"
      titleText="Payment terms offered"
      label="Choose payment terms"
      items={items}
      itemToString={(item: unknown) => (item ? (item as Item).text : '')}
      decorator={aiLabel}
      {...args}
    />
  );
};

WithAILabel.args = {
  ...sharedArgs,
};

WithAILabel.argTypes = {
  ...sharedArgTypes,
};

export const Disabled: StoryFn<Partial<FluidMultiSelectProps<unknown>>> =
  Default.bind({});
Disabled.args = { ...sharedArgs, disabled: true };
Disabled.argTypes = Default.argTypes;
// Carbon greys out disabled text below 4.5:1. WCAG 1.4.3 exempts inactive
// components, but axe checks the helper text anyway.
Disabled.parameters = {
  a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
};

export const ReadOnly: StoryFn<Partial<FluidMultiSelectProps<unknown>>> =
  Default.bind({});
ReadOnly.args = {
  ...sharedArgs,
  readOnly: true,
  initialSelectedItems: items.slice(2, 4),
};
ReadOnly.argTypes = Default.argTypes;

// Carbon 1.119 gives the error text no id, links nothing to it and sets no
// aria-invalid; MultiSelect takes no extra props to fix it from outside.
// This is an upstream bug.
export const Invalid: StoryFn<Partial<FluidMultiSelectProps<unknown>>> =
  Default.bind({});
Invalid.args = { ...sharedArgs, invalid: true };
Invalid.argTypes = Default.argTypes;

export const Warning: StoryFn<Partial<FluidMultiSelectProps<unknown>>> =
  Default.bind({});
Warning.args = {
  ...sharedArgs,
  warn: true,
  initialSelectedItems: items.slice(2, 4),
};
Warning.argTypes = Default.argTypes;

export const Skeleton: StoryFn = () => {
  return <FluidMultiSelectSkeleton />;
};

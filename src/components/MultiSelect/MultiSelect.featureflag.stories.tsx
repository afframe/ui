/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript (label also passed as a prop, required by the MultiSelect types), components from @afframe/ui, the WithFeatureFlags decorator removed (enable-v12-release turns enable-v12-dynamic-floating-styles on globally), source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { MultiSelect } from '../../index.js';
import type { MultiSelectProps } from '../../index.js';

interface Item {
  id: string;
  text: string;
  disabled?: boolean;
}

type StoryArgs = Partial<MultiSelectProps<Item>>;

export default {
  title: 'Components/MultiSelect/Feature Flag',
  component: MultiSelect,
  tags: ['carbon', '!autodocs'],
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    direction: {
      options: ['top', 'bottom'],
      control: { type: 'radio' },
    },
    type: {
      options: ['inline', 'default'],
      control: { type: 'radio' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    invalid: {
      control: { type: 'boolean' },
    },
    light: {
      table: {
        disable: true,
      },
    },
    warn: {
      control: { type: 'boolean' },
    },
    helperText: {
      control: { type: 'text' },
    },
    invalidText: {
      control: { type: 'text' },
    },
    label: {
      control: { type: 'text' },
    },
    warnText: {
      control: { type: 'text' },
    },
  },
  parameters: {
    controls: {
      exclude: [
        'filterItems',
        'translateWithId',
        'titleText',
        'open',
        'selectedItems',
        'itemToString',
        'itemToElement',
        'locale',
        'items',
        'id',
        'initialSelectedItems',
        'sortItems',
        'compareItems',
        'downshiftProps',
      ],
    },
  },
} satisfies Meta<typeof MultiSelect>;

const comboBoxItems: Item[] = [
  {
    id: 'option-0',
    text: 'An example option that is really long to show what should be done to handle long text',
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

const sharedArgs = {
  size: 'md',
  autoAlign: false,
  type: 'default',
  titleText: 'Multiselect title',
  disabled: false,
  hideLabel: false,
  invalid: false,
  warn: false,
  helperText: 'This is helper text',
  warnText: 'Warning message goes here',
  invalidText: 'Error message goes here',
  label: 'Multiselect Label',
  clearSelectionDescription: 'Total items selected: ',
  useTitleInItem: false,
  clearSelectionText: 'To clear selection, press Delete or Backspace,',
} satisfies StoryArgs;

export const FloatingStyles: StoryFn<StoryArgs> = (args) => (
  <MultiSelect
    id="carbon-multiselect-example"
    items={comboBoxItems}
    itemToString={(item) => (item ? item.text : '')}
    selectionFeedback="top-after-reopen"
    label="Multiselect Label"
    {...args}
  />
);

FloatingStyles.args = {
  ...sharedArgs,
  direction: 'bottom',
};

FloatingStyles.argTypes = {
  direction: {
    options: ['top', 'bottom'],
    control: {
      type: 'radio',
    },
  },
};

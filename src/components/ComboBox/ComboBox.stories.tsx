/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, AI label story styles as plain CSS, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { WithLayer } from '../../../.storybook/templates/WithLayer/index.js';
import '../AILabel/ailabel-story.css';
import {
  AILabel,
  AILabelActions,
  AILabelContent,
  Button,
  ComboBox,
  IconButton,
} from '../../index.js';
import type { ComboBoxProps } from '../../index.js';
import { FolderOpen, Folders, View } from '../../icons.js';
import mdx from './ComboBox.mdx';

interface Item {
  id: string;
  text: string;
  disabled?: boolean;
}

type ItemArgs = Partial<ComboBoxProps<Item>>;
type StringArgs = Partial<ComboBoxProps<string>> &
  Pick<ComboBoxProps<string>, 'onChange'>;

const items: Item[] = [
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
    text: 'Option 3',
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
export default {
  title: 'Components/ComboBox',
  component: ComboBox,
  argTypes: {
    size: {
      options: ['xs', 'sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    light: {
      table: {
        disable: true,
      },
    },
    onChange: { action: 'onChange' },
  },
  parameters: {
    docs: {
      page: mdx,
    },
    controls: {
      exclude: [
        'aria-label',
        'id',
        'downshiftProps',
        'initialSelectedItem',
        'items',
        'itemToElement',
        'itemToString',
        'selectedItem',
        'shouldFilterItem',
        'translateWithId',
        'titleText',
        'type',
      ],
    },
  },
  tags: ['carbon'],
} satisfies Meta<typeof ComboBox>;

const sharedArgTypes = {
  onChange: {
    action: 'onChange',
  },
  onToggleClick: {
    action: 'clicked',
  },
  invalidText: {
    control: 'text',
  },
  warnText: {
    control: 'text',
  },
} as const;

export const Default: StoryFn<ItemArgs> = (args) => {
  const items: Item[] = [
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
      text: 'Option 3',
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
  return (
    <div style={{ width: 300 }}>
      <ComboBox
        id="carbon-combobox"
        items={items}
        itemToString={(item) => (item ? item.text : '')}
        titleText="Label"
        helperText="Helper text"
        invalidText="Error message goes here"
        warnText="Warning message goes here"
        onChange={action('onChange')}
        {...args}
      />
    </div>
  );
};

Default.argTypes = { ...sharedArgTypes };

export const AllowCustomValue: StoryFn<StringArgs> = (args) => {
  const filterItems = (
    menu: Parameters<NonNullable<ComboBoxProps<string>['shouldFilterItem']>>[0]
  ) => {
    return menu?.item
      ?.toLowerCase()
      .includes(String(menu?.inputValue?.toLowerCase()));
  };
  return (
    <div style={{ width: 300 }}>
      <ComboBox
        allowCustomValue
        shouldFilterItem={filterItems}
        id="carbon-combobox"
        items={['Apple', 'Orange', 'Banana', 'Pineapple', 'Raspberry', 'Lime']}
        titleText="Label"
        helperText="Helper text"
        invalidText="Error message goes here"
        warnText="Warning message goes here"
        {...args}
      />
    </div>
  );
};

AllowCustomValue.argTypes = { ...sharedArgTypes };

export const AutocompleteWithTypeahead: StoryFn<StringArgs> = (args) => {
  return (
    <div style={{ width: 300 }}>
      <ComboBox
        helperText="Helper text"
        invalidText="Error message goes here"
        warnText="Warning message goes here"
        id="carbon-combobox"
        items={[
          'Apple',
          'Apricot',
          'Avocado',
          'Banana',
          'Blackberry',
          'Blueberry',
          'Cantaloupe',
        ]}
        titleText="Label"
        {...args}
        typeahead
      />
    </div>
  );
};

AutocompleteWithTypeahead.argTypes = {
  ...sharedArgTypes,
  onChange: { action: 'onChange' },
};

export const ExperimentalAutoAlign: StoryFn<ItemArgs> = (args) => (
  <div style={{ width: 400 }}>
    <div style={{ height: 300 }}></div>
    <ComboBox
      onChange={() => {}}
      id="carbon-combobox"
      invalidText="Error message goes here"
      warnText="Warning message goes here"
      items={items}
      itemToString={(item) => (item ? item.text : '')}
      titleText="Label"
      helperText="Helper text"
      autoAlign={true}
      {...args}
    />
    <div style={{ height: 800 }}></div>
  </div>
);

ExperimentalAutoAlign.argTypes = { ...sharedArgTypes };

export const _WithLayer: StoryFn<ItemArgs> = (args) => (
  <WithLayer>
    {(layer) => (
      <div style={{ width: 300 }}>
        <ComboBox
          invalidText="Error message goes here"
          warnText="Warning message goes here"
          onChange={() => {}}
          id={`carbon-combobox-${layer}`}
          items={items}
          itemToString={(item) => (item ? item.text : '')}
          titleText="Label"
          helperText="Helper text"
          {...args}
        />
      </div>
    )}
  </WithLayer>
);

_WithLayer.argTypes = { ...sharedArgTypes };

export const withAILabel: StoryFn<ItemArgs> = (args) => {
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
  const items: Item[] = [
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
      text: 'Option 3',
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
  return (
    <div style={{ width: 300 }}>
      <ComboBox
        invalidText="Error message goes here"
        warnText="Warning message goes here"
        onChange={action('onChange')}
        id="carbon-combobox"
        items={items}
        itemToString={(item) => (item ? item.text : '')}
        titleText="Label"
        helperText="Helper text"
        decorator={aiLabel}
        {...args}
      />
    </div>
  );
};

withAILabel.argTypes = { ...sharedArgTypes };

export const Controlled: StoryFn<ItemArgs> = (args) => {
  const options: Item[] = [
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
      text: 'Option 3',
    },
  ];
  const [value, setValue] = useState<Item | null>(options[0] ?? null);
  const onChange = ({
    selectedItem,
  }: {
    selectedItem: Item | null | undefined;
  }) => {
    setValue(selectedItem ?? null);
  };

  return (
    <div>
      <ComboBox
        {...args}
        invalidText="Error message goes here"
        warnText="Warning message goes here"
        onChange={onChange}
        id="carbon-combobox"
        items={options}
        selectedItem={value}
        itemToString={(item) => (item ? item.text : '')}
        titleText="Label"
        helperText="Helper text"
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Button onClick={() => setValue(null)}>Clear</Button>
        <Button onClick={() => setValue(options[0] ?? null)}>Option 1</Button>
        <Button onClick={() => setValue(options[1] ?? null)}>Option 2</Button>
        <Button onClick={() => setValue(options[2] ?? null)}>Option 3</Button>
      </div>
    </div>
  );
};

Controlled.argTypes = { ...sharedArgTypes };
